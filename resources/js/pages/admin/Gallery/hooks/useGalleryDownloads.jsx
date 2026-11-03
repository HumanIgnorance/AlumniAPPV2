import { DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { saveImages } from "~/utils/saveImage";
import { BASE_URL } from "~/utils/constant";

export default function useGalleryDownloads({
    getGalleryImages,
    setSelectionMode,
    selectionMode,
    setSelectedImages,
    galleries,
    selectedImages,
}) {
    const downloadItem = (gallery, i) => ({
        url: `${BASE_URL}api/galleries/${gallery.id}/download?index=${i}`,
        filename: `${gallery.title || "photo"}-${i + 1}`,
    });

    // Download single image
    const handleDownload = (gallery, imageIndex = 0) =>
        saveImages([downloadItem(gallery, imageIndex)]);

    // Download all images from a gallery (with confirmation)
    const handleDownloadGallery = (gallery) => {
        const images = getGalleryImages(gallery);
        if (images.length === 0) {
            message.warning("No images to download");
            return;
        }
        Modal.confirm({
            title: "Download all photos?",
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to download all ${images.length} photo(s) from "${gallery.title}"?`,
            okText: "Yes, download all",
            cancelText: "No",
            okButtonProps: { icon: <DownloadOutlined /> },
            onOk: () => doDownloadGallery(gallery),
        });
    };

    const doDownloadGallery = (gallery) => {
        const images = getGalleryImages(gallery);
        return saveImages(images.map((_, i) => downloadItem(gallery, i)));
    };

    // Toggle selection mode
    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedImages([]);
    };

    // Toggle image selection
    const toggleImageSelection = (galleryId) => {
        setSelectedImages((prev) => {
            if (prev.includes(galleryId)) {
                return prev.filter((id) => id !== galleryId);
            } else {
                return [...prev, galleryId];
            }
        });
    };

    // Select all visible galleries
    const selectAllImages = () => {
        setSelectedImages(galleries.map((g) => g.id));
    };

    // Deselect all
    const deselectAllImages = () => {
        setSelectedImages([]);
    };

    // Download selected galleries (with confirmation)
    const handleDownloadSelected = () => {
        if (selectedImages.length === 0) {
            message.warning("Please select at least one gallery to download");
            return;
        }
        Modal.confirm({
            title: "Download selected photos?",
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to download all photos from ${selectedImages.length} selected gallery(ies)?`,
            okText: "Yes, download all",
            cancelText: "No",
            okButtonProps: { icon: <DownloadOutlined /> },
            onOk: () => doDownloadSelected(),
        });
    };

    const doDownloadSelected = async () => {
        if (selectedImages.length === 0) {
            message.warning("Please select at least one gallery to download");
            return;
        }

        const items = [];
        for (const galleryId of selectedImages) {
            const gallery = galleries.find((g) => g.id === galleryId);
            if (!gallery) continue;
            getGalleryImages(gallery).forEach((_, i) =>
                items.push(downloadItem(gallery, i)),
            );
        }

        const result = await saveImages(items);
        if (result.status !== "failed") {
            setSelectionMode(false);
            setSelectedImages([]);
        }
    };

    return {
        toggleSelectionMode,
        selectAllImages,
        deselectAllImages,
        handleDownloadSelected,
        toggleImageSelection,
        handleDownloadGallery,
        handleDownload,
    };
}
