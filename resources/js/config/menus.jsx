import {
    CalendarOutlined,
    CommentOutlined,
    DashboardOutlined,
    FileSearchOutlined,
    GroupOutlined,
    HomeOutlined,
    MessageOutlined,
    NotificationOutlined,
    QuestionCircleOutlined,
    SolutionOutlined,
    TeamOutlined,
    UserAddOutlined,
} from "@ant-design/icons";

export const MENU_ADMIN = [
    {
        key: 10,
        url: "/home",
        label: "Home",
        icon: <HomeOutlined className="menu-icon" />,
    },
    {
        key: 15,
        url: "/admin-dashboard",
        label: "Dashboard",
        icon: <DashboardOutlined className="menu-icon" />,
    },
    {
        key: 120,
        url: "/alumni",
        label: "Alumni",
        icon: <TeamOutlined className="menu-icon" />,
    },
    {
        key: 121,
        url: "/events",
        label: "Events",
        icon: <CalendarOutlined className="menu-icon" />,
    },
    {
        key: 122,
        url: "/announcements",
        label: "Announcements",
        icon: <NotificationOutlined className="menu-icon" />,
    },
    //  {
    //     key: 123,
    //     url: "/402",
    //     label: "E-Newsletter",
    //     icon: <ReadOutlined className="menu-icon" />,
    // },
    {
        key: 124,
        url: "/questions",
        label: "Questions",
        icon: <QuestionCircleOutlined className="menu-icon" />,
    },
    {
        key: 125,
        url: "/department-heads",
        label: "Create D.H.A",
        icon: <UserAddOutlined className="menu-icon" />,
    },
    {
        key: 126,
        url: "/messages",
        label: "Messages",
        icon: <MessageOutlined className="menu-icon" />,
    },
    {
        key: 127,
        url: "/job-posts",
        label: "Job Posts",
        icon: <SolutionOutlined className="menu-icon" />,
    },
    {
        key: 128,
        url: "/audit-logs",
        label: "Audit Log",
        icon: <FileSearchOutlined className="menu-icon" />,
    },
    {
        key: 129,
        url: "/feedback-reports",
        label: "Feedback Reports",
        icon: <CommentOutlined className="menu-icon" />,
    },
];

export const MENU_ALUMNI = [
    {
        key: 10,
        url: "/home",
        label: "Home",
        icon: <HomeOutlined className="menu-icon" />,
    },
    {
        key: 120,
        url: "/alumni",
        label: "Alumni",
        icon: <GroupOutlined className="menu-icon" />,
    },
    {
        key: 121,
        url: "/events",
        label: "Events",
        icon: <CalendarOutlined className="menu-icon" />,
    },
    {
        key: 122,
        url: "/announcements",
        label: "Announcements",
        icon: <NotificationOutlined className="menu-icon" />,
    },
    //   {
    //     key: 123,
    //     url: "/402",
    //     label: "E-Newsletter",
    //     icon: <ReadOutlined className="menu-icon" />,
    // },
    {
        key: 124,
        url: "/messages",
        label: "Messages",
        icon: <MessageOutlined className="menu-icon" />,
    },
    {
        key: 125,
        url: "/job-posts",
        label: "Job Posts",
        icon: <SolutionOutlined className="menu-icon" />,
    },
];

export const MENU_DEPARTMENT_HEAD = [
    {
        key: 15,
        url: "/department-dashboard",
        label: "Dashboard",
        icon: <DashboardOutlined className="menu-icon" />,
    },
];
