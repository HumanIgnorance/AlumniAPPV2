import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the Gallery page.
const GalleryContext = createContext(null);

export const GalleryProvider = GalleryContext.Provider;

export function useGalleryContext() {
    const ctx = useContext(GalleryContext);
    if (!ctx)
        throw new Error("useGalleryContext must be used inside <Gallery>");
    return ctx;
}
