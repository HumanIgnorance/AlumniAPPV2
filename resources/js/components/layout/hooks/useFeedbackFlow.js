import { useState } from "react";
import { useSubmitAtmsFeedback } from "~/hooks/useAtmsFeedback";

export default function useFeedbackFlow() {
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const [discardModalOpen, setDiscardModalOpen] = useState(false);

    // "View admin note" modal, opened from a resolved/dismissed feedback
    // notification in the bell.
    const [feedbackDetailModalVisible, setFeedbackDetailModalVisible] =
        useState(false);

    const [selectedFeedbackReport, setSelectedFeedbackReport] = useState(null);

    const [feedbackDetailLoading, setFeedbackDetailLoading] = useState(false);

    // Feedback flow state
    const [feedbackStep2Open, setFeedbackStep2Open] = useState(false);

    const [feedbackStep3Open, setFeedbackStep3Open] = useState(false);

    const [feedbackOption, setFeedbackOption] = useState(null);

    const [feedbackArea, setFeedbackArea] = useState(undefined);

    const [feedbackDetails, setFeedbackDetails] = useState("");

    const [feedbackScreenshots, setFeedbackScreenshots] = useState([]);

    const submitAtmsFeedback = useSubmitAtmsFeedback();

    const resetFeedbackForm = () => {
        setFeedbackArea(undefined);
        setFeedbackDetails("");
        setFeedbackScreenshots([]);
        setFeedbackOption(null);
    };

    const closeAllFeedback = () => {
        setFeedbackStep3Open(false);
        setFeedbackStep2Open(false);
        setFeedbackModalOpen(false);
        resetFeedbackForm();
    };

    return {
        setFeedbackDetailLoading,
        setFeedbackDetailModalVisible,
        setSelectedFeedbackReport,
        selectedFeedbackReport,
        feedbackDetailModalVisible,
        feedbackDetailLoading,
        setFeedbackModalOpen,
        discardModalOpen,
        setDiscardModalOpen,
        closeAllFeedback,
        feedbackModalOpen,
        setFeedbackOption,
        setFeedbackStep2Open,
        feedbackStep2Open,
        setFeedbackStep3Open,
        feedbackStep3Open,
        feedbackOption,
        feedbackArea,
        setFeedbackArea,
        feedbackDetails,
        setFeedbackDetails,
        feedbackScreenshots,
        setFeedbackScreenshots,
        submitAtmsFeedback,
    };
}
