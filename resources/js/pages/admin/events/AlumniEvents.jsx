"use client";

import React from "react";
import { Layout } from "~/components";
import "./styles";
import { EventsProvider } from "./EventsContext";
import useEventsController from "./hooks/useEventsController";
import { EventDetailsModal } from "./parts/EventDetailsModal";
import EventsHero from "./parts/EventsHero";
import EventsStatusTabs from "./parts/EventsStatusTabs";
import EventsControls from "./parts/EventsControls";
import EventsDisplay from "./parts/EventsDisplay";
import CreateEditEventModal from "./parts/CreateEditEventModal";
import EventSecondaryModal from "./parts/EventSecondaryModal";
import EventDraftPromptModal from "./parts/EventDraftPromptModal";
import EventDiscardModal from "./parts/EventDiscardModal";

/**
 * Events page (admin + alumni).
 *   hooks/  state, filters, draft auto-save, create/edit form (useEventsController composes them)
 *   parts/  hero, tabs, controls, list, each modal, plus shared helpers
 *           (eventConstants, eventHelpers, EventCard, RegistrationsModal, ...)
 */
const AlumniEvents = () => {
    const ctx = useEventsController();
    const {
        selectedEvent,
        isDetailModalVisible,
        handleCloseDetails,
        handleEditEvent,
        handleDeleteEvent,
        fetchEvents,
    } = ctx;

    return (
        <EventsProvider value={ctx}>
            <Layout>
                <div className="alumni-events-container">
                    <EventsHero />
                    <EventsStatusTabs />
                    <EventsControls />
                    <EventsDisplay />
                    <CreateEditEventModal />
                    <EventSecondaryModal />
                    <EventDraftPromptModal />
                    <EventDiscardModal />
                </div>

                <EventDetailsModal
                    event={selectedEvent}
                    visible={isDetailModalVisible}
                    onClose={handleCloseDetails}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    onRefresh={fetchEvents}
                />
            </Layout>
        </EventsProvider>
    );
};

export default AlumniEvents;
