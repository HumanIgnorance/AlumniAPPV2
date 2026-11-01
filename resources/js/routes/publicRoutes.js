// Pages anyone can open (no login). Rendered with the plain NoLayout shell.
import {
  PublicHomePage, LoginPage, AlumniRegistration, AnswerQuizPage, ImageQuizPage,
  PublicEventsPage, PublicAnnouncementsPage, PublicGalleryPage, PublicJobPostsPage,
  PublicOccServicesPage, InstallPwaPage, PublicContactPage, PublicCreditsPage,
} from "./lazyPages";

export const authRoutes = [
  { path: "/PublicHomePage", component: PublicHomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: AlumniRegistration },
  { path: "/answer-question", component: AnswerQuizPage },
  { path: "/image-quiz", component: ImageQuizPage },
  { path: "/public-events", component: PublicEventsPage },
  { path: "/public-announcements", component: PublicAnnouncementsPage },
  { path: "/public-gallery", component: PublicGalleryPage },
  { path: "/public-job-posts", component: PublicJobPostsPage },
  { path: "/occ-services", component: PublicOccServicesPage },
  { path: "/install-pwa", component: InstallPwaPage },
  { path: "/public-contact", component: PublicContactPage },
  { path: "/public-credits", component: PublicCreditsPage },
];
