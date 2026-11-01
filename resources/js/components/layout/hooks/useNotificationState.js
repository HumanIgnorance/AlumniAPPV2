import { useState } from "react";

export default function useNotificationState() {
    const [animateBell, setAnimateBell] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [allNotifications, setAllNotifications] = useState([]);

    const [filterUnread, setFilterUnread] = useState(false);

    const [activeCategory, setActiveCategory] = useState("all");

    const [settingsModalVisible, setSettingsModalVisible] = useState(false);

    const [allNotificationsModalVisible, setAllNotificationsModalVisible] =
        useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const [totalNotifications, setTotalNotifications] = useState(0);

    const [perPage] = useState(10);

    const [modalPerPage] = useState(50);

    const [loadingMore, setLoadingMore] = useState(false);

    return {
        filterUnread,
        activeCategory,
        perPage,
        setNotifications,
        setTotalNotifications,
        setLoadingMore,
        modalPerPage,
        setAllNotifications,
        setCurrentPage,
        notifications,
        setAnimateBell,
        settingsModalVisible,
        setSettingsModalVisible,
        allNotifications,
        totalNotifications,
        allNotificationsModalVisible,
        setAllNotificationsModalVisible,
        setActiveCategory,
        setFilterUnread,
        currentPage,
        loadingMore,
        animateBell,
    };
}
