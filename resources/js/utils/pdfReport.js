// ============================================================
// pdfReport.js — ONE shared engine for every printed report
// (alumni lists, department-head lists, event registrations,
//  admin dashboard).
//
// Why this replaces the old exportElementToPdf():
//   The old code took ONE giant screenshot of the preview and sliced it
//   into A4 pages, so rows/charts were cut in half at page breaks, text
//   was blurry, big lists ran out of canvas memory on phones, and
//   pdf.save() did nothing on iPhone / installed PWAs.
//
// Now:
//   • Table reports (alumni list, registrations) are built from DATA with
//     jspdf-autotable: real selectable text, header row repeated on every
//     page, rows never split, "Page x of y", tiny files, any row count.
//   • The dashboard keeps its look: each section (header, card, chart…)
//     is captured separately and placed whole on a page; a section is only
//     split if it is taller than one page.
//   • Delivery works on iPhone/iPad (share sheet), Android and desktop.
//
// The on-screen "Print Preview" modals are unchanged.
// ============================================================
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { Modal, message } from "antd";

const A4_W = 210;
const A4_H = 297;
const MARGIN = 12;
const FOOTER_H = 9;

// ------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------
const isIOS = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return (
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
};

// Standard PDF fonts only know Latin-1 + a few punctuation marks. Anything
// else (emoji, CJK…) would print as garbage, so it is dropped instead.
export const safeText = (value, fallback = "N/A") => {
    if (value === null || value === undefined || value === "") return fallback;
    const text = String(value)
        .normalize("NFC")
        // eslint-disable-next-line no-control-regex
        .replace(/[^\u0020-\u007E\u00A0-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D\u2026\u2022]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return text || fallback;
};

export const hexToRgb = (color, fallback = [15, 23, 42]) => {
    if (typeof color !== "string") return fallback;
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
    if (!m) return fallback;
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const slug = (text, fallback) =>
    String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || fallback;
export { slug as slugifyForFile };

// Image URL -> { dataUrl, format }. Never throws: a missing logo must not
// stop a report from being produced.
export const loadImage = async (url) => {
    if (!url) return null;
    try {
        const res = await fetch(url, { credentials: "same-origin" });
        if (!res.ok) return null;
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsDataURL(blob);
        });
        const format = /jpe?g/i.test(blob.type) ? "JPEG" : "PNG";
        return { dataUrl, format };
    } catch {
        return null;
    }
};

// ------------------------------------------------------------
// Delivery (works on iPhone/iPad, Android, desktop, installed PWAs)
// ------------------------------------------------------------
const downloadViaAnchor = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
    }, 60000);
};

export async function deliverPdf(blob, filename) {
    // Desktop + Android (Chrome / installed PWA): normal download.
    if (!isIOS()) {
        downloadViaAnchor(blob, filename);
        message.success("PDF downloaded.");
        return "downloaded";
    }

    // iPhone / iPad: a blob download does nothing in an installed PWA and
    // navigates away in Safari, so use the share sheet ("Save to Files",
    // "Print", "Mail"…). iOS only opens it from a fresh tap, and PDF
    // generation takes a moment, so fall back to a button if it refuses.
    const file = new File([blob], filename, { type: "application/pdf" });
    const canShare =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

    const openOrDownload = () => {
        const url = URL.createObjectURL(blob);
        const w = window.open(url, "_blank");
        if (!w) downloadViaAnchor(blob, filename);
        setTimeout(() => URL.revokeObjectURL(url), 120000);
    };

    if (canShare) {
        try {
            await navigator.share({ files: [file], title: filename });
            return "shared";
        } catch (err) {
            if (err?.name === "AbortError") return "cancelled";
            // needs a fresh tap -> button below
        }
    }

    return new Promise((resolve) => {
        Modal.confirm({
            centered: true,
            icon: null,
            maskClosable: false,
            title: "PDF ready",
            content: canShare
                ? "Tap “Share / Save” and choose “Save to Files” or “Print”."
                : "Tap “Open PDF”, then use the share button to save or print.",
            okText: canShare ? "Share / Save" : "Open PDF",
            cancelText: "Close",
            onOk: () => {
                if (canShare) {
                    return navigator
                        .share({ files: [file], title: filename })
                        .then(() => resolve("shared"))
                        .catch(() => {
                            openOrDownload();
                            resolve("opened");
                        });
                }
                openOrDownload();
                resolve("opened");
                return undefined;
            },
            onCancel: () => resolve("cancelled"),
        });
    });
}

// ------------------------------------------------------------
// Shared page furniture
// ------------------------------------------------------------
const addPageNumbers = (doc, footerText) => {
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.setDrawColor(210, 210, 210);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, A4_H - MARGIN - 4, A4_W - MARGIN, A4_H - MARGIN - 4);
        if (footerText) {
            doc.text(safeText(footerText, ""), MARGIN, A4_H - MARGIN + 0.5);
        }
        doc.text(`Page ${i} of ${total}`, A4_W - MARGIN, A4_H - MARGIN + 0.5, {
            align: "right",
        });
    }
};

// ------------------------------------------------------------
// 1) TABLE REPORTS — built from data (no screenshots)
// ------------------------------------------------------------
/**
 * @param {object} spec
 * @param {string} spec.title            e.g. "Alumni Directory Report"
 * @param {string} [spec.subtitle]       e.g. "BSIT - Information Technology"
 * @param {string} [spec.subtitleColor]  hex
 * @param {string} [spec.generatedText]  e.g. "Generated on: March 01, 2026"
 * @param {Array<{label:string,value:string}>} [spec.info]   2-column info lines
 * @param {Array<{label:string,value:string|number,color?:string}>} [spec.stats]
 * @param {Array<{header:string,width?:number,align?:string,kind?:string}>} spec.columns
 *        kind: "checkbox" draws an empty tick box, "blank" leaves room to sign.
 * @param {Array<Array<string|number>>} spec.rows
 * @param {string} [spec.footerText]
 * @param {string} [spec.logoUrl]
 * @param {"portrait"|"landscape"} [spec.orientation]
 * @returns {Promise<Blob>}
 */
export async function buildTableReportPdf(spec) {
    const {
        title,
        subtitle,
        subtitleColor,
        generatedText,
        info = [],
        stats = [],
        columns,
        rows,
        footerText,
        logoUrl,
        orientation = "portrait",
    } = spec;

    const doc = new jsPDF({ orientation, unit: "mm", format: "a4", compress: true });
    const pageW = doc.internal.pageSize.getWidth();
    const contentW = pageW - MARGIN * 2;
    let y = MARGIN;

    // ---- header ------------------------------------------------
    const logo = await loadImage(logoUrl);
    if (logo) {
        try {
            doc.addImage(logo.dataUrl, logo.format, pageW / 2 - 10, y, 20, 20);
            y += 23;
        } catch {
            /* ignore a bad logo */
        }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(0, 0, 0);
    doc.text(safeText(title, "Report"), pageW / 2, y + 5, { align: "center" });
    y += 11;

    if (subtitle) {
        doc.setFontSize(12);
        doc.setTextColor(...hexToRgb(subtitleColor));
        const lines = doc.splitTextToSize(safeText(subtitle, ""), contentW);
        doc.text(lines, pageW / 2, y + 2, { align: "center" });
        y += lines.length * 5.5 + 1;
    }
    if (generatedText) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(102, 102, 102);
        doc.text(safeText(generatedText, ""), pageW / 2, y + 2, { align: "center" });
        y += 6;
    }
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 1, pageW - MARGIN, y + 1);
    y += 6;

    // ---- info block (event date/time/location…) -----------------
    if (info.length) {
        const rowsNeeded = Math.ceil(info.length / 2);
        const boxH = rowsNeeded * 6 + 4;
        doc.setDrawColor(217, 217, 217);
        doc.setLineWidth(0.3);
        doc.rect(MARGIN, y, contentW, boxH);
        doc.setFontSize(9.5);
        info.forEach((item, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = MARGIN + 4 + col * (contentW / 2);
            const ty = y + 6 + row * 6;
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            const label = `${safeText(item.label, "")}:`;
            doc.text(label, x, ty);
            const labelW = doc.getTextWidth(label) + 1.8;
            doc.setFont("helvetica", "normal");
            const room = contentW / 2 - 8 - labelW;
            const value = doc.splitTextToSize(safeText(item.value), Math.max(room, 20))[0];
            doc.text(value, x + labelW, ty);
        });
        y += boxH + 5;
    }

    // ---- stat boxes ---------------------------------------------
    if (stats.length) {
        const gap = 3;
        const boxW = (contentW - gap * (stats.length - 1)) / stats.length;
        stats.forEach((s, i) => {
            const x = MARGIN + i * (boxW + gap);
            doc.setDrawColor(217, 217, 217);
            doc.setLineWidth(0.3);
            doc.rect(x, y, boxW, 17);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(...hexToRgb(s.color, [0, 0, 0]));
            doc.text(String(s.value), x + boxW / 2, y + 8, { align: "center" });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            const labelLines = doc.splitTextToSize(safeText(s.label, ""), boxW - 3);
            doc.text(labelLines.slice(0, 2), x + boxW / 2, y + 12.5, { align: "center" });
        });
        y += 17 + 6;
    }

    // ---- table --------------------------------------------------
    const hasSign = columns.some((c) => c.kind === "blank" || c.kind === "checkbox");
    const columnStyles = {};
    columns.forEach((c, idx) => {
        const style = {};
        if (c.width) style.cellWidth = c.width;
        if (c.align) style.halign = c.align;
        columnStyles[idx] = style;
    });

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: MARGIN + FOOTER_H },
        head: [columns.map((c) => safeText(c.header, ""))],
        body: rows.map((r) =>
            r.map((cell, idx) =>
                columns[idx]?.kind === "checkbox" || columns[idx]?.kind === "blank"
                    ? ""
                    : safeText(cell),
            ),
        ),
        theme: "grid",
        showHead: "everyPage",        // header row repeats on every page
        rowPageBreak: "avoid",        // a row is never cut in half
        styles: {
            font: "helvetica",
            fontSize: 8.5,
            cellPadding: { top: hasSign ? 3.2 : 2, bottom: hasSign ? 3.2 : 2, left: 2, right: 2 },
            lineColor: [217, 217, 217],
            lineWidth: 0.2,
            textColor: [20, 20, 20],
            overflow: "linebreak",
            valign: "middle",
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            halign: "left",
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        columnStyles,
        didDrawCell: (data) => {
            if (data.section !== "body") return;
            if (columns[data.column.index]?.kind !== "checkbox") return;
            const size = 4.5;
            const x = data.cell.x + data.cell.width / 2 - size / 2;
            const cy = data.cell.y + data.cell.height / 2 - size / 2;
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.3);
            doc.rect(x, cy, size, size);
        },
    });

    if (!rows.length) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        const endY = (doc.lastAutoTable?.finalY ?? y) + 8;
        doc.text("No records to display.", pageW / 2, endY, { align: "center" });
    }

    addPageNumbers(doc, footerText);
    return doc.output("blob");
}

export async function exportTableReport(spec, filename) {
    const blob = await buildTableReportPdf(spec);
    return deliverPdf(blob, filename);
}

// ------------------------------------------------------------
// 2) DASHBOARD — section-by-section capture, never cut mid-section
// ------------------------------------------------------------
const SECTION_SELECTOR = ".print-report-header, .print-block, .print-closing-block";

const waitForPaint = () =>
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

const sliceCanvas = (canvas, sy, sh) => {
    const c = document.createElement("canvas");
    c.width = canvas.width;
    c.height = sh;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
    return c;
};

export async function buildElementReportPdf(elementId, options = {}) {
    const { scale = 2, footerText = "Alumni Management System" } = options;

    const root = document.getElementById(elementId);
    if (!root) {
        throw new Error(`Print area "#${elementId}" was not found.`);
    }

    // Capture offset bugs happen when a scrolled modal is rendered, so
    // scroll every scrollable ancestor to the top first (restored after).
    const scrolled = [];
    for (let el = root.parentElement; el; el = el.parentElement) {
        if (el.scrollTop > 0) {
            scrolled.push([el, el.scrollTop]);
            el.scrollTop = 0;
        }
    }
    await waitForPaint();

    try {
        let sections = Array.from(root.querySelectorAll(SECTION_SELECTOR)).filter(
            (el) => !el.parentElement.closest(SECTION_SELECTOR),
        );
        if (!sections.length) sections = [root];

        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        const usableW = A4_W - MARGIN * 2;
        const pageBottom = A4_H - MARGIN - FOOTER_H;
        const gap = 3;
        let y = MARGIN;
        let firstOnPage = true;

        const newPage = () => {
            doc.addPage();
            y = MARGIN;
            firstOnPage = true;
        };

        for (const section of sections) {
            if (section.offsetHeight === 0 || section.offsetWidth === 0) continue;

            const canvas = await html2canvas(section, {
                scale,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                scrollX: 0,
                scrollY: 0,
            });
            if (!canvas.width || !canvas.height) continue;

            const mmPerPx = usableW / canvas.width;
            const heightMm = canvas.height * mmPerPx;
            const roomMm = pageBottom - y;

            if (heightMm <= pageBottom - MARGIN) {
                // fits on a page by itself: keep it whole
                if (heightMm > roomMm && !firstOnPage) newPage();
                doc.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", MARGIN, y, usableW, heightMm);
                y += heightMm + gap;
                firstOnPage = false;
            } else {
                // taller than a page (e.g. a very long table): split in slices
                if (!firstOnPage && roomMm < 40) newPage();
                let sy = 0;
                while (sy < canvas.height) {
                    const room = pageBottom - y;
                    const slicePx = Math.min(canvas.height - sy, Math.floor(room / mmPerPx));
                    if (slicePx <= 0) {
                        newPage();
                        continue;
                    }
                    const piece = sliceCanvas(canvas, sy, slicePx);
                    doc.addImage(
                        piece.toDataURL("image/jpeg", 0.92),
                        "JPEG",
                        MARGIN,
                        y,
                        usableW,
                        slicePx * mmPerPx,
                    );
                    sy += slicePx;
                    y += slicePx * mmPerPx + gap;
                    firstOnPage = false;
                    if (sy < canvas.height) newPage();
                }
            }
        }

        addPageNumbers(doc, footerText);
        return doc.output("blob");
    } finally {
        scrolled.forEach(([el, top]) => {
            el.scrollTop = top;
        });
    }
}

export async function exportElementReport(elementId, options = {}) {
    const blob = await buildElementReportPdf(elementId, options);
    return deliverPdf(blob, options.filename || "report.pdf");
}
