// Admin / department-head pages (each page renders the shared <Layout>).
import {
  HomePage, DashboardPage, AlumniList, AlumniEvents, AlumniQuestionsPage,
  DepartmentHeadsPage, DepartmentDashboardPage, AdminAlumniMessages,
  AdminAlumniJobPostPage, AuditLogPage, AtmsFeedbackReportsPage, GalleryPage,
  AboutPage, FaqPage, AnnouncementsPage,
} from "./lazyPages";

export const adminRoutes = [
  { path: "/home", component: HomePage },
  { path: "/admin-dashboard", component: DashboardPage },
  { path: "/alumni", component: AlumniList },
  { path: "/events", component: AlumniEvents },
  { path: "/questions", component: AlumniQuestionsPage },
  { path: "/department-heads", component: DepartmentHeadsPage },
  { path: "/department-dashboard", component: DepartmentDashboardPage },
  { path: "/messages", component: AdminAlumniMessages },
  { path: "/job-posts", component: AdminAlumniJobPostPage },
  { path: "/audit-logs", component: AuditLogPage },
  { path: "/feedback-reports", component: AtmsFeedbackReportsPage },
  { path: "/gallery", component: GalleryPage },
  { path: "/about", component: AboutPage },
  { path: "/faq", component: FaqPage },
  { path: "/announcements", component: AnnouncementsPage },
];
