import { useMemo } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { toSameOriginUrl } from "~/utils/assetUrl";

/**
 * Avatar for an alumnus/alumna photo.
 *  - normalises protected /api/ image URLs onto the page origin (see assetUrl)
 *  - if the photo is missing or fails to load, shows the person's initial
 *    (or a user icon when there is no name) instead of a broken image.
 */
export default function AlumniAvatar({ src, name, icon, ...rest }) {
    const resolved = useMemo(() => toSameOriginUrl(src) || undefined, [src]);
    const initial = String(name || "").trim().charAt(0).toUpperCase();

    return (
        <Avatar
            src={resolved}
            // antd prefers `icon` over children, so only pass it when there
            // is no initial to show.
            icon={initial ? undefined : icon || <UserOutlined />}
            {...rest}
        >
            {initial}
        </Avatar>
    );
}
