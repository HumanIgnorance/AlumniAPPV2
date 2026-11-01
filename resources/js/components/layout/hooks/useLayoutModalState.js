import { useState } from "react";

export default function useLayoutModalState() {
    const [alumniDetailsVisible, setAlumniDetailsVisible] = useState(false);

    const [alumniPreviewData, setAlumniPreviewData] = useState(null);

    const [alumniDetailsLoading, setAlumniDetailsLoading] = useState(false);

    const [eventRegistrationsModalVisible, setEventRegistrationsModalVisible] =
        useState(false);

    const [selectedEventForRegistrations, setSelectedEventForRegistrations] =
        useState(null);

    const [eventRegistrations, setEventRegistrations] = useState([]);

    const [eventRegistrationsLoading, setEventRegistrationsLoading] =
        useState(false);

    const [eventDetailsModalVisible, setEventDetailsModalVisible] =
        useState(false);

    const [selectedEventDetails, setSelectedEventDetails] = useState(null);

    const [eventDetailsLoading, setEventDetailsLoading] = useState(false);

    return {
        setAlumniPreviewData,
        setEventRegistrationsLoading,
        setEventRegistrations,
        setSelectedEventForRegistrations,
        setEventRegistrationsModalVisible,
        setEventDetailsLoading,
        setSelectedEventDetails,
        setEventDetailsModalVisible,
        setAlumniDetailsLoading,
        setAlumniDetailsVisible,
        selectedEventForRegistrations,
        eventRegistrationsModalVisible,
        eventRegistrationsLoading,
        eventRegistrations,
        selectedEventDetails,
        eventDetailsModalVisible,
        eventDetailsLoading,
        alumniDetailsVisible,
        alumniPreviewData,
        alumniDetailsLoading,
    };
}
