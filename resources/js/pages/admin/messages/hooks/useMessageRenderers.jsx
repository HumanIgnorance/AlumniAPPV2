export default function useMessageRenderers({
    getImageUrl,
    openLightbox,
    inlineEditMessageId,
    inlineEditRef,
    inlineEditText,
    setInlineEditText,
    handleInlineEditKeyDown,
    inlineEditLoading,
    cancelInlineEdit,
    saveInlineEdit,
}) {
    // ============================
    // RENDER MESSAGE IMAGE COMPONENT
    // ============================

    const renderMessageImage = (
        imagePath,
        isOptimistic = false,
        imageUrlField = null,
    ) => {
        if (!imagePath && !imageUrlField) return null;

        // Message images live on the private disk — the backend now
        // sends a ready-to-use, authorized `image_url` alongside the
        // raw `image_path`. Prefer that; getImageUrl()'s storage/-path
        // reconstruction is only a fallback for optimistic/legacy values.
        const imageUrl = isOptimistic
            ? imagePath
            : imageUrlField || getImageUrl(imagePath);

        return (
            <div
                className="message-image-container"
                onClick={() =>
                    !isOptimistic && openLightbox(imageUrlField || imagePath)
                }
            >
                <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Shared image"
                    className="message-image"
                    onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                        }
                    }}
                    onLoad={(e) => {
                        e.target.style.display = "block";
                        if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "none";
                        }
                    }}
                />
                <div className="message-image-error">
                    <span className="error-icon">🖼️</span>
                    <span className="error-text">Image unavailable</span>
                </div>
                <div className="image-overlay">
                    <span className="zoom-icon">🔍</span>
                </div>
            </div>
        );
    };

    // ============================
    // RENDER INLINE EDIT INPUT (NEW - Messenger style)
    // ============================

    const renderInlineEditInput = (msg) => {
        if (inlineEditMessageId !== msg.id) return null;

        return (
            <div className="inline-edit-container">
                <textarea
                    ref={inlineEditRef}
                    className="inline-edit-input"
                    value={inlineEditText}
                    onChange={(e) => setInlineEditText(e.target.value)}
                    onKeyDown={handleInlineEditKeyDown}
                    disabled={inlineEditLoading}
                    rows={1}
                    autoFocus
                />
                <div className="inline-edit-actions">
                    <button
                        className="inline-edit-btn cancel"
                        onClick={cancelInlineEdit}
                        disabled={inlineEditLoading}
                        title="Cancel (Esc)"
                    >
                        ✕
                    </button>
                    <button
                        className="inline-edit-btn save"
                        onClick={saveInlineEdit}
                        disabled={inlineEditLoading || !inlineEditText.trim()}
                        title="Save (Enter)"
                    >
                        {inlineEditLoading ? "..." : "✓"}
                    </button>
                </div>
                <span className="inline-edit-hint">
                    Press Enter to save, Esc to cancel
                </span>
            </div>
        );
    };

    return { renderMessageImage, renderInlineEditInput };
}
