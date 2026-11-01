import { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";

export default function useJobPostState() {
    const isTouchDevice = useIsTouchDevice();

    const [userRole, setUserRole] = useState("alumni");

    const [currentUser, setCurrentUser] = useState(null);

    const [activeTab, setActiveTab] = useState("browse");

    const [jobPosts, setJobPosts] = useState([]);

    const [pendingPosts, setPendingPosts] = useState([]);

    const [fullOrExpiredPosts, setFullOrExpiredPosts] = useState([]);

    const [myPostings, setMyPostings] = useState([]);

    const [myApplications, setMyApplications] = useState([]);

    const [loading, setLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);

    // ============ NEW: STATE FOR SUBMIT WARNING MODAL ============
    const [submitWarningModalVisible, setSubmitWarningModalVisible] =
        useState(false);

    const [pendingFormValues, setPendingFormValues] = useState(null);

    const [isApplicationModalVisible, setIsApplicationModalVisible] =
        useState(false);

    const [editingPost, setEditingPost] = useState(null);

    const [selectedJob, setSelectedJob] = useState(null);

    const [jobDetailsVisible, setJobDetailsVisible] = useState(false);

    const [applicationsVisible, setApplicationsVisible] = useState(false);

    const [jobApplications, setJobApplications] = useState([]);

    const [applicationsLoading, setApplicationsLoading] = useState(false);

    const [form] = Form.useForm();

    const [appForm] = Form.useForm();

    const [statsData, setStatsData] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        fullOrExpired: 0,
    });

    const [initialLoading, setInitialLoading] = useState(true);

    // ============ NEW: MOBILE RESPONSIVE STATE ============
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false,
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [applicantSearchText, setApplicantSearchText] = useState("");

    // Keeps the latest banner fileList instantly (prevents stale state on fast submit)
    const bannerFileListRef = useRef([]);

    // ============ NEW: STATE FOR REJECTION MODALS ============
    const [rejectJobPostModalVisible, setRejectJobPostModalVisible] =
        useState(false);

    const [rejectJobPostId, setRejectJobPostId] = useState(null);

    const [rejectJobPostNotes, setRejectJobPostNotes] = useState("");

    const [rejectJobPostLoading, setRejectJobPostLoading] = useState(false);

    const [rejectApplicationModalVisible, setRejectApplicationModalVisible] =
        useState(false);

    const [rejectApplicationId, setRejectApplicationId] = useState(null);

    const [rejectApplicationNotes, setRejectApplicationNotes] = useState("");

    const [rejectApplicationLoading, setRejectApplicationLoading] =
        useState(false);

    // ============ IMAGE UPLOAD STATE (SAME AS AlumniEvents.js) ============
    const [fileList, setFileList] = useState([]);

    // ============ NEW: STATE FOR CURRENT ALUMNI PROFILE ============
    const [currentAlumniProfile, setCurrentAlumniProfile] = useState(null);

    const [profileLoading, setProfileLoading] = useState(false);

    // ============ NEW: STATE FOR ID DOCUMENTS UPLOAD ============
    const [idDocuments, setIdDocuments] = useState([]);

    // { type: string, fileList: UploadFile[] }[]
    const [otherDocuments, setOtherDocuments] = useState([]);

    // ============ NEW: STATE FOR SUCCESS MODAL ============
    const [applicationSuccessModalVisible, setApplicationSuccessModalVisible] =
        useState(false);

    // ============ NEW: LOADING STATES FOR BUTTONS ============
    const [submitWarningLoading, setSubmitWarningLoading] = useState(false);

    const [jobPostSubmitLoading, setJobPostSubmitLoading] = useState(false);

    const [applicationActionLoading, setApplicationActionLoading] = useState(
        {},
    );

    const [withdrawLoading, setWithdrawLoading] = useState({});

    const [submitApplicationLoading, setSubmitApplicationLoading] =
        useState(false);

    // Filters State
    const [searchText, setSearchText] = useState("");

    const [filterJobType, setFilterJobType] = useState("all");

    const [filterStatus, setFilterStatus] = useState("all");

    const [sortBy, setSortBy] = useState("date-desc");

    // ============ REF TO TRACK PREVIOUS DATA FOR SMOOTH UPDATES ============
    const prevJobPostsRef = useRef([]);

    const prevPendingPostsRef = useRef([]);

    const prevFullOrExpiredPostsRef = useRef([]);

    const prevMyPostingsRef = useRef([]);

    const prevMyApplicationsRef = useRef([]);

    // ✅ FIX: tracks whether the component is still mounted so that
    // in-flight polling/fetch requests don't call setState after unmount
    // (fixes "Can't perform a React state update on an unmounted component").
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // ============================================================
    // ============ ENHANCEMENT: Draft + UX state ============
    // ============================================================
    const [draftLastSaved, setDraftLastSaved] = useState(null);

    const [draftRestoreModalVisible, setDraftRestoreModalVisible] =
        useState(false);

    const [pendingDraft, setPendingDraft] = useState(null);

    const [discardConfirmVisible, setDiscardConfirmVisible] = useState(false);

    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const [lastCreatedJob, setLastCreatedJob] = useState(null);

    const [referenceUrlValid, setReferenceUrlValid] = useState(null);

    const draftSaveTimerRef = useRef(null);

    // ============================================================
    // ENHANCEMENT: Application Draft / Unsaved-Changes state
    // ============================================================
    const [applicationFormDirty, setApplicationFormDirty] = useState(false);

    const [
        applicationDiscardConfirmVisible,
        setApplicationDiscardConfirmVisible,
    ] = useState(false);

    const [applicationDraftRestoreVisible, setApplicationDraftRestoreVisible] =
        useState(false);

    const [pendingApplicationDraft, setPendingApplicationDraft] =
        useState(null);

    const [applicationDraftLastSaved, setApplicationDraftLastSaved] =
        useState(null);

    const applicationDraftTimerRef = useRef(null);

    // Snapshot of selected job + user used for the current draft key so we can
    // still persist/clear correctly even after state changes during submit.
    const applicationDraftCtxRef = useRef({ jobId: null, userId: null });

    return {
        form,
        bannerFileListRef,
        editingPost,
        isModalVisible,
        setDraftLastSaved,
        draftSaveTimerRef,
        setReferenceUrlValid,
        setFileList,
        setPendingDraft,
        setDraftRestoreModalVisible,
        setIsModalVisible,
        setEditingPost,
        setDiscardConfirmVisible,
        isMountedRef,
        setJobPosts,
        prevJobPostsRef,
        setPendingPosts,
        prevPendingPostsRef,
        setFullOrExpiredPosts,
        prevFullOrExpiredPostsRef,
        setStatsData,
        setMyPostings,
        prevMyPostingsRef,
        setMyApplications,
        prevMyApplicationsRef,
        setApplicationsLoading,
        setApplicationsVisible,
        setJobApplications,
        setProfileLoading,
        setCurrentAlumniProfile,
        jobPosts,
        activeTab,
        searchText,
        filterJobType,
        filterStatus,
        sortBy,
        setUserRole,
        setCurrentUser,
        setActiveTab,
        setInitialLoading,
        userRole,
        setIdDocuments,
        setOtherDocuments,
        idDocuments,
        setPendingFormValues,
        setSubmitWarningModalVisible,
        setJobPostSubmitLoading,
        setLastCreatedJob,
        setSuccessModalVisible,
        fileList,
        setRejectJobPostId,
        setRejectJobPostNotes,
        setRejectJobPostModalVisible,
        rejectJobPostNotes,
        setRejectJobPostLoading,
        rejectJobPostId,
        setSelectedJob,
        setIsApplicationModalVisible,
        currentUser,
        applicationDraftCtxRef,
        setApplicationFormDirty,
        setApplicationDraftLastSaved,
        setPendingApplicationDraft,
        setApplicationDraftRestoreVisible,
        appForm,
        setJobDetailsVisible,
        setRejectApplicationId,
        setRejectApplicationNotes,
        setRejectApplicationModalVisible,
        setApplicationActionLoading,
        selectedJob,
        rejectApplicationNotes,
        setRejectApplicationLoading,
        rejectApplicationId,
        setSubmitApplicationLoading,
        otherDocuments,
        setApplicationSuccessModalVisible,
        isApplicationModalVisible,
        applicationDraftTimerRef,
        setApplicationDiscardConfirmVisible,
        setWithdrawLoading,
        statsData,
        setSearchText,
        setFilterJobType,
        setFilterStatus,
        setSortBy,
        pendingPosts,
        fullOrExpiredPosts,
        myApplications,
        myPostings,
        withdrawLoading,
        rejectJobPostModalVisible,
        rejectJobPostLoading,
        isMobile,
        rejectApplicationModalVisible,
        rejectApplicationLoading,
        draftLastSaved,
        jobPostSubmitLoading,
        referenceUrlValid,
        discardConfirmVisible,
        draftRestoreModalVisible,
        pendingDraft,
        successModalVisible,
        lastCreatedJob,
        jobDetailsVisible,
        isTouchDevice,
        jobApplications,
        setApplicantSearchText,
        applicationsVisible,
        applicationsLoading,
        applicantSearchText,
        applicationActionLoading,
        submitApplicationLoading,
        profileLoading,
        currentAlumniProfile,
        applicationDiscardConfirmVisible,
        applicationDraftLastSaved,
        applicationDraftRestoreVisible,
        pendingApplicationDraft,
        applicationSuccessModalVisible,
        submitWarningModalVisible,
        pendingFormValues,
        setSubmitWarningLoading,
        submitWarningLoading,
    };
}
