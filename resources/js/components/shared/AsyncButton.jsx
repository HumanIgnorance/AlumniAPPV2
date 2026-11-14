import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Button as AntButton } from "antd";
import { requestTracker } from "~/utils/requestTracker";

/**
 * Drop-in replacement for antd's <Button> that shows a loading spinner (and
 * blocks double-clicks) automatically while the action it started is running:
 *
 *  1. If `onClick` returns a Promise (async handler) → loading until it settles.
 *  2. Otherwise, if the click makes the app send a save request (POST / PUT /
 *     PATCH / DELETE through axiosConfig) within ARM_WINDOW_MS — typical for
 *     form submit buttons, Add / Save / Delete / Approve… → loading until
 *     that request finishes.
 *
 * Buttons that only open a modal, navigate, etc. never send a request, so they
 * never spin. An explicit `loading` prop always wins, and `noAutoLoading`
 * opts a button out. Everything else (props, ref, Button.Group) is antd's.
 */
const ARM_WINDOW_MS = 1500; // time allowed between click and request start
const CHAIN_GRACE_MS = 250; // a click may fire several requests in a row

const AsyncButton = forwardRef(function AsyncButton(
    { onClick, loading, noAutoLoading, href, htmlType, ...rest },
    ref
) {
    const [promiseBusy, setPromiseBusy] = useState(false);
    const [requestBusy, setRequestBusy] = useState(false);

    const mounted = useRef(true);
    const armedUntil = useRef(0);
    const myRequests = useRef(new Set());
    const graceTimer = useRef(null);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            clearTimeout(graceTimer.current);
        };
    }, []);

    useEffect(() => {
        if (noAutoLoading) return undefined;

        return requestTracker.subscribe((event) => {
            if (!mounted.current) return;

            if (event.type === "start") {
                if (Date.now() <= armedUntil.current) {
                    clearTimeout(graceTimer.current);
                    myRequests.current.add(event.id);
                    setRequestBusy(true);
                }
                return;
            }

            // "end"
            if (!myRequests.current.delete(event.id)) return;
            if (myRequests.current.size === 0) {
                // keep armed briefly so a chained 2nd request keeps the spinner
                armedUntil.current = Date.now() + CHAIN_GRACE_MS;
                clearTimeout(graceTimer.current);
                graceTimer.current = setTimeout(() => {
                    if (mounted.current && myRequests.current.size === 0) {
                        setRequestBusy(false);
                    }
                }, CHAIN_GRACE_MS);
            }
        });
    }, [noAutoLoading]);

    const handleClick = useCallback(
        (event) => {
            if (!noAutoLoading && !href && htmlType !== "reset") {
                armedUntil.current = Date.now() + ARM_WINDOW_MS;
            }

            const result = onClick ? onClick(event) : undefined;

            if (
                !noAutoLoading &&
                result &&
                typeof result.then === "function"
            ) {
                setPromiseBusy(true);
                const done = () => {
                    if (mounted.current) setPromiseBusy(false);
                };
                Promise.resolve(result).then(done, done);
            }

            return result;
        },
        [onClick, noAutoLoading, href, htmlType]
    );

    const isLoading =
        loading !== undefined && loading !== null
            ? loading
            : promiseBusy || requestBusy;

    return (
        <AntButton
            ref={ref}
            href={href}
            htmlType={htmlType}
            {...rest}
            loading={isLoading}
            onClick={onClick || !noAutoLoading ? handleClick : undefined}
            aria-busy={isLoading ? true : undefined}
        />
    );
});

AsyncButton.displayName = "AsyncButton";
AsyncButton.Group = AntButton.Group;
// antd's Tooltip / Space.Compact look for this flag to treat us as a Button.
AsyncButton.__ANT_BUTTON = true;

export default AsyncButton;
