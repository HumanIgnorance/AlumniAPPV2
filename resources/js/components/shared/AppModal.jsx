import React, { useMemo } from "react";
import { Modal as AntModal } from "antd";

/**
 * The ONE modal used everywhere in the app (drop-in for antd's <Modal>).
 *
 * Every dialog gets the same look and behaviour from css/app-modal.css:
 *   • desktop / tablet / landscape: centred card, fixed header + footer,
 *     only the body scrolls, no dead space;
 *   • phones (≤ 575px, PWA or browser): a bottom sheet with a drag-handle,
 *     safe-area aware (notch / home-indicator), full-width footer buttons;
 *   • confirm / info / success / error / warning dialogs: compact centred card.
 *
 * Usage is unchanged:  <Modal open title="…" onCancel={…} footer={…}>…</Modal>
 * Statics are wrapped too: Modal.confirm(...), Modal.useModal(), etc.
 */
const cx = (...parts) => parts.filter(Boolean).join(" ");

const withDefaults = (props, extra = "") => ({
    ...props,
    // one layout for every dialog — never top-aligned with a magic offset
    centered: true,
    className: cx("app-modal", extra, props.className),
    wrapClassName: cx("app-modal-wrap", props.wrapClassName),
    rootClassName: cx("app-modal-root", props.rootClassName),
});

const confirmDefaults = (config = {}) => withDefaults(config, "app-modal-confirm");

function AppModal(props) {
    return <AntModal {...withDefaults(props)} />;
}

["confirm", "info", "success", "error", "warning"].forEach((method) => {
    AppModal[method] = (config) => AntModal[method](confirmDefaults(config));
});

AppModal.useModal = () => {
    const [modal, contextHolder] = AntModal.useModal();
    const wrapped = useMemo(() => {
        const api = {};
        ["confirm", "info", "success", "error", "warning"].forEach((method) => {
            api[method] = (config) => modal[method](confirmDefaults(config));
        });
        return api;
    }, [modal]);
    return [wrapped, contextHolder];
};

AppModal.destroyAll = AntModal.destroyAll;
AppModal.config = AntModal.config;

export default AppModal;
