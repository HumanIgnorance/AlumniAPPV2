
// const { Text } = Typography;

// class Pages402 extends Component {
//     constructor() {
//         super();
//         this.state = {};
//     }

//     render() {
//         const role = secureLocalStorage.getItem("userRole");

//         let redirectLink = "/alumni";
//         if (role === "admin") redirectLink = "/admin-dashboard";
//         else if (role === "department_head") redirectLink = "/department-dashboard";
//         else if (role === "alumni") redirectLink = "/alumni";

//         const currentTheme = secureLocalStorage.getItem("theme"); // get the current theme from storage
//         const subtitleColor = currentTheme === "black" ? "#ffffff" : undefined;

//         return (
//             <Layout>
//                 <div
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100vh',
                    
//                   }}
//                 >
//                     <Result
//                         status="404"
//                         title="404"
//                         subTitle={
//                           <Text style={{ color: subtitleColor }}>
//                             Sorry, the page you visited is Under Construction😂.
//                           </Text>
//                         }
//                         extra={
//                           <Link to={redirectLink}>
//                             <Button type="primary">Go Back</Button>
//                           </Link>
//                         }
//                     />
//                 </div>
//             </Layout>
//         );
//     }
// }

// export default Pages402;

import React from "react";
import { Result, Button, Typography } from "antd";
import { Layout } from "~/components";
import { Link } from "react-router-dom";
import { useAppTheme } from "~/hooks/useAppTheme";
import { COLORS } from "~/config/theme";
import { ROLES } from "~/config/roles";
import { getUserRole } from "~/utils/session";

const { Text } = Typography;

const Pages402 = () => {
    // ============ THEME SYNC ============
    // Shared hook — same source of truth as FormLogin.js, so the
    // theme stays in sync (BroadcastChannel + cookie + secureLocalStorage)
    // across tabs and pages instead of this page tracking its own copy.
    const { theme: currentTheme } = useAppTheme();

    const isDark = currentTheme === "black";

    const role = getUserRole();

    let redirectLink = "/alumni";

    if (role === ROLES.ADMIN) {
        redirectLink = "/home";
    } else if (role === ROLES.DEPARTMENT_HEAD) {
        redirectLink = "/department-dashboard";
    } else if (role === ROLES.ALUMNI) {
        redirectLink = "/home";
    }

    return (
        <Layout>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                      <Result
                       status="404"
                       title={
                           <span
                               style={{
                                   color: isDark ? COLORS.white : COLORS.black,
                               }}
                           >
                               404
                           </span>
                       }
                    subTitle={
                        <Text
                            style={{
                                color: isDark ? COLORS.white : COLORS.black,
                            }}
                        >
                            Sorry, the page you visited is Under
                            Construction 😂.
                        </Text>
                    }
                    extra={
                        <Link to={redirectLink}>
                            <Button type="primary">
                                Go Back
                            </Button>
                        </Link>
                    }
                />
            </div>
        </Layout>
    );
};

export default React.memo(Pages402);