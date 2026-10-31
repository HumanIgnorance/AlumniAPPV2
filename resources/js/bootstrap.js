import _ from "lodash";
import axios from "axios";
import "bootstrap";

window._ = _;

/**
 * axios automatically sends the CSRF token (XSRF cookie) to Laravel.
 */
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

/**
 * Echo (kept commented, as before). If you enable it, use import.meta.env:
 *   key: import.meta.env.VITE_PUSHER_APP_KEY,
 *   cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
 */
