ATMS - one switch for DevTools / right-click / zoom guards
==========================================================

1) Add ONE line to .env (AlumniAPPV2 root), then restart `npm run dev`
   or re-run `npm run build`:

       VITE_ENABLE_INSPECT_PROTECTION=false    # debugging  - everything OFF
       VITE_ENABLE_INSPECT_PROTECTION=true     # production - everything ON

   (Missing or any other value = ON, the safe default.)

2) Unzip this folder over the project root (paths match: resources\js\...).

FIXED IN THIS VERSION (v4)
  js\app.js  - the first version replaced the mobile patch's app.js and dropped its imports of
               auth-appbar.css and mobile-app-responsive.css, which left the header
               unstyled (huge logo, underlined link). This app.js keeps both imports
               and adds the devtoolsGuard import.
  css\auth-appbar.css - unchanged from the mobile patch: the header bar is for
               portrait phones / the PWA only. Laptop and desktop have NO header bar.
  Apply v4 AFTER atms-pwa-mobile-patch; do not re-apply the old app.js from v1.

v4: <InspectGuard /> (in hooks\usePreventInspect.jsx) is now used by Register, both
    quizzes, About, FAQ and MainPage, so they get the FULL guard (right-click,
    F12/Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, zoom lock + popup) instead of the
    partial pasted copies. The 404 page already had a full copy and is unchanged.
    Add <InspectGuard /> to any new page to protect it - nothing else needed.

WHAT IS NEW
  config/inspect.js            the single flag everything reads
  utils/devtoolsGuard.js       NEW - same as sclfAPP: hides the app while DevTools
                               is open; imported first in app.js
  hooks/usePreventInspect.jsx  now reads the shared flag
  app.js                       imports devtoolsGuard first

WHAT NOW FOLLOWS THE SWITCH (copies that ignored it before)
  pages/Main/MainPage.jsx, pages/ErrorPages/PublicPages404.jsx,
  pages/auth/answer-quiz-page/hooks/useAnswerQuizLogic1.js,
  pages/auth/image-quiz-page/hooks/useImageQuizLogic1.js,
  pages/auth/registration/hooks/useRegistrationState.jsx,
  pages/admin/About/AboutPublicPage.jsx, pages/admin/Faq/FaqPublicPage.jsx
    (About/FAQ are built on top of the mobile-patch versions)

LOGIN: the guard there was commented out. It now uses usePreventInspect via
useLoginState.js, so login is protected when the flag is true.
Removed the dead commented blocks in useLoginStatus.js and feedbackOptions.jsx.

NOTE: this is a deterrent only. Real protection stays in Laravel auth/policies.
