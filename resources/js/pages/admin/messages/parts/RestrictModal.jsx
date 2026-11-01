import React from "react";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

export default function RestrictModal() {
    const {
        showRestrictModal,
        pendingRestrictAlumni,
        getCourseName,
        getCourseCode,
        getEmploymentStatusLabel,
        modalLoading,
        setShowRestrictModal,
        confirmRestrictAlumni,
    } = useMessagesContext();

    if (!showRestrictModal || !pendingRestrictAlumni) return null;

    const isCurrentlyRestricted = pendingRestrictAlumni.is_restricted;

    // ---- Field fallbacks: support multiple shapes from different endpoints ----
    const resolvedCourseFromId =
        pendingRestrictAlumni.course_id != null
            ? getCourseName(getCourseCode(pendingRestrictAlumni.course_id))
            : null;

    const course =
        pendingRestrictAlumni.course_name ||
        pendingRestrictAlumni.courseName ||
        pendingRestrictAlumni.course ||
        (resolvedCourseFromId && resolvedCourseFromId !== "N/A"
            ? resolvedCourseFromId
            : null) ||
        "N/A";

    const resolvedEmploymentFromId =
        pendingRestrictAlumni.employment_status_id != null
            ? getEmploymentStatusLabel(
                  pendingRestrictAlumni.employment_status_id,
              )
            : null;

    const employment =
        pendingRestrictAlumni.employment_status ||
        pendingRestrictAlumni.employmentStatus ||
        pendingRestrictAlumni.employment ||
        (resolvedEmploymentFromId && resolvedEmploymentFromId !== "N/A"
            ? resolvedEmploymentFromId
            : null) ||
        "N/A";

    const alumniName =
        pendingRestrictAlumni.alumni_name ||
        pendingRestrictAlumni.name ||
        "N/A";

    return (
        <div
            className="modal-overlay"
            onClick={() => !modalLoading && setShowRestrictModal(false)}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-icon">
                        {isCurrentlyRestricted ? "✅" : "🚫"}
                    </span>
                    <h3>
                        {isCurrentlyRestricted
                            ? "Remove Restriction?"
                            : "Restrict Messaging Access?"}
                    </h3>
                </div>
                <div className="modal-body">
                    {/* Enhanced alumni summary */}
                    <div className="restrict-alumni-summary">
                        <div className="restrict-summary-row">
                            <span className="restrict-summary-label">
                                Alumni
                            </span>
                            <span className="restrict-summary-value">
                                {alumniName}
                            </span>
                        </div>
                        <div className="restrict-summary-row">
                            <span className="restrict-summary-label">
                                Course
                            </span>
                            <span className="restrict-summary-value">
                                {course}
                            </span>
                        </div>
                        <div className="restrict-summary-row">
                            <span className="restrict-summary-label">
                                Employment
                            </span>
                            <span className="restrict-summary-value">
                                {employment}
                            </span>
                        </div>
                        <div className="restrict-summary-row">
                            <span className="restrict-summary-label">
                                Current Status
                            </span>
                            <span
                                className={`restrict-summary-value ${isCurrentlyRestricted ? "is-restricted" : "is-active"}`}
                            >
                                {isCurrentlyRestricted
                                    ? "Restricted"
                                    : "Active"}
                            </span>
                        </div>
                    </div>
                    <p>
                        {isCurrentlyRestricted
                            ? `Are you sure you want to remove the messaging restriction for ${alumniName}?`
                            : `Are you sure you want to restrict ${alumniName} from sending messages?`}
                    </p>
                    <p className="modal-info modal-warning">
                        {isCurrentlyRestricted
                            ? "They will be able to send messages again after this action."
                            : "⚠️ This will block the alumni from sending any future messages until the restriction is removed."}
                    </p>
                </div>
                <div className="modal-actions">
                    <button
                        className="modal-btn cancel"
                        onClick={() => setShowRestrictModal(false)}
                        disabled={modalLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className={`modal-btn ${isCurrentlyRestricted ? "success" : "warning"}`}
                        onClick={confirmRestrictAlumni}
                        disabled={modalLoading}
                    >
                        {modalLoading
                            ? "Processing..."
                            : isCurrentlyRestricted
                              ? "Remove Restriction"
                              : "Restrict"}
                    </button>
                </div>
            </div>
        </div>
    );
}
