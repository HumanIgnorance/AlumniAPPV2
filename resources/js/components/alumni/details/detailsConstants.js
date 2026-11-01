import { COLORS } from "~/config/theme";

export const companyInfo = {
    name: "Opol Community College Alumni Association",
    logo: "https://alumni.occph.com/build/assets/OCC_LOGO-BWCM4zrL.png",
};

export const courseOptions = [
    {
        value: "BSIT",
        label: "Bachelor of Science in Information Technology",
        college: "College of Computer Studies",
    },
    {
        value: "BSCS",
        label: "Bachelor of Science in Computer Science",
        college: "College of Computer Studies",
    },
    // ... other courses
];

// === Course-based header color themes ===
// Each theme exposes CSS variables consumed by the preview header.
export const COURSE_THEMES = {
    BSIT: {
        primary: "#e11d2b",
        dark: "#1e3a8a",
        deeper: "#050810",
        accent: "#facc15",
    },
    BSCS: {
        primary: COLORS.cyan500,
        dark: "#0e7490",
        deeper: "#042f3a",
        accent: COLORS.violet600,
    },
    BSBA: {
        primary: COLORS.amber500,
        dark: COLORS.amber600,
        deeper: "#1e1a06",
        accent: COLORS.amber400,
    },
    BSEd: {
        primary: COLORS.blue600,
        dark: COLORS.blue700,
        deeper: "#06122b",
        accent: COLORS.sky300,
    },
    BEEd: {
        primary: COLORS.blue600,
        dark: COLORS.blue700,
        deeper: "#06122b",
        accent: COLORS.sky300,
    },
    BEED: {
        primary: COLORS.blue600,
        dark: COLORS.blue700,
        deeper: "#06122b",
        accent: COLORS.sky300,
    },
    BSN: {
        primary: "#16a34a",
        dark: "#15803d",
        deeper: "#052e16",
        accent: "#c1121f",
    },
    BSA: {
        primary: COLORS.orange500,
        dark: "#c2410c",
        deeper: "#3b1606",
        accent: "#1e40af",
    },
    BSEE: {
        primary: COLORS.violet600,
        dark: "#5b21b6",
        deeper: "#1e0b3a",
        accent: COLORS.amber500,
    },
    BSME: {
        primary: COLORS.slate500,
        dark: "#334155",
        deeper: COLORS.c0b1220,
        accent: COLORS.amber500,
    },
    BSArch: {
        primary: "#b45309",
        dark: COLORS.amber900,
        deeper: "#2d1804",
        accent: "#d4af37",
    },
    BSPsych: {
        primary: "#ec4899",
        dark: "#be185d",
        deeper: "#3a0a23",
        accent: COLORS.violet600,
    },
    default: {
        primary: COLORS.blue600,
        dark: COLORS.blue700,
        deeper: "#06122b",
        accent: COLORS.sky300,
    },
};

export const COURSE_ID_TO_CODE = {
    1: "BSIT",
    2: "BSEd",
    3: "BEED",
    4: "BSBA",
};

// Full name lookup keyed by course code
export const COURSE_NAME_MAP = {
    BSIT: "Bachelor of Science in Information Technology",
    BSCS: "Bachelor of Science in Computer Science",
    BSBA: "Bachelor of Science in Business Administration",
    BSEd: "Bachelor in Teacher Education",
    BEED: "Bachelor of Elementary Education",
    BSN: "Bachelor of Science in Nursing",
    BSA: "Bachelor of Science in Accountancy",
    BSEE: "Bachelor of Science in Electrical Engineering",
    BSME: "Bachelor of Science in Mechanical Engineering",
    BSArch: "Bachelor of Science in Architecture",
    BSPsych: "Bachelor of Science in Psychology",
};

export const getCourseTheme = (courseValue) => {
    if (!courseValue) return COURSE_THEMES.default;
    if (COURSE_THEMES[courseValue]) return COURSE_THEMES[courseValue];
    const key = Object.keys(COURSE_THEMES).find(
        (k) => k.toLowerCase() === String(courseValue).toLowerCase(),
    );
    return key ? COURSE_THEMES[key] : COURSE_THEMES.default;
};
