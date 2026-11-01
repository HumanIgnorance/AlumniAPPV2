import { message } from "antd";
import { BASE_URL } from "~/utils/constant";

export default function useMessageMedia({
    messagesEndRef,
    imageInputRef,
    setSelectedImage,
    setImagePreview,
    setLightboxImage,
}) {
    // ============================
    // HELPER FUNCTION FOR IMAGE URL
    // ============================

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;

        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://") ||
            imagePath.startsWith("blob:") ||
            imagePath.startsWith("data:")
        ) {
            return imagePath;
        }

        const cleanPath = imagePath
            .replace(/^public\//, "")
            .replace(/^storage\//, "")
            .replace(/^\/+/, "");

        return `${BASE_URL}storage/${cleanPath}`;
    };

    // ============================
    // COMMON FUNCTIONS
    // ============================

    const isLandscapeMobile = () =>
        window.innerWidth <= 992 && window.screen.orientation
            ? window.screen.orientation.type.startsWith("landscape")
            : window.innerWidth > window.innerHeight;

    const scrollToBottom = () => {
        // Skip auto-scroll in landscape on mobile — the viewport is too short
        // and scrollIntoView jumps the whole page instead of staying inside the message area.
        if (isLandscapeMobile()) return;
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }
    };

    // ============================
    // IMAGE FUNCTIONS WITH VALIDATION
    // ============================

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/jpg";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG files!");
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error("Image must be smaller than 5MB!");
            return false;
        }
        return true;
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!beforeUpload(file)) {
                if (imageInputRef.current) imageInputRef.current.value = "";
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const clearImagePreview = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const openLightbox = (imagePath) => {
        setLightboxImage(getImageUrl(imagePath));
    };

    const closeLightbox = () => {
        setLightboxImage(null);
    };

    return {
        clearImagePreview,
        getImageUrl,
        scrollToBottom,
        openLightbox,
        handleImageSelect,
        closeLightbox,
    };
}
