/**
 * Every page, loaded on demand (one JS file per page).
 *
 * Why this file exists: before, routes/index.js imported ALL pages up front,
 * so the browser downloaded the whole app (admin + alumni + public, ~4.4 MB)
 * even for the login screen. Now a visitor downloads only the page they open.
 *
 * - Import the page FILE directly (never a folder `index.js` barrel); a barrel
 *   drags every sibling page into the same chunk and undoes the splitting.
 * - A page used by several roles is declared once here, so all role route
 *   files share the same component (and the same chunk).
 * - lazyWithRetry reloads once after a deploy if an old chunk name 404s.
 */
import lazyWithRetry from "~/utils/lazyWithRetry";

// ── public / auth ────────────────────────────────────────────────────────
export const MainPage = lazyWithRetry(() => import("~/pages/Main/MainPage"));
export const LoginPage = lazyWithRetry(() => import("~/pages/auth/LoginPage"));
export const PublicHomePage = lazyWithRetry(() => import("~/pages/auth/PublicHomePage"));
export const AlumniRegistration = lazyWithRetry(() => import("~/pages/auth/AlumniRegistration"));
export const AnswerQuizPage = lazyWithRetry(() => import("~/pages/auth/AnswerQuizPage"));
export const ImageQuizPage = lazyWithRetry(() => import("~/pages/auth/ImageQuizPage"));
export const PublicEventsPage = lazyWithRetry(() => import("~/pages/auth/PublicEventsPage"));
export const PublicAnnouncementsPage = lazyWithRetry(() => import("~/pages/auth/PublicAnnouncementsPage"));
export const PublicGalleryPage = lazyWithRetry(() => import("~/pages/auth/PublicGalleryPage"));
export const PublicJobPostsPage = lazyWithRetry(() => import("~/pages/auth/PublicJobPostsPage"));
export const PublicOccServicesPage = lazyWithRetry(() => import("~/pages/auth/PublicOccServicesPage"));
export const InstallPwaPage = lazyWithRetry(() => import("~/pages/auth/InstallPwaPage"));
export const PublicContactPage = lazyWithRetry(() => import("~/pages/auth/PublicContactPage"));
export const PublicCreditsPage = lazyWithRetry(() => import("~/pages/auth/PublicCreditsPage"));
export const FaqPublicPage = lazyWithRetry(() => import("~/pages/admin/Faq/FaqPublicPage"));
export const AboutPublicPage = lazyWithRetry(() => import("~/pages/admin/About/AboutPublicPage"));

// ── error pages ──────────────────────────────────────────────────────────
export const Pages402 = lazyWithRetry(() => import("~/pages/ErrorPages/Pages402"));
export const Pages404 = lazyWithRetry(() => import("~/pages/ErrorPages/Pages404"));
export const PublicPages404 = lazyWithRetry(() => import("~/pages/ErrorPages/PublicPages404"));

// ── shared by admin + alumni (+ department head) ─────────────────────────
export const HomePage = lazyWithRetry(() => import("~/pages/admin/Home/homePage"));
export const AlumniList = lazyWithRetry(() => import("~/pages/admin/alumni/AlumniList"));
export const AlumniEvents = lazyWithRetry(() => import("~/pages/admin/events/AlumniEvents"));
export const ProfilePage = lazyWithRetry(() => import("~/pages/admin/ProfilePage"));
export const AdminAlumniMessages = lazyWithRetry(() => import("~/pages/admin/messages/AdminAlumniMessages"));
export const AdminAlumniJobPostPage = lazyWithRetry(() => import("~/pages/admin/JobPost/AdminAlumniJobPostPage"));
export const GalleryPage = lazyWithRetry(() => import("~/pages/admin/Gallery/galleryPage"));
export const AboutPage = lazyWithRetry(() => import("~/pages/admin/About/AboutPage"));
export const FaqPage = lazyWithRetry(() => import("~/pages/admin/Faq/FaqPage"));
export const AnnouncementsPage = lazyWithRetry(() => import("~/pages/admin/Announcement/AnnouncementsPage"));

// ── admin only ───────────────────────────────────────────────────────────
export const DashboardPage = lazyWithRetry(() => import("~/pages/admin/dashboard/DashboardPage"));
export const AlumniQuestionsPage = lazyWithRetry(() => import("~/pages/admin/questions/AlumniQuestionsPage"));
export const DepartmentHeadsPage = lazyWithRetry(() => import("~/pages/admin/department-heads/DepartmentHeadsPage"));
export const DepartmentDashboardPage = lazyWithRetry(() => import("~/pages/admin/department-heads/DepartmentDashboardPage"));
export const AuditLogPage = lazyWithRetry(() => import("~/pages/admin/audit-log/AuditLogPage"));
export const AtmsFeedbackReportsPage = lazyWithRetry(() => import("~/pages/admin/Feedback/AtmsFeedbackReportsPage"));
