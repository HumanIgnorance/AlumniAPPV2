

// ===== Draft Auto-Save: storage key & helpers (additive, non-breaking) =====
export const EVENT_DRAFT_STORAGE_KEY = "alumni-event-draft";

// Convert a File/Blob to a base64 data URL so banners/posters persist across reloads.
export const draftFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        } catch (err) {
            reject(err);
        }
    });

// Rebuild a File object from a stored base64 data URL (so it can still be uploaded).
export const draftDataURLtoFile = (dataUrl, fileName) => {
    try {
        const arr = dataUrl.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName || "draft-image.png", { type: mime });
    } catch (err) {
        console.error("Failed to rebuild draft file:", err);
        return null;
    }
};
