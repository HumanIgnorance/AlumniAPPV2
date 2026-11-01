import { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { ROLES } from "~/config/roles";
import useObjectUrl from "~/hooks/useObjectUrl";
import { getUserRole } from "~/utils/session";

export default function useGalleryState() {
    // blob: preview URLs are cached per file and revoked on unmount (no leak per render)
    const urlFor = useObjectUrl();

    // State management
    const [galleries, setGalleries] = useState([]);

    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

    const [statistics, setStatistics] = useState({
        total_images: 0,
        total_size: "0 KB",
        this_month_uploads: 0,
    });

    // Modal states
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const [editModalVisible, setEditModalVisible] = useState(false);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [previewVisible, setPreviewVisible] = useState(false);

    const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);

    // Selected items
    const [selectedGallery, setSelectedGallery] = useState(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Selection mode for bulk download/delete
    const [selectionMode, setSelectionMode] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);

    // NEW: indexes of existing gallery images marked for removal during edit
    const [removedExistingIndexes, setRemovedExistingIndexes] = useState([]);

    // NEW: "view all" lightbox state (used by edit/delete +N badges)
    const [viewAllGallery, setViewAllGallery] = useState(null);

    const [viewAllVisible, setViewAllVisible] = useState(false);

    const [viewAllIndex, setViewAllIndex] = useState(0);

    // ===== Orientation tracking for the image-preview lightbox =====
    // rc-image (antd's Image.PreviewGroup) computes its initial "contain"
    // scale once, from the viewport size at the moment the preview mounts.
    // It does not reliably recompute that scale after a rotation, since
    // mobile browsers fire resize/orientationchange late or inconsistently.
    // Result: rotate to landscape while a portrait photo is open, and the
    // lightbox keeps the scale that fit the old (portrait) viewport, which
    // now overflows vertically — the photo looks zoomed in and cropped.
    // Fix: remount the PreviewGroup on orientation change (via `key` below)
    // so it recalculates fresh against the current viewport.
    const [previewOrientation, setPreviewOrientation] = useState(() =>
        typeof window !== "undefined" &&
        window.matchMedia("(orientation: landscape)").matches
            ? "landscape"
            : "portrait",
    );

    useEffect(() => {
        const mql = window.matchMedia("(orientation: landscape)");
        const handleOrientationChange = () =>
            setPreviewOrientation(mql.matches ? "landscape" : "portrait");
        if (mql.addEventListener) {
            mql.addEventListener("change", handleOrientationChange);
        } else {
            mql.addListener(handleOrientationChange);
        }
        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener("change", handleOrientationChange);
            } else {
                mql.removeListener(handleOrientationChange);
            }
        };
    }, []);

    // Filters
    const [searchText, setSearchText] = useState("");

    const [selectedYear, setSelectedYear] = useState(null);

    const [selectedMonth, setSelectedMonth] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const [pageSize, setPageSize] = useState(12);

    const [total, setTotal] = useState(0);

    // Form
    const [form] = Form.useForm();

    const [editForm] = Form.useForm();

    const [fileList, setFileList] = useState([]);

    // Event Date can't be set in the future — only today or earlier is selectable
    const disableFutureDates = (current) =>
        current && current > dayjs().endOf("day");

    // ===== Draft Auto-Save: internal flags =====
    // Suppress auto-save during programmatic restore so we don't immediately overwrite the loaded draft.
    const suppressAutoSaveRef = useRef(false);

    // Track whether we've already prompted the user to resume an unsaved draft this session.
    const resumeHandledRef = useRef(false);

    // Debounce timer for upload draft saving.
    const uploadSaveTimerRef = useRef(null);

    // Debounce timer for edit draft saving.
    const editSaveTimerRef = useRef(null);

    // User role
    const userRole = getUserRole();

    const isAdmin = userRole === ROLES.ADMIN;

    // Reveal animation flag (matches AboutPage / FaqPage pattern)
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 60);
        return () => clearTimeout(t);
    }, []);

    return {
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
        suppressAutoSaveRef,
        form,
        fileList,
        uploadSaveTimerRef,
        setFileList,
        selectedGallery,
        editForm,
        removedExistingIndexes,
        editSaveTimerRef,
        uploadModalVisible,
        editModalVisible,
        resumeHandledRef,
        setUploadModalVisible,
        setEditModalVisible,
        setRemovedExistingIndexes,
        setSelectedGallery,
        setUploading,
        setDeleteModalVisible,
        selectedImages,
        setBulkDeleteModalVisible,
        setSelectionMode,
        setSelectedImages,
        selectionMode,
        galleries,
        setCurrentImageIndex,
        setPreviewVisible,
        setSearchText,
        setSelectedYear,
        setSelectedMonth,
        setCurrentPage,
        isAdmin,
        statistics,
        loading,
        total,
        setPageSize,
        disableFutureDates,
        uploading,
        deleteModalVisible,
        bulkDeleteModalVisible,
        previewOrientation,
        previewVisible,
        currentImageIndex,
        viewAllGallery,
        viewAllVisible,
        viewAllIndex,
    };
}
