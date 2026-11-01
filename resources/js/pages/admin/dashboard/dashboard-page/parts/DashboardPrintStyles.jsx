export default function DashboardPrintStyles() {
    return (
        <style jsx global>{`
            @media print {
                html,
                body,
                body[data-theme="black"],
                [data-theme="black"] {
                    background: #ffffff !important;
                    color: #0f172a !important;
                }

                /* Hide everything on the page except the report itself */
                body * {
                    visibility: hidden !important;
                }

                #printable-area,
                #printable-area * {
                    visibility: visible !important;
                }

                /* Lift the report out of the modal and let it fill the physical
       page. Size/padding are inherited from .printable-area-surface,
       which is already 190mm/277mm/8mm — matching the @page margin
       below — so nothing here needs to redeclare them. */
                #printable-area {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    margin: 0 !important;
                    z-index: 999999 !important;
                }

                /* Collapse the modal chrome around the report */
                .ant-modal-mask,
                .ant-modal-wrap {
                    position: static !important;
                    background: none !important;
                }

                .ant-modal,
                .ant-modal-content {
                    position: static !important;
                    box-shadow: none !important;
                    border: none !important;
                    background: transparent !important;
                }

                .ant-modal-header,
                .ant-modal-footer,
                .ant-modal-close {
                    display: none !important;
                }

                .ant-modal-body {
                    padding: 0 !important;
                }

                /* The screen-only paper canvas (gray tray + shadow) shouldn't print */
                .print-preview-canvas {
                    background: none !important;
                    padding: 0 !important;
                    overflow: visible !important;
                }
                .print-preview-canvas .printable-area-surface {
                    box-shadow: none !important;
                }

                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }

                @page {
                    size: A4 portrait;
                    margin: 10mm; /* matches the 190mm/277mm content box in AlumniDashboard.css:
                        210mm - 2×10mm = 190mm, 297mm - 2×10mm = 277mm */
                }

                html,
                body {
                    width: 210mm !important;
                    height: 297mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #ffffff !important;
                }
            }
        `}</style>
    );
}
