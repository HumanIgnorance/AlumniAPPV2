/**
 * Keys used with getStorage()/secureLocalStorage/localStorage.
 * The VALUES are what is already stored in users' browsers — they must stay
 * byte-identical (several look alike: userID / userId / user_id are three
 * different legacy keys). Add new keys here, never inline.
 */
export const STORAGE_KEYS = Object.freeze({
    USER_ROLE: "userRole",
    USER_ID: "userID",
    USER_ID_CAMEL: "userId",
    USER_ID_SNAKE: "user_id",
    USER_NAME: "userName",
    USER_INFO: "userInfo",
    USER: "user",
    NAME: "name",
    EMAIL: "email",
    COURSE_ID: "courseId",
    FACULTY_ID: "faculty_id",
    ALUMNI_ID: "alumniId",
    EVENT_REGISTRATIONS: "eventRegistrations",
    AVATAR: "avatar",
    ACCESS_TOKEN: "access_token",
    ID: "id",
});
