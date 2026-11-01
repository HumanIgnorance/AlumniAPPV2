// Styles for AlumniDetails (moved out of the JSX file). Rendered inside a <style> tag by AlumniDetails.
// Kept as a string, not a .css file, so it is injected at the same place in the page as before (same cascade).
export const alumniDetailsCss = `
                .preview-drawer .ant-drawer-body {
                    padding: 0;
                    background: var(--surface-2);
                }

                .drawer-content {
                    height: 100%;
                    overflow-y: auto;
                }

                .preview-content {
                    padding: 0;
                }

                /* === OCC Graduation Header Card === */
                .preview-header.preview-header--modern {
                    position: relative;
                    overflow: hidden;
                    padding: 48px 40px 44px;
                    color: #ffffff;
                    background:
                        radial-gradient(
                            820px 360px at 112% -12%,
                            color-mix(in srgb, var(--hdr-primary) 45%, transparent),
                            transparent 60%
                        ),
                        radial-gradient(
                            680px 360px at -10% 120%,
                            color-mix(in srgb, var(--hdr-dark) 50%, transparent),
                            transparent 60%
                        ),
                        linear-gradient(
                            135deg,
                            var(--hdr-deeper) 0%,
                            var(--hdr-deeper) 25%,
                            var(--hdr-dark) 58%,
                            var(--hdr-primary) 100%
                        );
                    border-bottom: 2px solid color-mix(in srgb, var(--hdr-accent) 55%, transparent);
                }
                /* Red ceremonial sash sweeping across the header */
                .preview-header__sash {
                    position: absolute;
                    top: -40px;
                    right: -120px;
                    width: 460px;
                    height: 130px;
                    background: linear-gradient(
                        90deg,
                        color-mix(in srgb, var(--hdr-accent) 0%, transparent) 0%,
                        color-mix(in srgb, var(--hdr-accent) 85%, transparent) 45%,
                        var(--hdr-accent) 70%,
                        color-mix(in srgb, var(--hdr-accent) 60%, transparent) 100%
                    );
                    transform: rotate(-18deg);
                    filter: blur(0.5px);
                    box-shadow: 0 18px 40px color-mix(in srgb, var(--hdr-accent) 35%, transparent);
                    pointer-events: none;
                    opacity: 0.9;
                    z-index: 0;
                }
                /* White ceremonial toga lines */
                .header-toga-line {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(
                        180deg,
                        rgba(255, 255, 255, 0),
                        rgba(255, 255, 255, 0.35) 35%,
                        rgba(255, 255, 255, 0.35) 65%,
                        rgba(255, 255, 255, 0)
                    );
                    pointer-events: none;
                    z-index: 0;
                }
                .header-toga-line--l {
                    left: 34px;
                }
                .header-toga-line--r {
                    right: 34px;
                }
                .preview-header__shape {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(46px);
                    pointer-events: none;
                    opacity: 0.5;
                    animation: occGlowFloat 9s ease-in-out infinite;
                }
                .preview-header__shape--a {
                    width: 300px;
                    height: 300px;
                    background: color-mix(in srgb, var(--hdr-primary) 60%, transparent);
                    top: -90px;
                    right: -70px;
                }
                .preview-header__shape--b {
                    width: 240px;
                    height: 240px;
                    background: color-mix(in srgb, var(--hdr-accent) 45%, transparent);
                    bottom: -100px;
                    left: -50px;
                    animation-delay: -4s;
                }
                @keyframes occGlowFloat {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(14px, -12px); }
                }

                /* Floating OCC emblem badge (glassmorphism) */
                .occ-emblem-badge {
                    position: absolute;
                    top: 22px;
                    right: 26px;
                    z-index: 3;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 14px 8px 10px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.12);
                    border: 1px solid rgba(255, 255, 255, 0.45);
                    backdrop-filter: blur(12px);
                    box-shadow: 0 12px 30px rgba(2, 6, 23, 0.4);
                }
                .occ-emblem-badge__logo {
                    width: 34px;
                    height: 34px;
                    object-fit: contain;
                    border-radius: 50%;
                    background: #ffffff;
                    padding: 3px;
                }
                .occ-emblem-badge__text {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.1;
                }
                .occ-emblem-badge__title {
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.6px;
                    color: #ffffff;
                }
                .occ-emblem-badge__sub {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                    color: rgba(255, 255, 255, 0.8);
                }

                .preview-header .preview-profile-section {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    gap: 36px;
                }
                .profile-image-container {
                    position: relative;
                    flex-shrink: 0;
                }

                /* ===== OCC Profile Card (geometric bg + circular avatar) ===== */
                .occ-profile-card {
                    position: relative;
                    width: 230px;
                    height: 200px;
                    border-radius: 22px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(180deg, var(--hdr-deeper) 0%, var(--hdr-dark) 100%);
                    box-shadow:
                        0 18px 40px rgba(2, 6, 23, 0.5),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.08);
                }
                .occ-profile-card__bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    overflow: hidden;
                }
                .occ-profile-card__shape {
                    position: absolute;
                    opacity: 0.9;
                }
                /* large royal-blue diagonal band */
                .occ-profile-card__shape--1 {
                    top: -40%;
                    left: -20%;
                    width: 160%;
                    height: 120%;
                    background: linear-gradient(135deg, var(--hdr-dark) 0%, var(--hdr-primary) 60%, transparent 60%);
                    transform: rotate(-8deg);
                }
                /* red accent wedge */
                .occ-profile-card__shape--2 {
                    bottom: -30%;
                    right: -25%;
                    width: 120%;
                    height: 110%;
                    background: linear-gradient(315deg, var(--hdr-accent) 0%, var(--hdr-accent) 45%, transparent 45%);
                    transform: rotate(6deg);
                    opacity: 0.75;
                }
                /* subtle navy crossing facet */
                .occ-profile-card__shape--3 {
                    top: -10%;
                    right: -10%;
                    width: 90%;
                    height: 140%;
                    background: linear-gradient(200deg, color-mix(in srgb, var(--hdr-deeper) 85%, transparent) 0%, transparent 55%);
                    transform: rotate(-14deg);
                }
                .occ-profile-card__avatar {
                    position: relative;
                    z-index: 3;
                    width: 150px;
                    height: 150px;
                    margin: 0 auto;
                }

                .profile-image-wrapper {
                    position: relative;
                    cursor: pointer;
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    padding: 5px;
                    background:
                        radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%),
                        conic-gradient(from 220deg, var(--hdr-deeper), var(--hdr-dark), var(--hdr-primary), var(--hdr-accent), var(--hdr-deeper));
                    box-shadow:
                        0 0 0 4px color-mix(in srgb, var(--hdr-deeper) 90%, transparent),
                        0 0 0 6px color-mix(in srgb, var(--hdr-accent) 85%, transparent),
                        0 0 0 8px rgba(255, 255, 255, 0.95),
                        0 18px 40px rgba(2, 6, 23, 0.5),
                        0 0 34px color-mix(in srgb, var(--hdr-primary) 55%, transparent);
                    animation: occAvatarGlow 3.6s ease-in-out infinite;
                }
                @keyframes occAvatarGlow {
                    0%, 100% {
                        box-shadow:
                            0 0 0 4px color-mix(in srgb, var(--hdr-deeper) 90%, transparent),
                            0 0 0 6px color-mix(in srgb, var(--hdr-accent) 85%, transparent),
                            0 0 0 8px rgba(255, 255, 255, 0.95),
                            0 18px 40px rgba(2, 6, 23, 0.5),
                            0 0 28px color-mix(in srgb, var(--hdr-primary) 45%, transparent);
                    }
                    50% {
                        box-shadow:
                            0 0 0 4px color-mix(in srgb, var(--hdr-deeper) 90%, transparent),
                            0 0 0 6px color-mix(in srgb, var(--hdr-accent) 95%, transparent),
                            0 0 0 8px rgba(255, 255, 255, 0.95),
                            0 18px 44px rgba(2, 6, 23, 0.55),
                            0 0 48px color-mix(in srgb, var(--hdr-primary) 75%, transparent);
                    }
                }
                .preview-profile-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                    object-position: center top;
                    border: 3px solid rgba(255, 255, 255, 0.95);
                    background: var(--hdr-deeper);
                }
                .default-avatar {
                    background: rgba(255, 255, 255, 0.15) !important;
                    border: 3px solid rgba(255, 255, 255, 0.4) !important;
                    backdrop-filter: blur(6px);
                }
                .profile-status-dot {
                    position: absolute;
                    right: 10px;
                    bottom: 12px;
                    z-index: 4;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #22c55e;
                    border: 3px solid var(--hdr-deeper);
                    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35);
                }
                .image-zoom-overlay {
                    position: absolute;
                    inset: 5px;
                    background: rgba(7, 22, 51, 0.7);
                    backdrop-filter: blur(2px);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }
                .profile-image-wrapper:hover .image-zoom-overlay {
                    opacity: 1;
                }

                /* (graduation gown elements removed — replaced by profile card) */

                .profile-info {
                    flex: 1;
                    min-width: 0;
                }
                .profile-info__eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 12px;
                    margin-bottom: 10px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    color: #ffffff;
                    background: linear-gradient(
                        135deg,
                        color-mix(in srgb, var(--hdr-accent) 50%, transparent),
                        color-mix(in srgb, var(--hdr-primary) 45%, transparent)
                    );
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 999px;
                    backdrop-filter: blur(8px);
                }
                .preview-name {
                    color: #ffffff !important;
                    margin-top: 16px !important;
                    margin-bottom: 6px !important;
                    font-weight: 800 !important;
                    letter-spacing: 0.5px;
                    line-height: 1.18 !important;
                    text-shadow: 0 2px 14px rgba(2, 6, 23, 0.45);
                }
                .preview-title {
                    color: rgba(255, 255, 255, 0.88);
                    font-size: 15px;
                    font-weight: 500;
                }

                /* Premium verified alumni pill */
                .preview-verified-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 14px;
                    padding: 7px 16px;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.4px;
                    color: #ffffff;
                    border-radius: 999px;
                    background: linear-gradient(
                        135deg,
                        color-mix(in srgb, var(--hdr-accent) 90%, transparent),
                        color-mix(in srgb, var(--hdr-primary) 90%, transparent)
                    );
                    border: 1px solid rgba(255, 255, 255, 0.55);
                    box-shadow: 0 10px 24px rgba(2, 6, 23, 0.35);
                    position: relative;
                    overflow: hidden;
                }
                .preview-verified-pill::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -60%;
                    width: 40%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.55),
                        transparent
                    );
                    transform: skewX(-20deg);
                    animation: occShimmer 3.2s ease-in-out infinite;
                }
                @keyframes occShimmer {
                    0% { left: -60%; }
                    55%, 100% { left: 130%; }
                }

                .preview-contact-info {
                    margin-top: 22px;
                }
                .contact-item.contact-item--chip {
                    display: grid;
                    grid-template-columns: 36px 1fr 36px;
                    column-gap: 12px;
                    align-items: center;
                    padding: 10px 14px;
                    background: color-mix(in srgb, var(--hdr-deeper) 45%, transparent);
                    border: 1px solid color-mix(in srgb, var(--hdr-accent) 40%, transparent);
                    border-radius: 14px;
                    backdrop-filter: blur(10px);
                    transition:
                        transform 0.2s ease,
                        background 0.2s ease,
                        border-color 0.2s ease,
                        box-shadow 0.2s ease;
                }
                .contact-item.contact-item--chip:hover {
                    transform: translateY(-2px);
                    background: color-mix(in srgb, var(--hdr-dark) 50%, transparent);
                    border-color: rgba(255, 255, 255, 0.55);
                    box-shadow: 0 10px 26px rgba(37, 99, 235, 0.35);
                }
                .contact-icon-wrap {
                    grid-column: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(
                        135deg,
                        rgba(30, 64, 175, 0.7),
                        rgba(37, 99, 235, 0.7)
                    );
                    color: #ffffff;
                    box-shadow: 0 0 14px rgba(37, 99, 235, 0.5);
                }
                .contact-icon {
                    color: #ffffff;
                    font-size: 16px;
                }
                .contact-details {
                    grid-column: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 0;
                    width: 100%;
                    text-align: center;
                }
                .contact-label {
                    width: 100%;
                    color: rgba(255, 255, 255, 0.72);
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.4px;
                    text-transform: uppercase;
                    text-align: center;
                }
                .contact-value {
                    width: 100%;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: center;
                }

                .preview-body {
                    padding: 30px;
                }

                .preview-card {
                    margin-bottom: 24px;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .section-icon {
                    color: #1890ff;
                    font-size: 18px;
                }

                .section-title {
                    margin: 0 !important;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .subsection {
                    margin-top: 20px;
                }

                .subsection-title {
                    display: block;
                    margin-bottom: 8px;
                    color: #1890ff;
                }

                .preview-text {
                    margin: 0;
                    line-height: 1.6;
                }

                .sidebar-card {
                    position: sticky;
                    top: 20px;
                }

                .sidebar-section {
                    margin-bottom: 24px;
                }

                .sidebar-section:last-child {
                    margin-bottom: 0;
                }

                .sidebar-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px !important;
                    color: #1890ff;
                }

                .sidebar-items {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 0;
                }

                .sidebar-item.clickable {
                    cursor: pointer;
                }

                .sidebar-item.clickable:hover {
                    background: var(--surface-2);
                    border-radius: 6px;
                    padding: 8px 12px;
                    margin: 0 -12px;
                }

                .sidebar-icon {
                    font-size: 16px;
                    color: var(--text-muted);
                    width: 20px;
                }

                .sidebar-icon.linkedin {
                    color: #0077b5;
                }
                .sidebar-icon.github {
                    color: var(--text);
                }
                .sidebar-icon.portfolio {
                    color: #1890ff;
                }

                .sidebar-content {
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-label {
                    font-size: 12px;
                    color: var(--text-muted);
                }

                .sidebar-value {
                    font-size: 14px;
                    color: var(--text);
                }

                .document-status,
                .preference-items {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .document-item,
                .preference-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 0;
                }

                .document-item.uploaded {
                    color: var(--success);
                }

                .doc-icon,
                .pref-icon {
                    font-size: 16px;
                }

                .doc-view-btn {
                    margin-left: auto;
                }

                .honors-container {
                    margin-top: 16px;
                }

                .honor-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: var(--accent-soft);
                    border-radius: 6px;
                    border: 1px solid var(--accent-ring);
                }

                .honor-icon {
                    color: #faad14;
                }

                /* Image Zoom Modal */
                .image-zoom-modal .ant-modal-body {
                    padding: 0;
                }

                .zoom-container {
                    text-align: center;
                }

                .zoom-actions {
                    margin-top: 20px;
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .occ-emblem-badge {
                        top: 16px;
                        right: 16px;
                    }
                }

                /* Tablet + landscape phones: avatar left, details right */
                @media (max-width: 768px) {
                    .preview-header.preview-header--modern {
                        padding: 56px 20px 28px;
                    }
                    .preview-header .preview-profile-section {
                        gap: 22px;
                    }
                    .occ-emblem-badge__sub {
                        display: none;
                    }
                    .preview-body {
                        padding: 20px;
                    }
                    .sidebar-card {
                        position: static;
                    }
                }

                /* Portrait phones: everything centered, no overflow */
                @media (max-width: 560px) {
                    .preview-header .preview-profile-section {
                        flex-direction: column;
                        text-align: center;
                        gap: 18px;
                    }
                    .profile-image-container {
                        margin: 0 auto;
                    }
                    .occ-profile-card {
                        width: 200px;
                        height: 178px;
                    }
                    .occ-profile-card__avatar,
                    .profile-image-wrapper {
                        width: 132px;
                        height: 132px;
                    }
                    .profile-info__eyebrow,
                    .preview-verified-pill {
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .profile-info {
                        width: 100%;
                    }
                    .occ-emblem-badge {
                        top: 14px;
                        right: 50%;
                        transform: translateX(50%);
                    }
                }

                /* Mobile phones in LANDSCAPE: the viewport is wide but very
                   short, so the header shrinks and the email/phone/address
                   chips get squeezed into narrow columns, forcing the text
                   to wrap letter-by-letter and become unreadable. Force the
                   chips to stack full-width, one per row, with the icon and
                   text side-by-side (left aligned, single line + ellipsis)
                   instead of the centered vertical stack used elsewhere. */
                @media (max-width: 900px) and (orientation: landscape) {
                    .preview-header.preview-header--modern {
                        padding: 44px 18px 20px;
                    }
                    .preview-contact-info {
                        margin-top: 14px;
                    }
                    .preview-contact-info .ant-col {
                        flex: 0 0 100% !important;
                        max-width: 100% !important;
                    }
                    .contact-item.contact-item--chip {
                        grid-template-columns: 30px 1fr;
                        column-gap: 10px;
                        padding: 6px 12px;
                    }
                    .contact-icon-wrap {
                        width: 30px;
                        height: 30px;
                        border-radius: 8px;
                    }
                    .contact-icon {
                        font-size: 14px;
                    }
                    .contact-details {
                        flex-direction: row;
                        align-items: baseline;
                        flex-wrap: nowrap;
                        gap: 6px;
                        text-align: left;
                        min-width: 0;
                    }
                    .contact-label {
                        width: auto;
                        flex: 0 0 auto;
                        font-size: 10px;
                        text-align: left;
                        white-space: nowrap;
                    }
                    .contact-value {
                        width: auto;
                        flex: 1 1 auto;
                        min-width: 0;
                        font-size: 12px;
                        text-align: left;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: block;
                    }
                }

                /* ============================================================
                   BSIT — MULTI-COLOR PROGRAMMER THEME
                   Colors: black · white · red · blue · yellow
                   ============================================================ */

                /* Header background: deep black base with red + blue + yellow rays */
                .preview-header--bsit.preview-header--modern {
                    background:
                        /* yellow streak top-right */
                        radial-gradient(600px 280px at 105% -5%,  rgba(250,204,21,0.30), transparent 55%),
                        /* blue streak bottom-left */
                        radial-gradient(600px 280px at -8%  115%, rgba(37,99,235,0.35),  transparent 55%),
                        /* red burst center-right */
                        radial-gradient(400px 220px at 80%   50%, rgba(225,29,43,0.22),  transparent 60%),
                        /* deep-black base */
                        linear-gradient(135deg, #050810 0%, #0a0f1e 40%, #0d1526 70%, #111827 100%) !important;
                    border-bottom: 2px solid rgba(250,204,21,0.55) !important;
                }

                /* Sash: diagonal yellow-to-red sweep */
                .preview-header--bsit .preview-header__sash {
                    background: linear-gradient(
                        90deg,
                        rgba(250,204,21,0) 0%,
                        rgba(250,204,21,0.85) 35%,
                        rgba(225,29,43,0.90) 65%,
                        rgba(225,29,43,0.50) 100%
                    );
                    box-shadow: 0 18px 40px rgba(225,29,43,0.30);
                }

                /* Blob A: red glow top-right */
                .preview-header--bsit .preview-header__shape--a {
                    background: rgba(225,29,43,0.55);
                }

                /* Blob B: blue glow bottom-left */
                .preview-header--bsit .preview-header__shape--b {
                    background: rgba(37,99,235,0.50);
                }

                /* Toga lines: white — already white so just ensure opacity */
                .preview-header--bsit .header-toga-line {
                    background: linear-gradient(
                        180deg,
                        rgba(255,255,255,0),
                        rgba(255,255,255,0.50) 35%,
                        rgba(255,255,255,0.50) 65%,
                        rgba(255,255,255,0)
                    );
                }

                /* Profile card bg: black base + blue + red + yellow facets */
                .preview-header--bsit .occ-profile-card {
                    background: linear-gradient(180deg, #050810 0%, #0d1a3a 100%);
                }
                /* Blue diagonal band */
                .preview-header--bsit .occ-profile-card__shape--1 {
                    background: linear-gradient(135deg, #0d1a3a 0%, #1e3a8a 55%, transparent 55%);
                }
                /* Red accent wedge */
                .preview-header--bsit .occ-profile-card__shape--2 {
                    background: linear-gradient(315deg, #e11d2b 0%, rgba(225,29,43,0.80) 45%, transparent 45%);
                    opacity: 0.85;
                }
                /* Yellow crossing facet */
                .preview-header--bsit .occ-profile-card__shape--3 {
                    background: linear-gradient(200deg, rgba(250,204,21,0.18) 0%, transparent 50%);
                }

                /* Avatar ring: 5-color conic gradient border */
                .preview-header--bsit .profile-image-wrapper {
                    background:
                        radial-gradient(circle at 30% 20%, rgba(255,255,255,0.30), transparent 55%),
                        conic-gradient(
                            from 0deg,
                            #050810,   /* black */
                            #e11d2b,   /* red */
                            #f8fafc,   /* white */
                            #2563eb,   /* blue */
                            #facc15,   /* yellow */
                            #050810    /* back to black */
                        );
                    animation: bsitRingPulse 4s ease-in-out infinite;
                }
                @keyframes bsitRingPulse {
                    0%,100% {
                        box-shadow:
                            0 0 0 4px rgba(5,8,16,0.90),
                            0 0 0 6px rgba(250,204,21,0.85),
                            0 0 0 8px rgba(248,250,252,0.95),
                            0 18px 40px rgba(2,6,23,0.55),
                            0 0 32px rgba(225,29,43,0.45);
                    }
                    33% {
                        box-shadow:
                            0 0 0 4px rgba(5,8,16,0.90),
                            0 0 0 6px rgba(37,99,235,0.95),
                            0 0 0 8px rgba(248,250,252,0.95),
                            0 18px 44px rgba(2,6,23,0.60),
                            0 0 44px rgba(37,99,235,0.60);
                    }
                    66% {
                        box-shadow:
                            0 0 0 4px rgba(5,8,16,0.90),
                            0 0 0 6px rgba(225,29,43,0.95),
                            0 0 0 8px rgba(248,250,252,0.95),
                            0 18px 44px rgba(2,6,23,0.60),
                            0 0 44px rgba(250,204,21,0.50);
                    }
                }

                /* Verified pill: red → blue gradient + yellow shimmer */
                .preview-header--bsit .preview-verified-pill {
                    background: linear-gradient(
                        135deg,
                        rgba(225,29,43,0.92),
                        rgba(37,99,235,0.92)
                    );
                    border: 1px solid rgba(250,204,21,0.70);
                    box-shadow: 0 10px 24px rgba(2,6,23,0.40), 0 0 16px rgba(250,204,21,0.20);
                }

                /* Contact chips: dark bg + yellow border */
                .preview-header--bsit .contact-item.contact-item--chip {
                    background: rgba(5,8,16,0.55);
                    border: 1px solid rgba(250,204,21,0.40);
                }
                .preview-header--bsit .contact-item.contact-item--chip:hover {
                    background: rgba(13,26,58,0.65);
                    border-color: rgba(250,204,21,0.75);
                    box-shadow: 0 10px 26px rgba(37,99,235,0.35);
                }

                /* Contact icon wrap: yellow tint */
                .preview-header--bsit .contact-icon-wrap {
                    background: linear-gradient(135deg, rgba(225,29,43,0.65), rgba(37,99,235,0.65));
                    box-shadow: 0 0 14px rgba(250,204,21,0.35);
                }

                /* Status dot: yellow */
                .preview-header--bsit .profile-status-dot {
                    background: #facc15;
                    border-color: #050810;
                    box-shadow: 0 0 0 2px rgba(250,204,21,0.40);
                }
`;
