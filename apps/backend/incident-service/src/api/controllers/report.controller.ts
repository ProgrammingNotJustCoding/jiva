import type { Context } from "hono";
import { generateReport } from "../../services/reports.service.ts";

export const generateReportController = async (c: Context) => {
  try {
    const shiftId = Number(c.req.param("id"));

    if (isNaN(shiftId)) {
      return c.json({ error: "Invalid shift ID" }, 400);
    }

    const { buffer, filename } = await generateReport(shiftId);

    c.header("Content-Type", "application/pdf");
    c.header("Content-Disposition", `attachment; filename="${filename}"`);
    c.header("Content-Length", buffer.length.toString());

    return c.body(buffer);
  } catch (error) {
    console.error("Error generating report:", error);
    return c.json(
      {
        error: "Failed to generate report",
        details: `Error generating report: ${error}`,
      },
      500,
    );
  }
};
