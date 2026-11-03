"use client";

import React from "react";
import { Layout } from "antd";
import { LayoutProvider } from "./LayoutContext";
import useLayoutController from "./hooks/useLayoutController";
import SidebarNav from "./parts/SidebarNav";
import LayoutHeader from "./parts/LayoutHeader";
import LayoutFooter from "./parts/LayoutFooter";
import MobileBottomNav from "./parts/MobileBottomNav";
import SettingsModal from "./parts/SettingsModal";
import AllNotificationsModal from "./parts/AllNotificationsModal";
import EventRegistrationsModal from "./parts/EventRegistrationsModal";
import EventDetailsModal from "./parts/EventDetailsModal";
import FeedbackDetailModal from "./parts/FeedbackDetailModal";
import AlumniPreviewModal from "./parts/AlumniPreviewModal";
import FeedbackFlowModals from "./parts/FeedbackFlowModals";
import QuizRequiredModal from "./parts/QuizRequiredModal";
import LegalModalsHost from "./parts/LegalModalsHost";
import "./styles";

const { Content } = Layout;

/**
 * App shell for every signed-in page (admin, department head, alumni).
 *
 *   hooks/    state + effects + handlers (useLayoutController composes them)
 *   parts/    one component per piece of UI (sidebar, header, footer, modals)
 *   utils/    pure helpers and constants used by the hooks and parts
 *
 * Role-specific menus live in ~/config/menus.jsx and the role-specific
 * notification categories in ~/config/notificationCategories.jsx.
 */
const MainLayout = ({ children }) => {
    const ctx = useLayoutController();

    return (
        <LayoutProvider value={ctx}>
            <Layout style={{ minHeight: "100vh" }}>
                <SidebarNav />

                <Layout className="site-layout">
                    <LayoutHeader />
                    <Content id="content">{children}</Content>
                    {/* Phones: the bottom tab bar takes the footer's place (footer links live in the menu drawer) */}
                    {ctx.isMobile ? <MobileBottomNav /> : <LayoutFooter />}
                </Layout>

                <SettingsModal />
                <AllNotificationsModal />
                <EventRegistrationsModal />
                <EventDetailsModal />
                <FeedbackDetailModal />
                <AlumniPreviewModal />
                <FeedbackFlowModals />
                <QuizRequiredModal />
                <LegalModalsHost />
            </Layout>
        </LayoutProvider>
    );
};

export default MainLayout;
