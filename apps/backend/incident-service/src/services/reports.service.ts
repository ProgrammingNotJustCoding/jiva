import { getIncidentsByShiftId } from "./incidents.service.ts";
import { PDFDocument, rgb } from "pdf-lib";
import { db } from "../database/db.ts";
import { incidentAttachments } from "../database/schema/attachments.schema.ts";
import { eq } from "drizzle-orm";
import { getFileByKey } from "./minio.service.ts";

export const generateReport = async (shiftId: number) => {
  const incidents = await getIncidentsByShiftId(shiftId, 1, 1000);
  const pdfDoc = await PDFDocument.create();

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  page.drawText(`Incident Report for Shift #${shiftId}`, {
    x: 50,
    y: height - 50,
    size: 24,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: 50,
    y: height - 80,
    size: 12,
    color: rgb(0, 0, 0),
  });

  for (const incident of incidents) {
    page = pdfDoc.addPage();

    page.drawText(`Incident ID: ${incident.id}`, {
      x: 50,
      y: height - 50,
      size: 14,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `Date: ${incident.createdAt?.toLocaleString() || "Unknown"}`,
      {
        x: 50,
        y: height - 80,
        size: 12,
        color: rgb(0, 0, 0),
      },
    );

    page.drawText(
      `Location: ${incident.locationDescription || "Not specified"}`,
      {
        x: 50,
        y: height - 110,
        size: 12,
        color: rgb(0, 0, 0),
      },
    );

    page.drawText(`Description:`, {
      x: 50,
      y: height - 140,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const description = incident.description || "No description provided";
    const wrappedDescription = wrapText(description, 80);

    let yPosition = height - 160;
    wrappedDescription.forEach((line) => {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });
      yPosition -= 15;
    });

    const attachments = await db
      .select()
      .from(incidentAttachments)
      .where(eq(incidentAttachments.incidentId, incident.id));

    if (attachments.length > 0) {
      yPosition -= 20;

      page.drawText(`Attachments:`, {
        x: 50,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });

      yPosition -= 20;

      for (const attachment of attachments) {
        try {
          const fileStream = await getFileByKey(attachment.storagePath);

          if (fileStream) {
            const fileExtension = attachment.fileName
              .split(".")
              .pop()
              ?.toLowerCase();
            const isJpeg = fileExtension === "jpg" || fileExtension === "jpeg";
            const isPng = fileExtension === "png";

            const chunks: Buffer[] = [];
            for await (const chunk of fileStream) {
              chunks.push(Buffer.from(chunk));
            }
            const fileBuffer = Buffer.concat(chunks);

            let embeddedImage;

            if (isJpeg) {
              embeddedImage = await pdfDoc.embedJpg(fileBuffer);
            } else if (isPng) {
              embeddedImage = await pdfDoc.embedPng(fileBuffer);
            }

            if (embeddedImage) {
              const imageWidth = Math.min(embeddedImage.width, width - 100);
              const scaleFactor = imageWidth / embeddedImage.width;
              const imageHeight = embeddedImage.height * scaleFactor;

              if (yPosition - imageHeight < 50) {
                page = pdfDoc.addPage();
                yPosition = height - 50;
              }

              page.drawImage(embeddedImage, {
                x: 50,
                y: yPosition - imageHeight,
                width: imageWidth,
                height: imageHeight,
              });

              yPosition -= imageHeight + 20;
            }
          }
        } catch (error) {
          console.error(
            `Error embedding image for attachment ${attachment.id}:`,
            error,
          );

          page.drawText(`[Unable to load attachment: ${attachment.fileName}]`, {
            x: 50,
            y: yPosition,
            size: 10,
            color: rgb(1, 0, 0),
          });
          yPosition -= 20;
        }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  const filename = `incident-report-shift-${shiftId}-${new Date().toISOString().slice(0, 10)}.pdf`;

  return { buffer, filename };
};

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
