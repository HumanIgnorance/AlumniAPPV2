import { useMemo } from "react";
import { Upload, message } from "antd";
import { MAX_IMAGES_PER_UPLOAD } from "~/pages/admin/Gallery/galleryHelpers";

export default function useGalleryView({
    setSelectedGallery,
    setCurrentImageIndex,
    setPreviewVisible,
    fileList,
    setFileList,
    setSearchText,
    setSelectedYear,
    setSelectedMonth,
    setCurrentPage,
    selectedGallery,
    getGalleryImages,
    removedExistingIndexes,
    searchText,
    selectedYear,
    selectedMonth,
}) {
    // Open the antd preview (with built-in zoom in/out, rotate)
    const openPreview = (gallery, imageIndex = 0) => {
        setSelectedGallery(gallery);
        setCurrentImageIndex(imageIndex);
        setPreviewVisible(true);
    };

    const closePreview = () => {
        setPreviewVisible(false);
    };

    // Upload props
    const uploadProps = {
        name: "images",
        multiple: true,
        fileList,
        showUploadList: false, // we render our own thumbnails with view + remove
        beforeUpload: (file) => {
            const isValidType = [
                "image/png",
                "image/jpeg",
                "image/jpg",
            ].includes(file.type);
            if (!isValidType) {
                message.error("Only PNG, JPG, and JPEG files are allowed!");
                return Upload.LIST_IGNORE;
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error("Each image must be smaller than 10MB!");
                return Upload.LIST_IGNORE;
            }
            return false;
        },
        onChange: ({ fileList: newFileList }) => {
            if (newFileList.length > MAX_IMAGES_PER_UPLOAD) {
                message.warning(
                    `You can only upload up to ${MAX_IMAGES_PER_UPLOAD} images at a time`,
                );
                setFileList(newFileList.slice(0, MAX_IMAGES_PER_UPLOAD));
            } else {
                setFileList(newFileList);
            }
        },
        onRemove: (file) => {
            setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
        },
    };

    // Generate year options
    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 10; i--) {
            years.push(i);
        }
        return years;
    }, []);

    // Month options
    const monthOptions = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    // Clear filters
    const clearFilters = () => {
        setSearchText("");
        setSelectedYear(null);
        setSelectedMonth(null);
        setCurrentPage(1);
    };

    // Current preview gallery's images (memoized)
    const previewImages = useMemo(
        () => (selectedGallery ? getGalleryImages(selectedGallery) : []),
        [selectedGallery],
    );

    // NEW: images of selectedGallery that are NOT removed (for edit modal preview)
    const remainingExistingImages = useMemo(() => {
        if (!selectedGallery) return [];
        const all = getGalleryImages(selectedGallery);
        return all
            .map((url, idx) => ({ url, idx }))
            .filter(({ idx }) => !removedExistingIndexes.includes(idx));
    }, [selectedGallery, removedExistingIndexes]);

    const hasActiveFilters = !!(searchText || selectedYear || selectedMonth);

    // NEW: compact dragger inline style (used in both upload + edit modals)
    const compactDraggerStyle = {
        padding: "10px 12px",
        minHeight: 0,
    };

    return {
        yearOptions,
        monthOptions,
        clearFilters,
        hasActiveFilters,
        openPreview,
        uploadProps,
        compactDraggerStyle,
        remainingExistingImages,
        closePreview,
        previewImages,
    };
}
