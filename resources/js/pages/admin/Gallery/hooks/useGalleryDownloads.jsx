import { DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import axiosConfig from "~/utils/axiosConfig";

export default function useGalleryDownloads({
    getGalleryImages,
    setSelectionMode,
    selectionMode,
    setSelectedImages,
    galleries,
    selectedImages,
}) {
    // Download single image
    const handleDownload = async (gallery, imageIndex = 0) => {
        try {
            message.loading({
                content: "Preparing download...",
                key: "download",
            });
            const response = await axiosConfig.get(
                `/galleries/${gallery.id}/download`,
                {
                    responseType: "blob",
                    params: { index: imageIndex },
                },
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                gallery.original_name ||
                    `${gallery.title}-${imageIndex + 1}.${gallery.file_type || "jpg"}`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            message.success({ content: "Download started!", key: "download" });
        } catch (error) {
            console.error("Download error:", error);
            message.error({
                content: "Failed to download image",
                key: "download",
            });
        }
    };

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

    const doDownloadGallery = async (gallery) => {
        const images = getGalleryImages(gallery);
        if (images.length === 0) {
            message.warning("No images to download");
            return;
        }

        message.loading({
            content: `Downloading ${images.length} image(s)...`,
            key: "download-gallery",
            duration: 0,
        });

        let successCount = 0;
        for (let i = 0; i < images.length; i++) {
            try {
                const response = await axiosConfig.get(
                    `/galleries/${gallery.id}/download`,
                    {
                        responseType: "blob",
                        params: { index: i },
                    },
                );

                const url = window.URL.createObjectURL(
                    new Blob([response.data]),
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    `${gallery.title}-${i + 1}.${gallery.file_type || "jpg"}`,
                );
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                successCount++;
                await new Promise((resolve) => setTimeout(resolve, 300));
            } catch (error) {
                console.error("Download error for image:", i, error);
            }
        }

        message.success({
            content: `Downloaded ${successCount} image(s)!`,
            key: "download-gallery",
        });
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

        message.loading({
            content: `Downloading selected galleries...`,
            key: "bulk-download",
            duration: 0,
        });

        let successCount = 0;
        for (const galleryId of selectedImages) {
            const gallery = galleries.find((g) => g.id === galleryId);
            if (!gallery) continue;

            const images = getGalleryImages(gallery);
            for (let i = 0; i < images.length; i++) {
                try {
                    const response = await axiosConfig.get(
                        `/galleries/${galleryId}/download`,
                        {
                            responseType: "blob",
                            params: { index: i },
                        },
                    );

                    const url = window.URL.createObjectURL(
                        new Blob([response.data]),
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        `${gallery.title}-${i + 1}.${gallery.file_type || "jpg"}`,
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    successCount++;
                    await new Promise((resolve) => setTimeout(resolve, 200));
                } catch (error) {
                    console.error("Download error:", error);
                }
            }
        }

        message.success({
            content: `Downloaded ${successCount} image(s)!`,
            key: "bulk-download",
        });
        setSelectionMode(false);
        setSelectedImages([]);
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
