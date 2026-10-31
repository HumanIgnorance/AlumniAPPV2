# Updated files (copy over your project, same paths)

- resources/js/components/FormLogin.jsx
    * useState("currentView") moved above the useEffect that uses it (login crash, TDZ)
    * removed calls to never-defined setScatterLetters/generateScatterLetters/setAnimationKey
      (ReferenceError every time the theme was switched to black on the login page)
- resources/js/pages/admin/ProfilePage.jsx
    * removed undefined `themedClass` (ReferenceError after saving profile / cancelling edit);
      dark mode for messages is already handled by [data-theme="black"] .ant-message CSS
- resources/js/pages/shared/profile/FormPrimaryDetails.jsx
    * added missing imports: `message` (antd) and DIR_LOCATION (~/utils/constant)

Not changed (dead code, never imported, harmless): actions/{employee,faculties,student,college}Actions.js,
states/sportsState.js (duplicate key), utils/api.js student methods (undefined access_token).
