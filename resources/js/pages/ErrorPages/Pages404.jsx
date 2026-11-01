// class Pages404 extends Component {
//     constructor() {
//         super();
//         this.state = {
//             //newCustomer: false
//         };
//     }

//     componentWillMount() {}

//     render() {


         
//         const role = secureLocalStorage.getItem("userRole")

//         let redirectLink = "/alumni"

//         if (role === "admin") {
//             redirectLink = "/admin-dashboard"
//         } else if (role === "department_head") {
//             redirectLink = "/department-dashboard"
//         } else if (role === "alumni") {
//             redirectLink = "/alumni"
//         }

        
//         return (
            
//             <React.Fragment>
//                 <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center', height: '100vh' }} >
//                     <Result
//                         status="404"
//                         title="404"
//                         subTitle="Sorry, the page you visited does not exist."
//                         extra={
//                           <Link to={redirectLink}>
//                             <Button type="primary">Go Back</Button>
//                           </Link>
//                         }
//                     />
//                 </div>
//             </React.Fragment>
// );
//     }
// }

// export default Pages404;

import React, { useEffect } from "react";
import { Result, Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { useAppTheme } from "~/hooks/useAppTheme";
import { COLORS } from "~/config/theme";
import { ROLES } from "~/config/roles";
import { buildPageTitle } from "~/config/site";
import { getUserRole } from "~/utils/session";

const { Text } = Typography;

const Pages404 = () => {
    useEffect(() => {
        document.title = buildPageTitle("Page Not Found");
    }, []);

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
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: isDark ? COLORS.ink0a : COLORS.white,
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
            Sorry, the page you visited does not exist.
        </Text>
    }
    extra={
        <Link to={redirectLink}>
            <Button type="primary">Go Back</Button>
        </Link>
    }
/>
        </div>
    );
};

export default React.memo(Pages404);