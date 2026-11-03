import { useCallback, useEffect } from "react";
import { saveImage } from "~/utils/saveImage";
import avatarGuidance from "~/assets/images/avatar_guidance.png";
import { COLORS } from "~/config/theme";
import useCourses from "~/hooks/useCourses";
import useEmployeeStatus from "~/hooks/useEmployeeStatus";

export default function useMessageFormatters({
    EDIT_TIME_LIMIT,
    setTick,
    getImageUrl,
}) {
    // ---------------------------------------------------------------------------
    // READ RECEIPT HELPER
    // ---------------------------------------------------------------------------
    const formatReadReceipt = (msg) => {
        if (msg.isOptimistic) return "Sending…";
        if (!msg.is_read) return "Delivered";
        const ts = msg.read_at || msg.seen_at || msg.updated_at;
        if (!ts) return "Seen";
        try {
            const d = new Date(ts);
            return `Seen ${d.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })}`;
        } catch {
            return "Seen";
        }
    };

    const { data: employeeStatuses } = useEmployeeStatus();

    const { data: coursesData } = useCourses();

    const COURSE_MAP = [
        { id: 1, code: "BSIT" },
        { id: 2, code: "BSEd" },
        { id: 3, code: "BEED" },
        { id: 4, code: "BSBA" },
    ];

    // Admin info for alumni view
    const adminInfo = {
        name: "Ms. Annabelle Verula (Guidance Counselor)",
        email: "occ.verula.annabelle@gmail.com",
        avatar: avatarGuidance,
    };

    // ============================
    // HELPER: Check if message can be edited (within 3 minutes)
    // ============================
    const canEditMessage = useCallback((msg) => {
        if (!msg.created_at) return false;
        const createdAt = new Date(msg.created_at).getTime();
        const now = Date.now();
        return now - createdAt < EDIT_TIME_LIMIT;
    }, []);

    // ============================
    // HELPER: Check if edit indicator should be shown (within 3 minutes)
    // ============================
    const shouldShowEditIndicator = useCallback((msg) => {
        if (!msg.is_edited) return false;
        if (!msg.updated_at && !msg.created_at) return false;
        const editedAt = new Date(msg.updated_at || msg.created_at).getTime();
        const now = Date.now();
        return now - editedAt < EDIT_TIME_LIMIT;
    }, []);

    // ============================
    // Timer to force re-render for edit time limit
    // ============================
    useEffect(() => {
        const interval = setInterval(() => {
            setTick((t) => t + 1);
        }, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    // ============================
    // HELPER FUNCTION TO GET IMAGE URL
    // ============================

    const downloadImage = (imagePath) => {
        if (!imagePath) return undefined;

        // The lightbox passes a resolved URL; other call sites may pass a raw
        // storage path, so resolve those first.
        const imageUrl = /^(https?:|blob:|data:)/.test(imagePath)
            ? imagePath
            : getImageUrl(imagePath);
        if (!imageUrl) return undefined;

        // iPhone/iPad: share sheet ("Save Image"); Android/desktop: download.
        return saveImage({ url: imageUrl, filename: "OCC-Alumni-message" });
    };

    const getEmploymentStatusLabel = useCallback(
        (statusId) => {
            if (!employeeStatuses) return "N/A";
            const status = employeeStatuses.find((s) => s.id === statusId);
            return status ? status.status_name : "N/A";
        },
        [employeeStatuses],
    );

    // NEW: classify employment label → color modifier class
    // employed = green, underemployed = orange, unemployed = red
    const getEmploymentClass = useCallback(
        (statusId) => {
            const label = (getEmploymentStatusLabel(statusId) || "")
                .toString()
                .toLowerCase();
            if (!label || label === "n/a") return "";
            if (label.includes("under")) return "employment-under";
            if (
                label.includes("unemp") ||
                label.includes("not employed") ||
                label.includes("jobless")
            )
                return "employment-unemp";
            if (
                label.includes("emp") ||
                label.includes("self") ||
                label.includes("freelanc") ||
                label.includes("work")
            )
                return "employment-emp";
            return "";
        },
        [getEmploymentStatusLabel],
    );

    const getCourseCode = useCallback((courseId) => {
        if (!courseId) return "N/A";
        const course = COURSE_MAP.find((c) => c.id === courseId);
        return course ? course.code : courseId;
    }, []);

    const getCourseName = useCallback(
        (courseCode) => {
            if (!coursesData || !courseCode) return courseCode || "N/A";
            const course = coursesData.find((c) => c.code === courseCode);
            return course ? course.name : courseCode;
        },
        [coursesData],
    );

    const getCourseColor = useCallback((courseCode) => {
        const colorMap = {
            BSIT: COLORS.f5222d,
            BSEd: COLORS.antdBlue,
            BEED: COLORS.antdBlue,
            BSBA: COLORS.antdGold,
        };
        return colorMap[courseCode] || COLORS.antdBlue;
    }, []);

    return {
        canEditMessage,
        getCourseName,
        getCourseCode,
        getEmploymentStatusLabel,
        adminInfo,
        shouldShowEditIndicator,
        getEmploymentClass,
        formatReadReceipt,
        downloadImage,
    };
}
