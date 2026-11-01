import React from "react";
import {
    BellOutlined,
    SettingOutlined,
    SoundOutlined,
} from "@ant-design/icons";
import { Button, List, Modal, Space, Switch, Tag, Typography } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { DEFAULT_SETTINGS } from "~/components/layout/utils/layoutConstants";
import { COLORS } from "~/config/theme";

const { Text } = Typography;

export default function SettingsModal() {
    const {
        settingsModalVisible,
        setSettingsModalVisible,
        settings,
        settingsLoaded,
        handleSettingsChange,
    } = useLayoutContext();

    return (
        <Modal
            title={
                <Space>
                    <SettingOutlined />
                    <span>Notification Settings</span>
                </Space>
            }
            open={settingsModalVisible}
            onCancel={() => setSettingsModalVisible(false)}
            footer={[
                <Button
                    key="close"
                    onClick={() => setSettingsModalVisible(false)}
                >
                    Close
                </Button>,
            ]}
            width={450}
        >
            <div style={{ padding: "16px 0" }}>
                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        fontSize: 12,
                        marginBottom: 12,
                    }}
                >
                    A "Default" tag means you haven't changed this setting yet —
                    it's using the standard on/off starting value. Toggling it
                    saves your own choice for your account.
                </Text>
                <List>
                    {/* Email Notifications toggle removed per request.
                                Original block kept here for reference:
                            <List.Item
                                actions={[
                                    <Switch
                                        key="email"
                                        checked={settings.emailNotifications}
                                        loading={!settingsLoaded}
                                        onChange={(checked) =>
                                            handleSettingsChange(
                                                "emailNotifications",
                                                checked,
                                            )
                                        }
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <MailOutlined
                                            style={{ fontSize: 20, color: "#1890ff" }}
                                        />
                                    }
                                    title={
                                        <Space size={6}>
                                            <span>Email Notifications</span>
                                            {settingsLoaded &&
                                                settings.emailNotifications ===
                                                    DEFAULT_SETTINGS.emailNotifications && (
                                                    <Tag
                                                        style={{
                                                            fontSize: 10,
                                                            lineHeight: "16px",
                                                            padding: "0 6px",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        Default:{" "}
                                                        {DEFAULT_SETTINGS.emailNotifications
                                                            ? "On"
                                                            : "Off"}
                                                    </Tag>
                                                )}
                                        </Space>
                                    }
                                    description="Receive notifications via email"
                                />
                            </List.Item>
                            */}
                    <List.Item
                        actions={[
                            <Switch
                                key="sound"
                                checked={settings.soundEnabled}
                                loading={!settingsLoaded}
                                onChange={(checked) =>
                                    handleSettingsChange(
                                        "soundEnabled",
                                        checked,
                                    )
                                }
                            />,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <SoundOutlined
                                    style={{
                                        fontSize: 20,
                                        color: COLORS.antdGreen,
                                    }}
                                />
                            }
                            title={
                                <Space size={6}>
                                    <span>Sound Notifications</span>
                                    {settingsLoaded &&
                                        settings.soundEnabled ===
                                            DEFAULT_SETTINGS.soundEnabled && (
                                            <Tag
                                                style={{
                                                    fontSize: 10,
                                                    lineHeight: "16px",
                                                    padding: "0 6px",
                                                    margin: 0,
                                                }}
                                            >
                                                Default:{" "}
                                                {DEFAULT_SETTINGS.soundEnabled
                                                    ? "On"
                                                    : "Off"}
                                            </Tag>
                                        )}
                                </Space>
                            }
                            description="Play sound when new notification arrives"
                        />
                    </List.Item>
                    <List.Item
                        actions={[
                            <Switch
                                key="push"
                                checked={settings.pushNotifications !== false}
                                loading={!settingsLoaded}
                                onChange={(checked) =>
                                    handleSettingsChange(
                                        "pushNotifications",
                                        checked,
                                    )
                                }
                            />,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <BellOutlined
                                    style={{
                                        fontSize: 20,
                                        color: COLORS.antdGold,
                                    }}
                                />
                            }
                            title={
                                <Space size={6}>
                                    <span>Push Notifications</span>
                                    {settingsLoaded &&
                                        (settings.pushNotifications !==
                                            false) ===
                                            DEFAULT_SETTINGS.pushNotifications && (
                                            <Tag
                                                style={{
                                                    fontSize: 10,
                                                    lineHeight: "16px",
                                                    padding: "0 6px",
                                                    margin: 0,
                                                }}
                                            >
                                                Default:{" "}
                                                {DEFAULT_SETTINGS.pushNotifications
                                                    ? "On"
                                                    : "Off"}
                                            </Tag>
                                        )}
                                </Space>
                            }
                            description="Receive push notifications in browser"
                        />
                    </List.Item>
                </List>
            </div>
        </Modal>
    );
}
