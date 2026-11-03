import "antd-css-utilities/utility.min.css";
import { ConfigProvider, Empty, Spin } from "antd";
import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./assets/scss/app.scss";
import NoLayout from "./components/NoLayout";
import { useLoader } from "./components/shared/Loader";

import {
    adminRoutes,
    authRoutes,
    noLayoutRoutes,
    alumniRoutes,
    Pages404,
    Pages402,
} from "./routes";
import { getAntdTheme } from "~/config/antdTheme";
import { useAppTheme } from "~/hooks/useAppTheme";
import "~/utils/pwaInstall"; // start listening for the browser's install event before React mounts
import { registerServiceWorker } from "~/utils/registerServiceWorker";
import InstallPrompt from "~/components/shared/InstallPrompt";
import OfflineNotice from "~/components/shared/OfflineNotice";
import UpdateNotice from "~/components/shared/UpdateNotice";

// Offline app shell + update flow (public/sw.js). Registering never asks for permission.
registerServiceWorker();

const NonAuthmiddleware = ({
    component: Component,
    layout: Layout,
    ...rest
}) => (
    <Route
        {...rest}
        render={(props) => {
            const LayoutToUse = Layout || NoLayout; // Default to NoLayout if no layout is provided
            return (
                <LayoutToUse>
                    <Component {...props} />
                </LayoutToUse>
            );
        }}
    />
);

// Themed by css/tokens.css (entry bundle), so it is correct in dark mode even
// while page chunks and their CSS are still loading.
const PageFallback = () => (
    <div className="app-page-fallback" role="status" aria-label="Loading">
        <Spin size="large" />
    </div>
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function Main() {
    useLoader();
    const { theme: appTheme } = useAppTheme();
    const antdTheme = getAntdTheme(appTheme);

    // Static helpers (message.loading, notification, Modal.confirm) live
    // outside <ConfigProvider>, so give them the same theme.
    useEffect(() => {
        ConfigProvider.config({ theme: antdTheme });
    }, [appTheme]);

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={antdTheme}
                renderEmpty={() => <Empty description="No Data" />}
            >
                <Router>
                    {/* App-like extras shared with the SCLF app: offline banner,
                        "new version" pop-up and the install-to-home-screen banner. */}
                    <OfflineNotice />
                    <UpdateNotice />
                    <InstallPrompt />
                    {/* Pages are lazy-loaded (see routes/lazyPages.js) */}
                    <Suspense fallback={<PageFallback />}>
                    <Switch>
                        {/* Auth Routes */}
                        {authRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={route.layout || NoLayout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}

                        {/* Admin Routes */}
                        {adminRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={route.layout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}
                        {alumniRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={route.layout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}

                        {/* Routes with no layout */}
                        {noLayoutRoutes.map((route, idx) => (
                            <NonAuthmiddleware
                                path={route.path}
                                layout={route.layout || NoLayout}
                                component={route.component}
                                key={idx}
                                exact
                            />
                        ))}

                        {/* Catch-all 404 Page */}
                        <Route component={Pages404} />
                        <Route component={Pages402} />
                    </Switch>
                    </Suspense>
                </Router>
            </ConfigProvider>
        </QueryClientProvider>
    );
}

export default Main;

if (document.getElementById("app")) {
    ReactDOM.render(<Main />, document.getElementById("app"));
}
