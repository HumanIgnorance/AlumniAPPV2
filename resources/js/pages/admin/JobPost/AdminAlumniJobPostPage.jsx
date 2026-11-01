import React from "react";
import { Layout } from "~/components";
import "./styles";
import { JobPostProvider } from "./JobPostContext";
import useJobPostController from "./hooks/useJobPostController";
import JobPostHero from "./parts/JobPostHero";
import JobPostTabs from "./parts/JobPostTabs";
import JobRejectModal from "./parts/JobRejectModal";
import ApplicationRejectModal from "./parts/ApplicationRejectModal";
import CreateEditJobModal from "./parts/CreateEditJobModal";
import JobFormPromptModals from "./parts/JobFormPromptModals";
import JobDetailsDrawer from "./parts/JobDetailsDrawer";
import ApplicationsDrawer from "./parts/ApplicationsDrawer";
import ApplicationFormModal from "./parts/ApplicationFormModal";
import ApplicationPromptModals from "./parts/ApplicationPromptModals";
import ApplicationSuccessModal from "./parts/ApplicationSuccessModal";
import SubmitWarningModal from "./parts/SubmitWarningModal";

/**
 * Job Posts page (admin + alumni).
 *   hooks/  state, data loading, forms, applications, drafts (useJobPostController composes them)
 *   parts/  hero, tabs and every modal/drawer, one file each, plus shared helpers
 *           (jobPostConstants, jobPostHelpers, jobPostUtils, JobGrids, ...)
 */
function AdminAlumniJobPostPage() {
    const ctx = useJobPostController();

    return (
        <JobPostProvider value={ctx}>
            <Layout>
                <div className="job-post-page-container">
                    <JobPostHero />
                    <JobPostTabs />
                    <JobRejectModal />
                    <ApplicationRejectModal />
                    <CreateEditJobModal />
                    <JobFormPromptModals />
                    <JobDetailsDrawer />
                    <ApplicationsDrawer />
                    <ApplicationFormModal />
                    <ApplicationPromptModals />
                    <ApplicationSuccessModal />
                    <SubmitWarningModal />
                </div>
            </Layout>
        </JobPostProvider>
    );
}

export default AdminAlumniJobPostPage;
