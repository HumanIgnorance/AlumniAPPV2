/** Institution / site identity — one place for names, titles and contact details. */
export const SITE = Object.freeze({
    schoolName: "Opol Community College",
    appName: "ATMS",
    appFullName: "Alumni Tracing Management System",
    contactEmail: "occ.antiquina.joneejohn@gmail.com",
    associationName: "OCC Alumni Association",
    copyrightYear: "2025",
    developer: Object.freeze({
        name: "Antiquina, Jonee John R.",
        url: "https://www.facebook.com/EphemeralKun/",
    }),
});

export const SITE_TITLE = `${SITE.appName} - ${SITE.schoolName}`;

/** "Events" -> "Events | ATMS - Opol Community College" */
export const buildPageTitle = (page) => (page ? `${page} | ${SITE_TITLE}` : SITE_TITLE);
