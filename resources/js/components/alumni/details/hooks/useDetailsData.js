import {
    COURSE_ID_TO_CODE,
    COURSE_NAME_MAP,
    getCourseTheme,
} from "~/components/alumni/details/detailsConstants";
import { employmentStatusOptions } from "~/config/alumniOptions";
import { STATUS } from "~/config/status";
import { COLORS } from "~/config/theme";
import { saveImage } from "~/utils/saveImage";

export default function useDetailsData({ previewData }) {
    // Safe data access with fallbacks
    const getData = (path, defaultValue = "") => {
        return path
            .split(".")
            .reduce((obj, key) => obj?.[key] ?? defaultValue, previewData);
    };

    // Resolve a course code from whatever shape the API / registration preview returns.
    const resolveCourseCode = () => {
        // 1) Direct course_code string passed from AlumniRegistration previewData
        if (
            previewData?.course_code &&
            typeof previewData.course_code === "string"
        ) {
            return previewData.course_code;
        }

        // 2) nested relation: previewData.course = { course_code: "BSIT", ... }
        const nested =
            previewData?.course?.course_code ||
            previewData?.course?.code ||
            previewData?.course?.name;
        if (nested) return nested;

        // 3) numeric course_id → code (supports both field name shapes)
        const cid = previewData?.course_id ?? previewData?.courseId;
        if (cid != null && COURSE_ID_TO_CODE[cid])
            return COURSE_ID_TO_CODE[cid];

        // 4) raw string field named "course"
        const raw = getData("course");
        return typeof raw === "string" ? raw : "";
    };

    // Return the human-readable course name for display in the Academic Background card.
    const getCourseName = () => {
        const code = resolveCourseCode();
        if (!code) return getData("course") || "";

        // Check COURSE_NAME_MAP by exact or case-insensitive key match
        if (COURSE_NAME_MAP[code]) return COURSE_NAME_MAP[code];
        const key = Object.keys(COURSE_NAME_MAP).find(
            (k) => k.toLowerCase() === code.toLowerCase(),
        );
        if (key) return COURSE_NAME_MAP[key];

        // Fall back to what the API gave us (e.g. a full name stored directly)
        return code;
    };

    const resolvedCode = resolveCourseCode();

    const courseTheme = getCourseTheme(resolvedCode);

    const isBSIT = resolvedCode.toUpperCase() === "BSIT";

    // Verification state comes from the admin-controlled `status` field
    // (set via AlumniList's "Edit Status" action). Any alumnus, regardless of
    // course, only shows "Verified" once an admin has approved them; while
    // still pending/rejected/undefined (e.g. the live AlumniRegistration
    // preview, which has no status yet) it reads "Verify".
    const alumniStatus = String(getData("status") || "").toLowerCase();

    const isVerified = alumniStatus === STATUS.APPROVED;

    const verifiedPillText = isVerified
        ? "Verified OCC Graduate"
        : "Verify OCC Graduate";

    const headerThemeStyle = {
        "--hdr-primary": courseTheme.primary,
        "--hdr-dark": courseTheme.dark,
        "--hdr-deeper": courseTheme.deeper,
        "--hdr-accent": courseTheme.accent,
        // BSIT-only multi-color palette vars
        ...(isBSIT && {
            "--bsit-red": "#e11d2b",
            "--bsit-blue": COLORS.blue600,
            "--bsit-yellow": "#facc15",
            "--bsit-white": COLORS.slate50,
            "--bsit-black": "#050810",
        }),
    };

    const downloadImage = (imageUrl) => {
        if (!imageUrl) return undefined;
        const who = formatName() || "OCC-Alumni";
        return saveImage({ url: imageUrl, filename: who });
    };

    const formatName = () => {
        const firstName = getData("first_name");
        const middleName = getData("middle_name");
        const lastName = getData("last_name");
        const suffix = getData("suffix");

        return `${firstName} ${middleName} ${lastName} ${suffix}`
            .replace(/\s+/g, " ")
            .trim();
    };

    const getEmploymentStatus = () => {
        const statusValue = getData("employment_status");
        return (
            employmentStatusOptions.find((s) => s.value === statusValue)
                ?.label || statusValue
        );
    };

    const getEmploymentStatusColor = () => {
        const statusValue = getData("employment_status");
        return (
            employmentStatusOptions.find((s) => s.value === statusValue)
                ?.color || "blue"
        );
    };

    const honors = getData("honors", []);

    return {
        isBSIT,
        headerThemeStyle,
        getData,
        verifiedPillText,
        formatName,
        getEmploymentStatusColor,
        getEmploymentStatus,
        getCourseName,
        honors,
        downloadImage,
    };
}
