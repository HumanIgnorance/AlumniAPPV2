import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Input } from "antd";
import Button from "~/components/shared/AsyncButton";
import { MailOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "~/utils/axiosConfig";
import "./VerifyEmailPanel.css";

const RESEND_COOLDOWN_SECONDS = 60;

export const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email || "";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `${local[0] || ""}*@${domain}`;
    return `${local[0]}${"*".repeat(Math.min(local.length - 2, 6))}${local[local.length - 1]}@${domain}`;
};

/**
 * Verify-your-email panel shared by the registration success pop-up and the
 * login screen. The alumnus types the 6-digit code from the email (the email
 * also has a link, which works without this panel). Public endpoints, so no
 * sign-in is needed. All requests are `silent`: errors are shown inline here.
 *
 *   email         address the code was sent to
 *   initialSent   true when an email was just sent (starts the resend cooldown)
 *   onVerified()  called once the server confirms the address
 */
export default function VerifyEmailPanel({ email, initialSent = false, onVerified }) {
    const [code, setCode] = useState("");
    const [busy, setBusy] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [cooldown, setCooldown] = useState(initialSent ? RESEND_COOLDOWN_SECONDS : 0);
    const submitted = useRef("");

    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const verify = useCallback(
        async (value) => {
            if (busy || value.length !== 6 || submitted.current === value) return;
            submitted.current = value;
            setBusy(true);
            setError("");
            setInfo("");
            try {
                await axios.post("email/verify-code", { email, code: value }, { silent: true });
                onVerified && onVerified();
            } catch (e) {
                const status = e?.response?.status;
                setError(
                    status === 429
                        ? "Too many attempts. Please wait a minute and try again."
                        : e?.response?.data?.message ||
                              e?.response?.data?.errors?.code?.[0] ||
                              "Could not verify the code. Please try again.",
                );
                setCode("");
                submitted.current = "";
            } finally {
                setBusy(false);
            }
        },
        [busy, email, onVerified],
    );

    const resend = async () => {
        if (sending || cooldown > 0) return;
        setSending(true);
        setError("");
        setInfo("");
        try {
            const { data } = await axios.post("email/resend", { email }, { silent: true });
            setInfo(data?.message || "A new email is on its way.");
            setCooldown(RESEND_COOLDOWN_SECONDS);
            setCode("");
            submitted.current = "";
        } catch (e) {
            setError(
                e?.response?.status === 429
                    ? "Too many requests. Please wait a minute and try again."
                    : "Could not send the email. Please try again.",
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="vep">
            <div className="vep__icon" aria-hidden="true">
                <MailOutlined />
            </div>
            <p className="vep__lead">
                We sent a 6-digit code to <strong>{maskEmail(email)}</strong>. Enter it below, or open the link in that
                email. The code expires in 60 minutes.
            </p>

            <Input.OTP
                length={6}
                value={code}
                onChange={(v) => {
                    setCode(v);
                    if (v.length === 6) verify(v);
                }}
                disabled={busy}
                inputMode="numeric"
                size="large"
                className="vep__otp"
                autoFocus
            />

            {error && <Alert className="vep__alert" type="error" showIcon message={error} />}
            {info && <Alert className="vep__alert" type="success" showIcon message={info} />}

            <Button
                type="primary"
                size="large"
                block
                loading={busy}
                disabled={code.length !== 6}
                onClick={() => verify(code)}
            >
                Verify email
            </Button>

            <Button
                type="link"
                icon={<ReloadOutlined />}
                loading={sending}
                disabled={cooldown > 0}
                onClick={resend}
                className="vep__resend"
            >
                {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend email"}
            </Button>
            <p className="vep__hint">Can't find it? Check your spam or junk folder.</p>
        </div>
    );
}
