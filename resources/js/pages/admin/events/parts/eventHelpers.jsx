import { CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { eventCategories, eventTypes } from "~/pages/admin/events/parts/eventConstants";

export const getEventTypeConfig = (type) => {
    return eventTypes.find((et) => et.value === type) || eventTypes[0];
};

export const getCategoryLabel = (value) => {
    const category = eventCategories.find((cat) => cat.value === value);
    return category ? category.label : value;
};

// Formats any time string (24h "HH:mm:ss", 24h "HH:mm", or already 12h "hh:mm A")
// into a consistent 12-hour "hh:mm A" display string, e.g. "05:00 AM".
export const formatTimeDisplay = (value) => {
    if (!value) return "";
    const parsed = moment(
        value,
        ["HH:mm:ss", "HH:mm", "hh:mm A", "h:mm A"],
        true,
    );
    return parsed.isValid() ? parsed.format("hh:mm A") : value;
};

export const getStatusTag = (status) => {
    const statusConfig = {
        upcoming: {
            color: "blue",
            text: "Upcoming",
            icon: <ClockCircleOutlined />,
        },
        ongoing: {
            color: "green",
            text: "Live Now",
            icon: <CheckCircleOutlined />,
        },
        completed: {
            color: "default",
            text: "Completed",
            icon: <CheckCircleOutlined />,
        },
        cancelled: {
            color: "red",
            text: "Cancelled",
            icon: <DeleteOutlined />,
        },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return (
        <Tag color={config.color} icon={config.icon}>
            {config.text}
        </Tag>
    );
};

export const normalizeTime = (t) => {
    if (!t) return null;
    // Parse both 12-hour (h:mm A) and 24-hour (HH:mm:ss) formats
    const parsed = dayjs(
        t,
        ["h:mm A", "hh:mm A", "H:mm", "HH:mm", "HH:mm:ss"],
        true,
    );
    if (!parsed.isValid()) {
        console.warn("Invalid time format:", t);
        return null;
    }
    return parsed.format("HH:mm"); // Return in 24-hour format for consistent parsing
};

export const computeEventStatus = (event) => {
    const now = dayjs();

    const startTime = normalizeTime(event.start_time);
    const endTime = normalizeTime(event.end_time);

    if (!startTime || !endTime) {
        console.warn("Missing time data:", event);
        return "upcoming";
    }

    // Parse date and combine with time in 24-hour format
    const eventDate = dayjs(event.date).format("YYYY-MM-DD");
    const start = dayjs(`${eventDate} ${startTime}`, "YYYY-MM-DD HH:mm");
    const end = dayjs(`${eventDate} ${endTime}`, "YYYY-MM-DD HH:mm");

    // Debug logging
    // console.log("Event Status Calculation:", {
    //   title: event.title,
    //   date: event.date,
    //   eventDate,
    //   startTime: event.start_time,
    //   endTime: event.end_time,
    //   normalizedStart: startTime,
    //   normalizedEnd: endTime,
    //   parsedStart: start.format("YYYY-MM-DD HH:mm"),
    //   parsedEnd: end.format("YYYY-MM-DD HH:mm"),
    //   currentTime: now.format("YYYY-MM-DD HH:mm"),
    //   isStartValid: start.isValid(),
    //   isEndValid: end.isValid(),
    //   isBeforeStart: now.isBefore(start),
    //   isBetween: now.isBetween(start, end, null, "[]"),
    //   isAfterEnd: now.isAfter(end),
    // })

    if (!start.isValid() || !end.isValid()) {
        console.warn("Invalid event date/time:", event);
        return "upcoming";
    }

    if (now.isBefore(start)) return "upcoming";
    if (now.isBetween(start, end, null, "[]")) return "ongoing";
    return "completed";
};
