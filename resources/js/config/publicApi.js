// Request options shared by the public (anonymous) data hooks.
export const REQUEST_OPTS = {
    silent: true, // don't trigger the global error modal for anon visitors
    skipAuthRedirect: true, // never bounce anonymous visitors to /login
};
