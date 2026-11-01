import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import useProfile from "~/hooks/useProfile";

export default function useLayoutBase() {
    const queryClient = useQueryClient();

    const { data: profile, loading, refetch } = useProfile();

    const { pathname } = useLocation();

    const history = useHistory();

    const basePath = "/" + pathname.split("/").filter(Boolean)[0];

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [accountDropdownVisible, setAccountDropdownVisible] = useState(false);

    const [helpSupportExpanded, setHelpSupportExpanded] = useState(false);

    useEffect(() => {
        if (!accountDropdownVisible) setHelpSupportExpanded(false);
    }, [accountDropdownVisible]);

    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

    const [alumniQuizzes, setQuizzes] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (
            Array.isArray(profile?.alumni_quizzes) &&
            profile?.alumni_quizzes?.length !== 2
        ) {
            setQuizzes(profile?.alumni_quizzes);
            setModalVisible(true);
        }
    }, [profile]);

    return {
        pathname,
        profile,
        setIsLoading,
        queryClient,
        history,
        setDropdownVisible,
        isLoading,
        setAccountDropdownVisible,
        setHelpSupportExpanded,
        helpSupportExpanded,
        setIsPrivacyModalOpen,
        setIsTermsModalOpen,
        basePath,
        dropdownVisible,
        accountDropdownVisible,
        refetch,
        modalVisible,
        setModalVisible,
        alumniQuizzes,
        isPrivacyModalOpen,
        isTermsModalOpen,
    };
}
