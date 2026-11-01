import { AppstoreOutlined, AudioOutlined, BankOutlined, BookOutlined, CalendarOutlined, CloudOutlined, CodeOutlined, CustomerServiceOutlined, DesktopOutlined, DollarOutlined, FileTextOutlined, GiftOutlined, GlobalOutlined, HeartOutlined, HomeOutlined, IdcardOutlined, ReadOutlined, RobotOutlined, RocketOutlined, SafetyOutlined, ShareAltOutlined, ShoppingOutlined, SketchOutlined, SmileOutlined, SolutionOutlined, StarOutlined, TeamOutlined, ToolOutlined, TrophyOutlined, UserAddOutlined, UserOutlined, UserSwitchOutlined, VideoCameraOutlined } from "@ant-design/icons";

export const eventTypes = [
    {
        value: "all",
        label: "All Events",
        color: "default",
        icon: <CalendarOutlined />,
    },

    {
        value: "job-fair",
        label: "Job Fair",
        color: "geekblue",
        icon: <SolutionOutlined />,
    },
    {
        value: "hiring",
        label: "Hiring Event",
        color: "cyan",
        icon: <IdcardOutlined />,
    },
    {
        value: "interview",
        label: "Interview Day",
        color: "blue",
        icon: <UserSwitchOutlined />,
    },
    {
        value: "career-networking",
        label: "Career Networking",
        color: "gold",
        icon: <TeamOutlined />,
    },
    {
        value: "career-coaching",
        label: "Career Coaching",
        color: "purple",
        icon: <CustomerServiceOutlined />,
    },
    {
        value: "resume",
        label: "Resume Workshop",
        color: "orange",
        icon: <FileTextOutlined />,
    },
    {
        value: "internship",
        label: "Internship Event",
        color: "volcano",
        icon: <SmileOutlined />,
    },
    {
        value: "apprenticeship",
        label: "Apprenticeship Event",
        color: "magenta",
        icon: <ToolOutlined />,
    },

    {
        value: "conference",
        label: "Conference",
        color: "purple",
        icon: <VideoCameraOutlined />,
    },
    {
        value: "workshop",
        label: "Workshop",
        color: "orange",
        icon: <UserOutlined />,
    },
    {
        value: "seminar",
        label: "Seminar",
        color: "red",
        icon: <ReadOutlined />,
    },
    {
        value: "trade-show",
        label: "Trade Show",
        color: "geekblue",
        icon: <ShoppingOutlined />,
    },
    {
        value: "pitch",
        label: "Startup Pitch",
        color: "lime",
        icon: <RocketOutlined />,
    },
    {
        value: "fundraising",
        label: "Fundraising",
        color: "gold",
        icon: <DollarOutlined />,
    },
    {
        value: "networking",
        label: "Networking",
        color: "blue",
        icon: <TeamOutlined />,
    },

    {
        value: "class",
        label: "Class / Training",
        color: "green",
        icon: <BookOutlined />,
    },
    {
        value: "hackathon",
        label: "Hackathon",
        color: "volcano",
        icon: <CodeOutlined />,
    },
    {
        value: "mentoring",
        label: "Mentoring",
        color: "cyan",
        icon: <UserAddOutlined />,
    },

    {
        value: "sports",
        label: "Sports",
        color: "green",
        icon: <TrophyOutlined />,
    },
    {
        value: "fitness",
        label: "Fitness",
        color: "lime",
        icon: <HeartOutlined />,
    },

    {
        value: "showcase",
        label: "Showcase",
        color: "red",
        icon: <StarOutlined />,
    },
    {
        value: "festival",
        label: "Festival",
        color: "magenta",
        icon: <GiftOutlined />,
    },
    {
        value: "concert",
        label: "Concert",
        color: "purple",
        icon: <AudioOutlined />,
    },
    {
        value: "party",
        label: "Party",
        color: "volcano",
        icon: <SmileOutlined />,
    },
    { value: "expo", label: "Expo", color: "blue", icon: <BankOutlined /> },

    {
        value: "virtual",
        label: "Virtual",
        color: "cyan",
        icon: <GlobalOutlined />,
    },
    {
        value: "webinar",
        label: "Webinar",
        color: "geekblue",
        icon: <DesktopOutlined />,
    },
    {
        value: "hybrid",
        label: "Hybrid Event",
        color: "gold",
        icon: <ShareAltOutlined />,
    },
    // =========================
    // ALUMNI EVENTS
    // =========================

    {
        value: "alumni-homecoming",
        label: "Alumni Homecoming",
        color: "gold",
        icon: <HomeOutlined />,
    },
    {
        value: "alumni-reunion",
        label: "Batch Reunion",
        color: "cyan",
        icon: <TeamOutlined />,
    },
    {
        value: "alumni-awards",
        label: "Alumni Recognition Awards",
        color: "orange",
        icon: <TrophyOutlined />,
    },
    {
        value: "industry-talk",
        label: "Industry Expert Talk",
        color: "purple",
        icon: <ReadOutlined />,
    },
    {
        value: "community-outreach",
        label: "Community Outreach",
        color: "green",
        icon: <HeartOutlined />,
    },
    {
        value: "leadership-summit",
        label: "Leadership Summit",
        color: "volcano",
        icon: <SolutionOutlined />,
    },

    // =========================
    // BSBA EVENTS
    // =========================

    {
        value: "business-forum",
        label: "Business Leadership Forum",
        color: "gold",
        icon: <SolutionOutlined />,
    },
    {
        value: "entrepreneurship-summit",
        label: "Entrepreneurship Summit",
        color: "lime",
        icon: <RocketOutlined />,
    },
    {
        value: "marketing-expo",
        label: "Marketing Expo",
        color: "blue",
        icon: <ShoppingOutlined />,
    },
    {
        value: "finance-workshop",
        label: "Finance Workshop",
        color: "green",
        icon: <DollarOutlined />,
    },
    {
        value: "startup-showcase",
        label: "Startup Showcase",
        color: "volcano",
        icon: <StarOutlined />,
    },

    // =========================
    // BEED EVENTS
    // =========================

    {
        value: "teaching-demo",
        label: "Teaching Demonstration",
        color: "green",
        icon: <BookOutlined />,
    },
    {
        value: "classroom-management",
        label: "Classroom Management Workshop",
        color: "blue",
        icon: <ReadOutlined />,
    },
    {
        value: "teacher-mentoring",
        label: "Teacher Mentoring Session",
        color: "purple",
        icon: <UserAddOutlined />,
    },
    {
        value: "child-development",
        label: "Child Development Seminar",
        color: "orange",
        icon: <SmileOutlined />,
    },
    {
        value: "literacy-program",
        label: "Literacy Outreach Program",
        color: "cyan",
        icon: <HeartOutlined />,
    },

    // =========================
    // BSED EVENTS
    // =========================

    {
        value: "subject-specialization",
        label: "Subject Specialization Seminar",
        color: "blue",
        icon: <ReadOutlined />,
    },
    {
        value: "teaching-strategies",
        label: "Teaching Strategies Workshop",
        color: "orange",
        icon: <BookOutlined />,
    },
    {
        value: "research-colloquium",
        label: "Research Colloquium",
        color: "purple",
        icon: <FileTextOutlined />,
    },
    {
        value: "curriculum-development",
        label: "Curriculum Development Workshop",
        color: "cyan",
        icon: <UserOutlined />,
    },
    {
        value: "academic-symposium",
        label: "Academic Symposium",
        color: "red",
        icon: <VideoCameraOutlined />,
    },

    // =========================
    // BSIT EVENTS
    // =========================

    {
        value: "tech-conference",
        label: "Technology Conference",
        color: "geekblue",
        icon: <CodeOutlined />,
    },
    {
        value: "coding-bootcamp",
        label: "Coding Bootcamp",
        color: "blue",
        icon: <DesktopOutlined />,
    },
    {
        value: "cybersecurity-seminar",
        label: "Cybersecurity Seminar",
        color: "red",
        icon: <SafetyOutlined />,
    },
    {
        value: "ai-data-workshop",
        label: "AI & Data Workshop",
        color: "purple",
        icon: <RobotOutlined />,
    },
    {
        value: "system-development",
        label: "System Development Showcase",
        color: "cyan",
        icon: <AppstoreOutlined />,
    },
    {
        value: "cloud-computing",
        label: "Cloud Computing Workshop",
        color: "blue",
        icon: <CloudOutlined />,
    },
    {
        value: "uiux-design",
        label: "UI/UX Design Workshop",
        color: "magenta",
        icon: <SketchOutlined />,
    },
];

export const eventCategories = [
    { value: "all", label: "All Categories" },
    { value: "professional", label: "Professional Development" },
    { value: "social", label: "Social & Networking" },
    { value: "recreational", label: "Recreational" },
    { value: "educational", label: "Educational" },
    { value: "philanthropy", label: "Philanthropy & Service" },
    { value: "campus_traditions", label: "Campus & Traditions" },
    { value: "student_engagement", label: "Student Engagement" },
    { value: "regional_global", label: "Regional & Global Chapters" },
    { value: "family", label: "Family & Community" },
    { value: "arts_culture", label: "Arts & Cultural" },
    { value: "athletics", label: "Athletics & Spirit" },
    { value: "virtual", label: "Virtual / Hybrid" },
    { value: "affinity", label: "Affinity & Identity Groups" },
    { value: "career_development", label: "Career Development" },
    { value: "industry_networking", label: "Industry Networking" },
    { value: "research_innovation", label: "Research & Innovation" },
    { value: "entrepreneurship", label: "Entrepreneurship" },
    { value: "teacher_education", label: "Teacher Education" },
    { value: "technology", label: "Technology & Innovation" },
    { value: "community_service", label: "Community Service" },
    { value: "alumni_relations", label: "Alumni Relations" },
    {
        value: "professional_certification",
        label: "Professional Certification",
    },
];

export const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

export const sortOptions = [
    { value: "date-asc", label: "Date: Earliest First" },
    { value: "date-desc", label: "Date: Latest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" },
    { value: "title-asc", label: "Title: A to Z" },
    { value: "capacity", label: "Availability" },
];
