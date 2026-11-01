import useProfile from "~/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { message } from "antd";
import moment from "moment";
import axiosConfig from "~/utils/axiosConfig";
import { CAREER_EDIT_LOCK_DAYS } from "~/pages/admin/profile-page/parts/profileShared";

export default function useProfileController() {
    const { data: profile, loading, refetch } = useProfile();
    const [previewData, setPreviewData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailedProfile, setDetailedProfile] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedValues, setEditedValues] = useState({});
    const [saving, setSaving] = useState(false);
    const [viewOnly, setViewOnly] = useState(true);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const careerSectionRef = useRef(null);

    // ============ CAREER EDIT LOCK STATES ============
    const [careerConfirmVisible, setCareerConfirmVisible] = useState(false);
    const [careerLockedVisible, setCareerLockedVisible] = useState(false);
    const [careerLockInfo, setCareerLockInfo] = useState({
        lastEditedAt: null,
        unlockAt: null,
        remaining: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    });

    useEffect(() => {
        message.config({
            top: 80,
            duration: 3,
            maxCount: 3,
            prefixCls: "ant-message",
        });
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setIsRevealed(true), 40);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (profile?.alumni) {
            transformProfileData(profile.alumni);
        } else if (profile) {
            transformProfileData(profile);
        }
    }, [profile]);

    const transformProfileData = (profileData) => {
        const enhancedProfile = {
            basicInfo: {
                name: profileData?.first_name || "Not provided",
                email: profileData.email || "Not provided",
                role: "alumni",
                status: profileData?.status || "pending",
                memberSince: profileData?.graduation_year,
                lastUpdated: profileData.updated_at
                    ? new Date(profileData.updated_at).toLocaleDateString()
                    : "N/A",
            },
            personalInfo: {
                firstName: profileData.first_name || "Not provided",
                lastName: profileData.last_name || "Not provided",
                middleName: profileData.middle_name || "Not provided",
                displayName:
                    profileData.first_name + " " + profileData.last_name ||
                    "Not provided",
                avatar: profileData.image || null,
                dateOfBirth:
                    (profileData === null || profileData === void 0
                        ? void 0
                        : profileData.birth_date) || "Not provided",
                gender:
                    (profileData === null || profileData === void 0
                        ? void 0
                        : profileData.gender) || "Not provided",
                nationality: "Filipino",
            },
            contactInfo: {
                email: profileData.email || "Not provided",
                phone: profileData.phone || "Not provided",
                alternatePhone: "Not provided",
                address: profileData.address || "Not provided",
                socialMedia: {
                    linkedin: "Not provided",
                    twitter: "Not provided",
                    facebook: "Not provided",
                },
            },
            professionalInfo: {
                currentCompany: profileData.current_company || "Not provided",
                jobTitle: profileData.job_title || "Not provided",
                industry: profileData.industry || "Not provided",
                yearsExperience: profileData.years_experience || "Not provided",
                salaryRange: profileData.salary_range || "Not provided",
                workLocation: profileData.work_location || "Not provided",
                previousCompanies: Array.isArray(profileData.previous_companies)
                    ? profileData.previous_companies
                    : [profileData.previous_companies || "Not provided"],
            },
            academicInfo: {
                studentId: profileData.student_id || "Not provided",
                admissionYear: profileData.enrollment_year || "Not provided",
                graduationYear: profileData.graduation_year || "Not provided",
                honors: Array.isArray(profileData.honors)
                    ? profileData.honors.join(", ")
                    : profileData.honors || "Not provided",
                thesisTitle: profileData.thesis_title || "Not provided",
                continueEducation: !!profileData.continue_education,
            },
            additionalInfo: {
                bio: profileData?.bio || "No biography provided yet.",
                academic_achievements:
                    profileData?.academic_achievements || "Not provided",
                extracurricular: profileData?.extracurricular || "Not provided",
                career_goals: profileData?.career_goals || "Not provided",
            },
        };

        setDetailedProfile(enhancedProfile);
    };

    // ============ CAREER LOCK HELPERS ============
    // ============ CAREER LOCK HELPERS ============
    const getCareerLockState = () => {
        const lastEdited = profile?.alumni?.career_last_edited_at;

        if (!lastEdited) {
            return { locked: false, lastEditedAt: null, unlockAt: null };
        }

        const lastEditedAt = moment(lastEdited);
        const unlockAt = lastEditedAt
            .clone()
            .add(CAREER_EDIT_LOCK_DAYS, "days");
        const locked = moment().isBefore(unlockAt);

        return { locked, lastEditedAt, unlockAt };
    };

    const computeRemaining = (unlockAt) => {
        const now = moment();
        const ms = Math.max(0, unlockAt.diff(now));
        const dur = moment.duration(ms);
        return {
            days: Math.floor(dur.asDays()),
            hours: dur.hours(),
            minutes: dur.minutes(),
            seconds: dur.seconds(),
        };
    };

    const handleCareerEditClick = () => {
        const { locked, lastEditedAt, unlockAt } = getCareerLockState();
        if (locked) {
            setCareerLockInfo({
                lastEditedAt,
                unlockAt,
                remaining: computeRemaining(unlockAt),
            });
            setCareerLockedVisible(true);
            return;
        }
        setCareerConfirmVisible(true);
    };

    const confirmEnterEditMode = () => {
        setCareerConfirmVisible(false);
        toggleEditMode();
        setTimeout(() => {
            careerSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 250);
    };
    // ============ END CAREER LOCK HELPERS ============

    const toggleEditMode = () => {
        if (!isEditMode) {
            setEditedValues({
                first_name: profile?.alumni?.first_name || "",
                last_name: profile?.alumni?.last_name || "",
                middle_name: profile?.alumni?.middle_name || "",
                suffix: profile?.alumni?.suffix || "",
                birth_date: profile?.alumni?.birth_date || "",
                gender: profile?.alumni?.gender || "",
                bio: profile?.alumni?.bio || "",
                email: profile?.alumni?.email || "",
                phone: profile?.alumni?.phone || "",
                address: profile?.alumni?.address || "",
                student_id: profile?.alumni?.student_id || "",
                graduation_year: profile?.alumni?.graduation_year || "",
                enrollment_year: profile?.alumni?.enrollment_year || "",
                honors: profile?.alumni?.honors || "",
                thesis_title: profile?.alumni?.thesis_title || "",
                continue_education:
                    profile?.alumni?.continue_education || false,
                current_company: profile?.alumni?.current_company || "",
                job_title: profile?.alumni?.job_title || "",
                industry: profile?.alumni?.industry || "",
                years_experience: profile?.alumni?.years_experience || "",
                salary_range: profile?.alumni?.salary_range || "",
                work_location: profile?.alumni?.work_location || "",
                previous_companies: profile?.alumni?.previous_companies || "",
            });
        }
        setIsEditMode(!isEditMode);
    };

    const handleFieldChange = (field, value) => {
        setEditedValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await axiosConfig.put(
                `/alumni/${profile?.alumni?.id}`,
                editedValues,
            );

            if (response.data?.success) {
                message.success({
                    content:
                        response.data.message ||
                        "Profile updated successfully!",
                });

                // Career lock timestamp is now stored in database

                await refetch();
                setIsEditMode(false);
            }
        } catch (error) {
            // axiosConfig interceptor will display modal automatically
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setEditedValues({});
        message.info({ content: "Edit cancelled" });
    };

    const handleEdit = () => {
        const values = profile.alumni;
        const previewData = {
            status: values.status,
            id: values.id,
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
            suffix: values.suffix,
            email: values.email,
            phone: values.phone,
            address: values.address,
            birth_date: values.birth_date,
            gender: values.gender,
            bio: values.bio,
            course_id: values.course_id,
            student_id: values.student_id,
            graduation_year: values.graduation_year,
            enrollment_year: values.enrollment_year,
            honors:
                typeof values.honors === "string" && values.honors.trim() !== ""
                    ? JSON.parse(values.honors)
                    : Array.isArray(values.honors)
                      ? values.honors
                      : [],
            thesis_title: values.thesis_title,
            academic_achievements: values.academic_achievements,
            extracurricular: values.extracurricular,
            continue_education: values.continue_education,
            employment_status_id: values.employment_status_id,
            current_company: values.current_company,
            job_title: values.job_title,
            industry: values.industry,
            years_experience: values.years_experience,
            salary_range: values.salary_range,
            work_location: values.work_location,
            career_goals: values.career_goals,
            previous_companies: values.previous_companies,
            linkedin: values.linkedin,
            github: values.github,
            portfolio: values.portfolio,
            twitter: values.twitter,
            newsletter: values.newsletter,
            contactPermission: values.contactPermission,
            agreement: values.agreement,
            profileImage: values?.profile_image_url,
            idDocuments: values?.documents || [],
        };

        setPreviewData(previewData);
        setViewOnly(false);
        setIsModalVisible(true);
    };

    const handleView = () => {
        const values = profile.alumni;
        const previewData = {
            status: values.status,
            id: values.id,
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
            suffix: values.suffix,
            email: values.email,
            phone: values.phone,
            address: values.address,
            birth_date: values.birth_date,
            gender: values.gender,
            bio: values.bio,
            course_id: values.course_id,
            student_id: values.student_id,
            graduation_year: values.graduation_year,
            enrollment_year: values.enrollment_year,
            honors:
                typeof values.honors === "string" && values.honors.trim() !== ""
                    ? JSON.parse(values.honors)
                    : Array.isArray(values.honors)
                      ? values.honors
                      : [],
            thesis_title: values.thesis_title,
            academic_achievements: values.academic_achievements,
            extracurricular: values.extracurricular,
            continue_education: values.continue_education,
            employment_status_id: values.employment_status_id,
            current_company: values.current_company,
            job_title: values.job_title,
            industry: values.industry,
            years_experience: values.years_experience,
            salary_range: values.salary_range,
            work_location: values.work_location,
            career_goals: values.career_goals,
            previous_companies: values.previous_companies,
            linkedin: values.linkedin,
            github: values.github,
            portfolio: values.portfolio,
            twitter: values.twitter,
            newsletter: values.newsletter,
            contactPermission: values.contactPermission,
            agreement: values.agreement,
            profileImage: values?.profile_image_url,
            idDocuments: values?.documents || [],
        };

        setPreviewData(previewData);
        setIsModalVisible(true);
    };

    return {
        profile,
        loading,
        refetch,
        previewData,
        isModalVisible,
        setIsModalVisible,
        detailedProfile,
        isEditMode,
        editedValues,
        saving,
        viewOnly,
        changePasswordVisible,
        setChangePasswordVisible,
        isRevealed,
        careerSectionRef,
        careerConfirmVisible,
        setCareerConfirmVisible,
        careerLockedVisible,
        setCareerLockedVisible,
        careerLockInfo,
        setCareerLockInfo,
        computeRemaining,
        handleCareerEditClick,
        confirmEnterEditMode,
        handleFieldChange,
        handleSave,
        handleCancel,
        handleView,
    };
}
