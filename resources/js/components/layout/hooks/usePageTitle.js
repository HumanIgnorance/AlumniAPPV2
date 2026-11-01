import { useEffect } from "react";
import { buildPageTitle } from "~/config/site";

export default function usePageTitle({ pathname }) {
    useEffect(() => {
        const pageTitles = {
            "/home": "Home",
            "/gallery": "Photo Library",
            "/profile": "Profile Settings",
            "/admin-dashboard": "Admin Dashboard",
            "/department-dashboard": "Department Dashboard",
            "/alumni": "Alumni List",
            "/events": "Alumni Events",
            "/messages": "Messages",
            "/job-posts": "Job Posts",
            "/faq": "Help Center",
            "/about": "About Us",
            "/questions": "Questions",
            "/department-heads": "Department Accounts",
            "/feedback-reports": "Feedback Reports",
            "/announcements": "Announcements",
            "/402": "Maintenance",
            "/audit-logs": "Audit Logs",
        };

        const pageTitle = pageTitles[pathname] || "ATMS";

        document.title = buildPageTitle(pageTitle);
    }, [pathname]);
}
