// Content of the About page (shared by the admin and public About pages).
import { SafetyCertificateOutlined, UserOutlined, TeamOutlined, CalendarOutlined, SolutionOutlined, MessageOutlined, BellOutlined, PictureOutlined, QuestionCircleOutlined, HeartOutlined, GlobalOutlined, LineChartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { COLORS } from "~/config/theme";

export const FEATURES = [
  {
    icon: <SafetyCertificateOutlined />,
    title: "Secure Login & Registration",
    desc: "Create your alumni account through a guided, step-by-step registration — Personal Info, Academic Info, Career Info, Documents, and Review & Submit — with your details kept safe behind secure sign-in.",
    color: COLORS.indigo600,
  },
  {
    icon: <UserOutlined />,
    title: "My Profile Management",
    desc: "View and update your personal, contact, academic, and professional information anytime. Upload your profile photo and keep your details current so the Alumni Office can stay in touch.",
    color: COLORS.sky500,
  },
  {
    icon: <TeamOutlined />,
    title: "Alumni Directory",
    desc: "Browse fellow graduates organized by course, search by name, and filter by employment status to reconnect with batchmates and see who else is part of the alumni community.",
    color: COLORS.emerald500,
  },
  {
    icon: <CalendarOutlined />,
    title: "Events & Activities",
    desc: "See upcoming reunions, seminars, workshops, and job fairs with full details — date, time, venue, and available slots — and register to join with just a click.",
    color: COLORS.red500,
  },
  {
    icon: <SolutionOutlined />,
    title: "Job & Career Opportunities",
    desc: "Browse verified job openings shared by the institution and its partners, complete with salary range, location, and requirements, to help you find your next career move.",
    color: COLORS.cyan500,
  },
  {
    icon: <MessageOutlined />,
    title: "Messaging with the Alumni Office",
    desc: "Send inquiries, requests, or concerns directly to the Alumni Office and receive responses right inside the system — no need for a separate email thread.",
    color: "#ec4899",
  },
  {
    icon: <BellOutlined />,
    title: "Real-Time Notifications",
    desc: "Get instant alerts for event registrations, profile updates, account status, and quiz reminders, so you never miss anything important.",
    color: COLORS.orange500,
  },
  {
    icon: <PictureOutlined />,
    title: "Photo Gallery",
    desc: "Relive memories through photos from past alumni gatherings, reunions, and institutional activities in an easy-to-browse image gallery.",
    color: COLORS.green500,
  },
  {
    icon: <QuestionCircleOutlined />,
    title: "Feedback Quizzes",
    desc: "Complete short rating and image-based quizzes so the Alumni Office can better understand your experience and improve programs and services for graduates.",
    color: COLORS.purple500,
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Account & Password Security",
    desc: "Change your password anytime with a real-time strength meter, or securely reset it through a verified email link if you ever forget it.",
    color: "#0f766e",
  },
];

export const PAGES = [
  { name: "Login Page", desc: "Sign in securely with your registered email and password to access your alumni account." },
  { name: "Alumni Registration", desc: "A guided sign-up process where you submit your personal, academic, career, and document details for verification." },
  { name: "Home", desc: "Your starting point after logging in — quick access to the features and updates that matter to you." },
  { name: "My Profile", desc: "View and edit your personal, contact, academic, and professional information, plus manage your password." },
  { name: "Alumni Directory", desc: "Browse and search fellow graduates by course, name, or employment status to stay connected." },
  { name: "Events", desc: "Discover upcoming alumni activities and register to attend seminars, reunions, and other gatherings." },
  { name: "Job Posts", desc: "Explore job openings shared by the institution and partner companies and view full posting details." },
  { name: "Messages", desc: "Send and receive messages directly with the Alumni Office for any questions or concerns." },
  { name: "Notifications", desc: "Check alerts about your registrations, profile updates, account status, and reminders." },
  { name: "Gallery", desc: "Browse photos from alumni events, reunions, and institutional activities." },
  { name: "Quizzes", desc: "Answer short rating and image-based quizzes shared by the Alumni Office to give your feedback." },
  { name: "FAQ", desc: "Find quick answers to the most common questions about using the system." },
  { name: "About", desc: "Learn more about the purpose and features of the Alumni Tracing Management System." },
];

export const GOALS = [
  { icon: <HeartOutlined />, text: "Maintain strong, lasting connections between alumni and the institution" },
  { icon: <GlobalOutlined />, text: "Open doors to career opportunities and professional networking for graduates" },
  { icon: <MessageOutlined />, text: "Make it easy to reach the Alumni Office and stay informed" },
  { icon: <LineChartOutlined />, text: "Keep alumni profiles simple and effortless to update" },
  { icon: <TeamOutlined />, text: "Help graduates reconnect with batchmates and their alma mater" },
  { icon: <ThunderboltOutlined />, text: "Provide a fast, secure, and mobile-friendly alumni experience" },
];
