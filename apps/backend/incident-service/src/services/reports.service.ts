import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import logger from "../config/logger.ts";

dotenv.config();

export const generateReport = async (shiftId: number) => {
  try {
    const pdfDoc = await PDFDocument.create();

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const redAccent = rgb(0.8, 0.1, 0.1);
    const darkGray = rgb(0.2, 0.2, 0.2);

    const coverPage = pdfDoc.addPage();
    const { width, height } = coverPage.getSize();

    let logoImage = null;
    try {
      const logoPath = path.join(process.cwd(), "assets", "dgms-logo.jpg");
      const logoImageBytes = await fs.readFile(logoPath);
      console.log("path: ", logoPath);
      logoImage = await pdfDoc.embedPng(logoImageBytes);
    } catch (error) {
      logger.warn("Could not load logo image:", error);
    }

    if (logoImage) {
      const logoWidth = 200;
      const logoHeight = logoWidth * (logoImage.height / logoImage.width);
      coverPage.drawImage(logoImage, {
        x: (width - logoWidth) / 2,
        y: height - 150,
        width: logoWidth,
        height: logoHeight,
      });
    }

    const titleY = logoImage
      ? height - 200 - 200 * (logoImage.height / logoImage.width)
      : height - 200;

    const title = "DIRECTORATE GENERAL OF MINES SAFETY";
    const titleWidth = helveticaBold.widthOfTextAtSize(title, 24);
    coverPage.drawText(title, {
      x: (width - titleWidth) / 2,
      y: titleY,
      size: 24,
      font: helveticaBold,
      color: redAccent,
    });

    const subtitle1 = "Ministry of Labour & Employment";
    const subtitle1Width = helveticaBold.widthOfTextAtSize(subtitle1, 18);
    coverPage.drawText(subtitle1, {
      x: (width - subtitle1Width) / 2,
      y: titleY - 30,
      size: 18,
      font: helveticaBold,
      color: darkGray,
    });

    const subtitle2 = "Government of India";
    const subtitle2Width = helveticaBold.widthOfTextAtSize(subtitle2, 18);
    coverPage.drawText(subtitle2, {
      x: (width - subtitle2Width) / 2,
      y: titleY - 55,
      size: 18,
      font: helveticaBold,
      color: darkGray,
    });

    coverPage.drawLine({
      start: { x: 100, y: titleY - 80 },
      end: { x: width - 100, y: titleY - 80 },
      thickness: 2,
      color: redAccent,
    });

    const portalTitle = "Safety Management Portal (SMP)";
    const portalTitleWidth = helveticaBold.widthOfTextAtSize(portalTitle, 20);
    coverPage.drawText(portalTitle, {
      x: (width - portalTitleWidth) / 2,
      y: titleY - 130,
      size: 20,
      font: helveticaBold,
      color: redAccent,
    });

    const description = [
      "The Safety Management Portal (SMP) is an integrated digital platform developed for the",
      "Directorate General of Mines Safety (DGMS) to enhance safety oversight and incident",
      "management in mining operations across India. This system enables real-time monitoring,",
      "reporting, and resolution of safety incidents, ensuring adherence to statutory safety",
      "regulations and facilitating prompt corrective actions.",
    ];

    let yPos = titleY - 180;
    description.forEach((line) => {
      const lineWidth = timesRoman.widthOfTextAtSize(line, 14);
      coverPage.drawText(line, {
        x: (width - lineWidth) / 2,
        y: yPos,
        size: 14,
        font: timesRoman,
        color: darkGray,
      });
      yPos -= 20;
    });

    const reportTitle = "SHIFT INCIDENT REPORT";
    const reportTitleWidth = helveticaBold.widthOfTextAtSize(reportTitle, 22);
    coverPage.drawText(reportTitle, {
      x: (width - reportTitleWidth) / 2,
      y: 250,
      size: 22,
      font: helveticaBold,
      color: redAccent,
    });

    const shiftIdText = `Shift ID: ${shiftId}`;
    const shiftIdWidth = helvetica.widthOfTextAtSize(shiftIdText, 16);
    coverPage.drawText(shiftIdText, {
      x: (width - shiftIdWidth) / 2,
      y: 220,
      size: 16,
      font: helvetica,
      color: darkGray,
    });

    coverPage.drawText(
      `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
      {
        x: 220,
        y: 190,
        size: 14,
        font: helvetica,
        color: darkGray,
      },
    );

    coverPage.drawText("CONFIDENTIAL - FOR OFFICIAL USE ONLY", {
      x: width / 2 - 150,
      y: 50,
      size: 14,
      font: helveticaBold,
      color: redAccent,
    });

    try {
      const API_BASE_URL =
        process.env.API_BASE_URL || "http://localhost:5003/api";
      const shiftResponse = await axios.get(
        `${API_BASE_URL}/shifts/${shiftId}`,
      );
      const shiftData = shiftResponse.data.data;

      const shiftPage = pdfDoc.addPage();

      shiftPage.drawText("SHIFT DETAILS", {
        x: 50,
        y: height - 50,
        size: 20,
        font: helveticaBold,
        color: redAccent,
      });

      shiftPage.drawLine({
        start: { x: 50, y: height - 70 },
        end: { x: width - 50, y: height - 70 },
        thickness: 1,
        color: redAccent,
      });

      yPos = height - 100;

      const shiftFields = [
        { label: "Shift ID:", value: shiftData.id.toString() },
        { label: "Status:", value: shiftData.status.toUpperCase() },
        {
          label: "Start Time:",
          value: new Date(shiftData.startTime).toLocaleString("en-IN"),
        },
        {
          label: "End Time:",
          value: shiftData.endTime
            ? new Date(shiftData.endTime).toLocaleString("en-IN")
            : "Ongoing",
        },
      ];

      shiftFields.forEach((field) => {
        shiftPage.drawText(field.label, {
          x: 50,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: darkGray,
        });

        shiftPage.drawText(field.value, {
          x: 180,
          y: yPos,
          size: 12,
          font: helvetica,
          color: darkGray,
        });

        yPos -= 25;
      });

      yPos -= 20;

      shiftPage.drawText("SUPERVISOR INFORMATION", {
        x: 50,
        y: yPos,
        size: 16,
        font: helveticaBold,
        color: redAccent,
      });

      yPos -= 30;

      const supervisorFields = [
        {
          label: "Name:",
          value: `${shiftData.supervisor.firstName} ${shiftData.supervisor.lastName}`,
        },
        { label: "ID:", value: shiftData.supervisor.id.toString() },
        { label: "Contact:", value: shiftData.supervisor.phoneNumber },
        {
          label: "Designation:",
          value: shiftData.supervisor.designation.toUpperCase(),
        },
      ];

      supervisorFields.forEach((field) => {
        shiftPage.drawText(field.label, {
          x: 50,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: darkGray,
        });

        shiftPage.drawText(field.value, {
          x: 150,
          y: yPos,
          size: 12,
          font: helvetica,
          color: darkGray,
        });

        yPos -= 25;
      });

      yPos -= 20;

      shiftPage.drawText("WORKERS ASSIGNED TO SHIFT", {
        x: 50,
        y: yPos,
        size: 16,
        font: helveticaBold,
        color: redAccent,
      });

      yPos -= 30;

      const workerTableHeaders = ["ID", "Name", "Contact", "Designation"];
      const columnWidths = [50, 180, 120, 100];
      let xPos = 50;

      workerTableHeaders.forEach((header, index) => {
        shiftPage.drawText(header, {
          x: xPos,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: darkGray,
        });
        xPos += columnWidths[index];
      });

      shiftPage.drawLine({
        start: { x: 50, y: yPos - 10 },
        end: { x: width - 50, y: yPos - 10 },
        thickness: 1,
        color: redAccent,
      });

      yPos -= 30;

      shiftData.workers.forEach((workerEntry: { worker: any; }) => {
        const worker = workerEntry.worker;
        xPos = 50;

        const workerValues = [
          worker.id.toString(),
          `${worker.firstName} ${worker.lastName}`,
          worker.phoneNumber,
          worker.designation.toUpperCase(),
        ];

        workerValues.forEach((value, index) => {
          shiftPage.drawText(value, {
            x: xPos,
            y: yPos,
            size: 11,
            font: helvetica,
            color: darkGray,
          });
          xPos += columnWidths[index];
        });

        yPos -= 25;
      });

      const INCIDENTS_API_URL =
        process.env.INCIDENTS_API_URL || "http://localhost:5004/api";
      const incidentsResponse = await axios.get(
        `${INCIDENTS_API_URL}/incidents/${shiftId}`,
      );
      const incidentsData = incidentsResponse.data.data || [];

      const incidentsPage = pdfDoc.addPage();

      incidentsPage.drawText("INCIDENT REPORTS", {
        x: 50,
        y: height - 50,
        size: 20,
        font: helveticaBold,
        color: redAccent,
      });

      incidentsPage.drawLine({
        start: { x: 50, y: height - 70 },
        end: { x: width - 50, y: height - 70 },
        thickness: 1,
        color: redAccent,
      });

      yPos = height - 100;

      if (!incidentsData.length) {
        incidentsPage.drawText(
          "No incidents were reported during this shift.",
          {
            x: 50,
            y: yPos,
            size: 14,
            font: helvetica,
            color: darkGray,
          },
        );
      } else {
        for (const incident of incidentsData) {
          if (yPos < 200) {
            const newPage = pdfDoc.addPage();
            yPos = height - 50;

            newPage.drawText("INCIDENT REPORTS (CONTINUED)", {
              x: 50,
              y: yPos,
              size: 20,
              font: helveticaBold,
              color: redAccent,
            });

            newPage.drawLine({
              start: { x: 50, y: yPos - 20 },
              end: { x: width - 50, y: yPos - 20 },
              thickness: 1,
              color: redAccent,
            });

            yPos = height - 100;
          }

          incidentsPage.drawText(
            `Incident ID: ${incident.id} - Type: ${incident.reportType.toUpperCase()}`,
            {
              x: 50,
              y: yPos,
              size: 14,
              font: helveticaBold,
              color: redAccent,
            },
          );

          yPos -= 30;

          const incidentFields = [
            {
              label: "Reported By:",
              value: `User ID ${incident.reporttedByUserId}`,
            },
            { label: "Location:", value: incident.locationDescription },
            {
              label: "GPS Coordinates:",
              value: `${incident.gpsLatitude}, ${incident.gpsLongitude}`,
            },
            {
              label: "Initial Severity:",
              value: incident.initialSeverity.toUpperCase(),
            },
            { label: "Status:", value: incident.status.toUpperCase() },
            {
              label: "Root Cause:",
              value: incident.rootCause || "Not determined",
            },
            {
              label: "Reported On:",
              value: new Date(incident.createdAt).toLocaleString("en-IN"),
            },
          ];

          incidentFields.forEach((field) => {
            incidentsPage.drawText(field.label, {
              x: 50,
              y: yPos,
              size: 12,
              font: helveticaBold,
              color: darkGray,
            });

            incidentsPage.drawText(field.value, {
              x: 180,
              y: yPos,
              size: 12,
              font: helvetica,
              color: darkGray,
            });

            yPos -= 20;
          });

          yPos -= 10;
          incidentsPage.drawText("Description:", {
            x: 50,
            y: yPos,
            size: 12,
            font: helveticaBold,
            color: darkGray,
          });

          yPos -= 20;

          const description = incident.description;
          const words = description.split(" ");
          let line = "";
          const maxWidth = width - 100;

          for (const word of words) {
            const testLine = line + (line ? " " : "") + word;
            const textWidth = helvetica.widthOfTextAtSize(testLine, 12);

            if (textWidth > maxWidth) {
              incidentsPage.drawText(line, {
                x: 50,
                y: yPos,
                size: 12,
                font: helvetica,
                color: darkGray,
              });
              line = word;
              yPos -= 20;
            } else {
              line = testLine;
            }
          }

          if (line) {
            incidentsPage.drawText(line, {
              x: 50,
              y: yPos,
              size: 12,
              font: helvetica,
              color: darkGray,
            });
            yPos -= 20;
          }

          try {
            const WORKPLAN_API_URL =
              process.env.WORKPLAN_API_URL || "http://localhost:5005/api";
            const workplanResponse = await axios.get(
              `${WORKPLAN_API_URL}/workplans/${incident.id}`,
            );
            const workplanData = workplanResponse.data;

            if (workplanData && workplanData.tasks) {
              yPos -= 20;

              incidentsPage.drawText("WORKPLAN DETAILS", {
                x: 50,
                y: yPos,
                size: 14,
                font: helveticaBold,
                color: redAccent,
              });

              yPos -= 30;

              const taskHeaders = ["Task ID", "Status", "Assigned Workers"];
              const taskColumnWidths = [80, 100, 300];
              let taskXPos = 50;

              taskHeaders.forEach((header, index) => {
                incidentsPage.drawText(header, {
                  x: taskXPos,
                  y: yPos,
                  size: 12,
                  font: helveticaBold,
                  color: darkGray,
                });
                taskXPos += taskColumnWidths[index];
              });

              incidentsPage.drawLine({
                start: { x: 50, y: yPos - 10 },
                end: { x: width - 50, y: yPos - 10 },
                thickness: 1,
                color: redAccent,
              });

              yPos -= 30;

              for (const task of workplanData.tasks) {
                taskXPos = 50;

                incidentsPage.drawText(task.id.toString(), {
                  x: taskXPos,
                  y: yPos,
                  size: 11,
                  font: helvetica,
                  color: darkGray,
                });
                taskXPos += taskColumnWidths[0];

                const statusColor =
                  task.status === "completed"
                    ? rgb(0.1, 0.6, 0.1)
                    : task.status === "pending"
                      ? rgb(0.8, 0.6, 0.1)
                      : darkGray;

                incidentsPage.drawText(task.status.toUpperCase(), {
                  x: taskXPos,
                  y: yPos,
                  size: 11,
                  font: helvetica,
                  color: statusColor,
                });
                taskXPos += taskColumnWidths[1];

                const workers = task.workers.map((w: { name: any; }) => w.name).join(", ");
                incidentsPage.drawText(workers, {
                  x: taskXPos,
                  y: yPos,
                  size: 11,
                  font: helvetica,
                  color: darkGray,
                });

                yPos -= 25;
              }
            }
          } catch (error) {
            logger.error(
              `Error fetching workplan for incident ${incident.id}:`,
              error,
            );
            yPos -= 20;
            incidentsPage.drawText("Workplan information unavailable", {
              x: 50,
              y: yPos,
              size: 12,
              font: helvetica,
              color: rgb(0.7, 0.1, 0.1),
            });
          }

          yPos -= 30;
          incidentsPage.drawLine({
            start: { x: 50, y: yPos },
            end: { x: width - 50, y: yPos },
            thickness: 0.5,
            color: rgb(0.7, 0.7, 0.7),
          });
          yPos -= 30;
        }
      }

      const summaryPage = pdfDoc.addPage();

      summaryPage.drawText("SAFETY AUDIT SUMMARY", {
        x: 50,
        y: height - 50,
        size: 20,
        font: helveticaBold,
        color: redAccent,
      });

      summaryPage.drawLine({
        start: { x: 50, y: height - 70 },
        end: { x: width - 50, y: height - 70 },
        thickness: 1,
        color: redAccent,
      });

      yPos = height - 100;

      summaryPage.drawText("Shift Overview", {
        x: 50,
        y: yPos,
        size: 16,
        font: helveticaBold,
        color: redAccent,
      });

      yPos -= 30;

      const totalIncidents = incidentsData.length;
      const severityBreakdown = incidentsData.reduce((acc: { [x: string]: any; }, incident: { initialSeverity: string; }) => {
        const severity = incident.initialSeverity || "unknown";
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      }, {});

      const summaryFields = [
        {
          label: "Total Incidents Reported:",
          value: totalIncidents.toString(),
        },
        {
          label: "High Severity Incidents:",
          value: (severityBreakdown.high || 0).toString(),
        },
        {
          label: "Medium Severity Incidents:",
          value: (severityBreakdown.medium || 0).toString(),
        },
        {
          label: "Low Severity Incidents:",
          value: (severityBreakdown.low || 0).toString(),
        },
        {
          label: "Shift Start Time:",
          value: new Date(shiftData.startTime).toLocaleString("en-IN"),
        },
        {
          label: "Shift Duration:",
          value: shiftData.endTime
            ? `${Math.round((new Date(shiftData.endTime).getTime() - new Date(shiftData.startTime).getTime()) / 3600000)} hours`
            : "Ongoing",
        },
      ];

      summaryFields.forEach((field) => {
        summaryPage.drawText(field.label, {
          x: 50,
          y: yPos,
          size: 12,
          font: helveticaBold,
          color: darkGray,
        });

        summaryPage.drawText(field.value, {
          x: 250,
          y: yPos,
          size: 12,
          font: helvetica,
          color: darkGray,
        });

        yPos -= 25;
      });

      yPos -= 40;

      summaryPage.drawText("REPORT VERIFICATION", {
        x: 50,
        y: yPos,
        size: 16,
        font: helveticaBold,
        color: redAccent,
      });

      yPos -= 30;

      const signatureText = [
        "This report has been automatically generated by the Safety Management Portal (SMP)",
        "and requires verification by the authorized personnel below:",
      ];

      signatureText.forEach((line) => {
        summaryPage.drawText(line, {
          x: 50,
          y: yPos,
          size: 11,
          font: helvetica,
          color: darkGray,
        });
        yPos -= 20;
      });

      yPos -= 40;

      const signatures = [
        {
          title: "Shift Supervisor",
          name: `${shiftData.supervisor.firstName} ${shiftData.supervisor.lastName}`,
        },
        { title: "Safety Officer", name: "____________________" },
        { title: "Mine Manager", name: "____________________" },
      ];

      let sigXPos = 50;

      signatures.forEach((sig) => {
        summaryPage.drawText(sig.title, {
          x: sigXPos,
          y: yPos,
          size: 10,
          font: helveticaBold,
          color: darkGray,
        });

        summaryPage.drawLine({
          start: { x: sigXPos, y: yPos - 30 },
          end: { x: sigXPos + 150, y: yPos - 30 },
          thickness: 0.5,
          color: darkGray,
        });

        summaryPage.drawText(sig.name, {
          x: sigXPos,
          y: yPos - 45,
          size: 10,
          font: helvetica,
          color: darkGray,
        });

        sigXPos += 180;
      });

      const pageCount = pdfDoc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();

        if (i > 0) {
          page.drawText(`Page ${i} of ${pageCount - 1}`, {
            x: width - 100,
            y: 30,
            size: 10,
            font: helvetica,
            color: darkGray,
          });
        }

        page.drawText(
          `Document ID: SMP-${shiftId}-${new Date().toISOString().slice(0, 10)}`,
          {
            x: 50,
            y: 30,
            size: 10,
            font: helvetica,
            color: darkGray,
          },
        );

        if (i > 0) {
          page.drawText("CONFIDENTIAL", {
            x: width / 2 - 40,
            y: 30,
            size: 10,
            font: helveticaBold,
            color: redAccent,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const buffer = Buffer.from(pdfBytes);

      const filename = `DGMS-SMP-Shift-${shiftId}-Report-${new Date().toISOString().slice(0, 10)}.pdf`;

      return { buffer, filename };
    } catch (error) {
      logger.error("Error fetching data from API:", error);
      throw new Error(`Failed to generate report: ${error}`);
    }
  } catch (error) {
    logger.error("Error in report generation:", error);
    throw error;
  }
};
