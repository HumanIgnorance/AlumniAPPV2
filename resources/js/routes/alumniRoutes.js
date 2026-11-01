// Alumni (member) pages — a subset of the admin pages plus /profile.
import {
  HomePage, AlumniList, AlumniEvents, ProfilePage, AdminAlumniMessages,
  AdminAlumniJobPostPage, GalleryPage, AboutPage, FaqPage, AnnouncementsPage,
} from "./lazyPages";

export const alumniRoutes = [
  { path: "/home", component: HomePage },
  { path: "/alumni", component: AlumniList },
  { path: "/events", component: AlumniEvents },
  { path: "/profile", component: ProfilePage },
  { path: "/messages", component: AdminAlumniMessages },
  { path: "/job-posts", component: AdminAlumniJobPostPage },
  { path: "/gallery", component: GalleryPage },
  { path: "/about", component: AboutPage },
  { path: "/faq", component: FaqPage },
  { path: "/announcements", component: AnnouncementsPage },
];
