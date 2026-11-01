import { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import useEvents from "~/hooks/useEvents";
import { computeEventStatus } from "~/pages/admin/events/parts/eventHelpers";
import { getUserRole } from "~/utils/session";

export default function useEventsState() {
    const {
        isLoading,
        data: rawEvents = [],
        isFetching,
        refetch: fetchEvents,
    } = useEvents();

    const [now, setNow] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => setNow(dayjs()), 60000);
        return () => clearInterval(interval);
    }, []);

    const events = useMemo(() => {
        return rawEvents.map((e) => ({
            ...e,
            status: computeEventStatus(e),
        }));
    }, [rawEvents, now]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEvents(); // Refresh events from server
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, [fetchEvents]);

    //const [events, setEvents] = useState(initialEvents);
    const [viewMode, setViewMode] = useState("grid");

    const [activeTab, setActiveTab] = useState("all");

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [form] = Form.useForm();

    const [currentStep, setCurrentStep] = useState(0);

    const role = getUserRole();

    const [fileList, setFileList] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isValidationModalVisible, setIsValidationModalVisible] =
        useState(false);

    const [validationErrors, setValidationErrors] = useState([]);

    // ===== Draft Auto-Save state (additive) =====
    const [isDraftPromptVisible, setIsDraftPromptVisible] = useState(false);

    const [isDiscardConfirmVisible, setIsDiscardConfirmVisible] =
        useState(false);

    const [draftLastSaved, setDraftLastSaved] = useState(null);

    const draftSaveTimer = useRef(null);

    const isRestoringDraftRef = useRef(false);

    const fileListRef = useRef([]);

    const selectedDate = Form.useWatch("date", form);

    // Trigger re-render every minute for real-time disabling

    useEffect(() => {
        const interval = setInterval(() => setNow(dayjs()), 60000);
        return () => clearInterval(interval);
    }, []);

    const disabledTime = () => {
        if (!selectedDate) return {};

        if (dayjs(selectedDate).isSame(now, "day")) {
            const disabledHours = [];
            for (let i = 0; i < now.hour(); i++) disabledHours.push(i);

            const disabledMinutes = (hour) =>
                hour === now.hour()
                    ? Array.from({ length: now.minute() }, (_, i) => i)
                    : [];

            return { disabledHours: () => disabledHours, disabledMinutes };
        }

        return {};
    };

    // Filter states
    const [filters, setFilters] = useState({
        search: "",
        eventType: "all",
        category: "all",
        status: "all",
        priceRange: "all",
        featured: "all",
        dateRange: null,
    });

    const [sortBy, setSortBy] = useState("date-asc");

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEvents();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [fetchEvents]);

    const showEventDetails = (event) => {
        // console.log({ event })
        setSelectedEvent(event);
        setIsDetailModalVisible(true);
    };

    return {
        setIsDetailModalVisible,
        setSelectedEvent,
        fetchEvents,
        setIsModalVisible,
        setFileList,
        form,
        events,
        activeTab,
        filters,
        sortBy,
        setFilters,
        setDraftLastSaved,
        fileListRef,
        selectedEvent,
        isRestoringDraftRef,
        draftSaveTimer,
        setValidationErrors,
        setIsValidationModalVisible,
        setCurrentStep,
        setIsDraftPromptVisible,
        setIsDiscardConfirmVisible,
        isModalVisible,
        isSubmitting,
        setIsSubmitting,
        fileList,
        role,
        setActiveTab,
        isLoading,
        showEventDetails,
        draftLastSaved,
        disabledTime,
        isValidationModalVisible,
        validationErrors,
        isDraftPromptVisible,
        isDiscardConfirmVisible,
    };
}
