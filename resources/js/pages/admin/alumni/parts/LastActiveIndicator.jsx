import { Typography } from "antd";
import { getLastActiveStatus } from "~/pages/admin/alumni/parts/alumniListHelpers";

const { Text } = Typography;

export const LastActiveIndicator = ({ lastActive, isOnline }) => {
    const statusInfo = getLastActiveStatus(lastActive, isOnline);

    return (
        <div
            className="last-active-indicator"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
            <span
                className="status-dot"
                style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: statusInfo.dotColor,
                    display: "inline-block",
                    boxShadow:
                        statusInfo.status === "active"
                            ? `0 0 8px ${statusInfo.dotColor}, 0 0 12px ${statusInfo.dotColor}`
                            : "none",
                    animation:
                        statusInfo.status === "active"
                            ? "pulse-green 2s infinite"
                            : "none",
                }}
            />
            <Text
                type="secondary"
                style={{
                    color: statusInfo.color,
                    fontSize: "13px",
                    fontWeight: statusInfo.status === "active" ? "500" : "400",
                }}
            >
                {statusInfo.text}
            </Text>
        </div>
    );
};
