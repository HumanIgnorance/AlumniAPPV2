import { useCallback, useEffect } from "react";
import { message } from "antd";
import axiosConfig from "~/utils/axiosConfig";

export default function useGalleryData({
    setLoading,
    currentPage,
    pageSize,
    searchText,
    selectedYear,
    selectedMonth,
    setGalleries,
    setTotal,
    setStatistics,
    urlFor,
    setViewAllGallery,
    setViewAllIndex,
    setViewAllVisible,
}) {
    // Fetch galleries - now handles multiple images per gallery
    const fetchGalleries = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                per_page: pageSize,
            };
            if (searchText) params.search = searchText;
            if (selectedYear) params.year = selectedYear;
            if (selectedMonth) params.month = selectedMonth;

            const response = await axiosConfig.get("/galleries", { params });
            if (response.data.success) {
                setGalleries(response.data.data.data || []);
                setTotal(response.data.data.total || 0);
            }
        } catch (error) {
            console.error("Error fetching galleries:", error);
            message.error("Failed to load gallery images");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchText, selectedYear, selectedMonth]);

    // Fetch statistics
    const fetchStatistics = useCallback(async () => {
        try {
            const response = await axiosConfig.get("/galleries/statistics");
            if (response.data.success) {
                setStatistics(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    }, []);

    useEffect(() => {
        fetchGalleries();
        fetchStatistics();
    }, [fetchGalleries, fetchStatistics]);

    // Helper function to get images array from gallery
    const getGalleryImages = (gallery) => {
        if (
            gallery.image_urls &&
            Array.isArray(gallery.image_urls) &&
            gallery.image_urls.length > 0
        ) {
            return gallery.image_urls;
        }
        if (gallery.image_url) {
            return [gallery.image_url];
        }
        return [];
    };

    // Get image count for a gallery
    const getImageCount = (gallery) => {
        return getGalleryImages(gallery).length;
    };

    // NEW: build object URL for a not-yet-uploaded file
    const getFileThumbUrl = (file) => {
        if (file.url) return file.url;
        if (file.thumbUrl) return file.thumbUrl;
        if (file.originFileObj) {
            return urlFor(file.originFileObj);
        }
        return "";
    };

    // NEW: open view-all lightbox for arbitrary image list
    const openViewAll = (gallery, imagesOverride = null, startIndex = 0) => {
        setViewAllGallery({
            ...gallery,
            _filteredImages: imagesOverride || getGalleryImages(gallery),
        });
        setViewAllIndex(startIndex);
        setViewAllVisible(true);
    };

    return {
        fetchGalleries,
        fetchStatistics,
        getGalleryImages,
        getFileThumbUrl,
        openViewAll,
        getImageCount,
    };
}
