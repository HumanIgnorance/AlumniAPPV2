// Backwards-compatible entry point. Existing code calls
//   exportElementToPdf("printable-area", { filename })
// and keeps working, but now goes through the shared engine in
// ./pdfReport.js (section-aware pages, iPhone/Android-safe delivery).
import { exportElementReport } from "./pdfReport";

export async function exportElementToPdf(elementId, options = {}) {
    return exportElementReport(elementId, options);
}

export {
    exportTableReport,
    buildTableReportPdf,
    exportElementReport,
    deliverPdf,
} from "./pdfReport";
