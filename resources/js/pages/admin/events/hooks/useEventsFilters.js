import { useMemo } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import axiosConfig from "~/utils/axiosConfig";

export default function useEventsFilters({
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
}) {
    const handleCloseDetails = () => {
        setIsDetailModalVisible(false);
        setSelectedEvent(null);
    };

    const handleDeleteEvent = async (event) => {
        try {
            const response = await axiosConfig.delete(`/events/${event.id}`);

            if (response.data.success) {
                message.success("Event deleted successfully!");
                setIsDetailModalVisible(false);
                setSelectedEvent(null);
                fetchEvents();
            }
        } catch (error) {
            message.error("Failed to delete event");
            console.error("Event deletion error:", error);
        }
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setIsDetailModalVisible(false);
        setIsModalVisible(true);

        const existingImages =
            event.image_urls?.map((url, index) => ({
                uid: `existing-${index}`,
                name: `Image ${index + 1}`,
                status: "done",
                url: url,
                thumbUrl: url,
            })) || [];

        setFileList(existingImages);

        // Pre-fill the form with event data for editing
        // NOTE: DatePicker and TimePicker (Ant Design v5) require dayjs objects,
        // NOT moment objects. Passing moment() here caused auto-scroll / auto-
        // navigation bugs in the pickers without the user clicking anything.
        form.setFieldsValue({
            title: event.title,
            description: event.description,
            event_type: event.event_type || event.eventType,
            category: event.category,
            date: dayjs(event.date),
            timeRange: [
                dayjs(event.start_time || event.startTime, "HH:mm"),
                dayjs(event.end_time || event.endTime, "HH:mm"),
            ],
            location: event.location,
            price: event.price,
            capacity: event.capacity,
            organizer: event.organizer,
            contact_number: event.contact_number,
            contact_email: event.contact_email,
            tags: event.tags,
            agenda:
                typeof event.agenda === "string"
                    ? event.agenda
                    : event.agenda?.join("\n"),
            featured: event.featured || false,
            earlyBirdPrice: event.earlyBirdPrice,
            earlyBirdEndDate: event.earlyBirdEndDate
                ? dayjs(event.earlyBirdEndDate)
                : null,
        });
    };

    // Filter and sort events
    const filteredAndSortedEvents = useMemo(() => {
        const filtered = events
            .filter((event) => {
                if (activeTab === "featured") {
                    // Featured tab - only show featured events
                    if (!event.featured) return false;
                } else if (activeTab !== "all") {
                    // Status tabs (upcoming, ongoing, completed) - filter by status
                    if (event.status !== activeTab) return false;
                }

                // Search filter
                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    return (
                        event.title.toLowerCase().includes(searchLower) ||
                        event.description.toLowerCase().includes(searchLower) ||
                        event.location.toLowerCase().includes(searchLower) ||
                        event.organizer.toLowerCase().includes(searchLower) ||
                        (event.tags &&
                            event.tags.some((tag) =>
                                tag.toLowerCase().includes(searchLower),
                            )) // Added check for event.tags
                    );
                }

                return true;
            })
            .filter((event) => {
                // Event type filter
                if (
                    filters.eventType !== "all" &&
                    (event.eventType || event.event_type) !== filters.eventType
                ) {
                    return false;
                }

                // Category filter
                if (
                    filters.category !== "all" &&
                    event.category !== filters.category
                ) {
                    return false;
                }

                // Status filter
                if (
                    filters.status !== "all" &&
                    event.status !== filters.status
                ) {
                    return false;
                }

                // Price range filter
                if (filters.priceRange !== "all") {
                    switch (filters.priceRange) {
                        case "free":
                            if (event.price !== 0) return false;
                            break;
                        case "0-50":
                            if (event.price === 0 || event.price > 50)
                                return false;
                            break;
                        case "50-100":
                            if (event.price < 50 || event.price > 100)
                                return false;
                            break;
                        case "100-200":
                            if (event.price < 100 || event.price > 200)
                                return false;
                            break;
                        case "200+":
                            if (event.price < 200) return false;
                            break;
                        default:
                            break;
                    }
                }

                // Featured filter
                if (filters.featured !== "all") {
                    const isFeatured = filters.featured === "featured";
                    if (event.featured !== isFeatured) return false;
                }

                // Date range filter
                // Date range filter
                if (filters.dateRange && filters.dateRange.length === 2) {
                    const eventDate = moment(event.date || event.event_date);
                    const startDate = filters.dateRange[0];
                    const endDate = filters.dateRange[1];

                    if (!eventDate.isBetween(startDate, endDate, "day", "[]")) {
                        return false;
                    }
                }

                return true;
            });

        // Sort events
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "date-asc":
                    return moment(a.date).diff(moment(b.date));
                case "date-desc":
                    return moment(b.date).diff(moment(a.date));
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "rating-desc":
                    return b.rating - a.rating;
                case "popularity":
                    return b.registered - a.registered;
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "capacity":
                    return (
                        a.capacity - a.registered - (b.capacity - b.registered)
                    );
                default:
                    return 0;
            }
        });

        return filtered;
    }, [events, activeTab, filters, sortBy]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            search: "",
            eventType: "all",
            category: "all",
            status: "all",
            priceRange: "all",
            featured: "all",
            dateRange: null,
        });
    };

    return {
        handleFilterChange,
        filteredAndSortedEvents,
        clearAllFilters,
        handleEditEvent,
        handleDeleteEvent,
    };
}
