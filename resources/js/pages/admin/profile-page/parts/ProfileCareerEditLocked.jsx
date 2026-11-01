import { Modal, Button } from "antd";
import { LockOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import {
    Paragraph,
    CAREER_EDIT_LOCK_DAYS,
    Text,
} from "~/pages/admin/profile-page/parts/profileShared";
import { useProfileContext } from "~/pages/admin/profile-page/ProfileContext";

export default function ProfileCareerEditLocked() {
    const { careerLockedVisible, setCareerLockedVisible, careerLockInfo } =
        useProfileContext();

    return (
        <Modal
            title={
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <LockOutlined style={{ color: COLORS.indigo600 }} />
                    Career Info is currently locked
                </span>
            }
            open={careerLockedVisible}
            onCancel={() => setCareerLockedVisible(false)}
            footer={[
                <Button
                    key="ok"
                    type="primary"
                    onClick={() => setCareerLockedVisible(false)}
                >
                    Got it
                </Button>,
            ]}
            centered
        >
            <Paragraph style={{ marginBottom: 8 }}>
                You recently updated your Career Information on{" "}
                <strong>
                    {careerLockInfo.lastEditedAt
                        ? careerLockInfo.lastEditedAt.format(
                              "MMMM D, YYYY [at] h:mm A",
                          )
                        : "—"}
                </strong>
                .
            </Paragraph>
            <Paragraph style={{ marginBottom: 12 }}>
                For data accuracy, this section can only be edited{" "}
                <strong>once every {CAREER_EDIT_LOCK_DAYS} days</strong>.
            </Paragraph>

            <div
                style={{
                    background: "rgba(79, 70, 229, 0.08)",
                    border: "1px solid rgba(79, 70, 229, 0.25)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    marginBottom: 12,
                }}
            >
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                    <ClockCircleOutlined /> Time remaining before you can edit
                    again:
                </Text>
                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        flexWrap: "wrap",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    <span>
                        <strong>{careerLockInfo.remaining.days}</strong> days
                    </span>
                    <span>
                        <strong>{careerLockInfo.remaining.hours}</strong> hours
                    </span>
                    <span>
                        <strong>{careerLockInfo.remaining.minutes}</strong>{" "}
                        minutes
                    </span>
                    <span>
                        <strong>{careerLockInfo.remaining.seconds}</strong>{" "}
                        seconds
                    </span>
                </div>
            </div>

            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                You'll be able to edit again on{" "}
                <strong>
                    {careerLockInfo.unlockAt
                        ? careerLockInfo.unlockAt.format(
                              "MMMM D, YYYY [at] h:mm A",
                          )
                        : "—"}
                </strong>
                .
            </Paragraph>
        </Modal>
    );
}
