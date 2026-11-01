import secureLocalStorage from "react-secure-storage";

// Constants for image limits
export const MAX_IMAGES_PER_UPLOAD = 50;

// ===== Draft Auto-Save: storage keys & helpers (additive, non-breaking) =====
export const GALLERY_UPLOAD_DRAFT_KEY = "alumni-gallery-upload-draft";

export const GALLERY_EDIT_DRAFT_KEY = "alumni-gallery-edit-draft";

// Convert a File/Blob to a base64 data URL so staged images persist across reloads.
export const fileToDataUrl = (file) =>
    new Promise((resolve) => {
        try {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        } catch (e) {
            resolve(null);
        }
    });

// Convert a base64 data URL back into a File so it can be re-uploaded.
export const dataUrlToFile = (dataUrl, filename, mime) => {
    try {
        const arr = dataUrl.split(",");
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8 = new Uint8Array(n);
        while (n--) u8[n] = bstr.charCodeAt(n);
        return new File([u8], filename, {
            type: mime || arr[0].match(/:(.*?);/)?.[1] || "image/jpeg",
        });
    } catch (e) {
        return null;
    }
};

export const safeGetDraft = (key) => {
    try {
        return secureLocalStorage.getItem(key) || null;
    } catch (e) {
        return null;
    }
};

export const safeSetDraft = (key, value) => {
    try {
        secureLocalStorage.setItem(key, value);
    } catch (e) {
        /* quota or serialize error */
    }
};

export const safeClearDraft = (key) => {
    try {
        secureLocalStorage.removeItem(key);
    } catch (e) {}
};
