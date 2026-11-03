import { useEffect, useState } from "react";
import { INSPECT_PROTECTION_ENABLED } from "~/config/inspect";
import {
    BookOutlined,
    FileImageOutlined,
    SafetyCertificateOutlined,
    TrophyOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Form } from "antd";
import { buildPageTitle } from "~/config/site";
import { useAppTheme } from "~/hooks/useAppTheme";
import useCourses from "~/hooks/useCourses";
import useEmployeeStatus from "~/hooks/useEmployeeStatus";

export default function useRegistrationState() {
    const { isLoading, data: courses, isFetching, refetch } = useCourses();

    const { data: statuses } = useEmployeeStatus();

    const [currentStep, setCurrentStep] = useState(0);

    const [form] = Form.useForm();

    // ===== Back-to-login confirmation =====
    // Defaults provided via <Form initialValues={...}>. We ignore these so an
    // untouched form is correctly treated as "empty".
    const DEFAULT_INITIAL_VALUES = {
        gender: "male",
        newsletter: true,
        contactPermission: true,
    };

    const [profileImage, setProfileImage] = useState(null);

    const [idDocuments, setIdDocuments] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [previewData, setPreviewData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

    const [selectedGradYear, setSelectedGradYear] = useState(null);

    const [isUnemployed, setIsUnemployed] = useState(false);

    const [isAgreementModalVisible, setIsAgreementModalVisible] =
        useState(false);

    const [saveTimeout, setSaveTimeout] = useState(null);

    const [showImportantNotice, setShowImportantNotice] = useState(true);

    // ================= SAVE FORM DATA =================
    const STORAGE_KEY = "alumni-registration-form";

    // ================= END SAVE FORM DATA =================
    // Add this after line 167 (const AlumniRegistration = () => {)

    // ============ THEME SYNC FROM FORMLOGIN ============
    // Now backed by the shared useAppTheme hook (same cookie + secureLocalStorage
    // + BroadcastChannel sync used by FormLogin), instead of a hand-rolled
    // localStorage listener.
    const { theme: currentTheme, toggleTheme } = useAppTheme();

    // ============ END THEME SYNC ============

    const steps = [
        {
            title: "Personal Info",
            icon: <UserOutlined />,
        },
        {
            title: "Academic Info",
            icon: <BookOutlined />,
        },
        {
            title: "Career Info",
            icon: <TrophyOutlined />,
        },
        {
            title: "Documents",
            icon: <FileImageOutlined />,
        },
        {
            title: "Review & Submit",
            icon: <SafetyCertificateOutlined />,
        },
    ];

    useEffect(() => {
        document.title = buildPageTitle("Alumni Registration");
    }, []);

    //  Prevent //
    useEffect(() => {
        if (!INSPECT_PROTECTION_ENABLED) return undefined;

        const disableContextMenu = (e) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", disableContextMenu);

        return () => {
            document.removeEventListener("contextmenu", disableContextMenu);
        };
    }, []);

    useEffect(() => {
        if (!INSPECT_PROTECTION_ENABLED) return undefined;

        const handleKeyDown = (e) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
                (e.ctrlKey && e.key === "u")
            ) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return {
        profileImage,
        idDocuments,
        form,
        DEFAULT_INITIAL_VALUES,
        setProfileImage,
        setIdDocuments,
        setCurrentStep,
        setSelectedGradYear,
        setIsUnemployed,
        STORAGE_KEY,
        currentStep,
        selectedGradYear,
        isUnemployed,
        setIsAgreementModalVisible,
        courses,
        setPreviewData,
        setIsModalVisible,
        steps,
        setLoading,
        showImportantNotice,
        setShowImportantNotice,
        isLoading,
        statuses,
        setIsPrivacyModalOpen,
        setIsTermsModalOpen,
        toggleTheme,
        currentTheme,
        isModalVisible,
        previewData,
        loading,
        isAgreementModalVisible,
        isPrivacyModalOpen,
        isTermsModalOpen,
    };
}
