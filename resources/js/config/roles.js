/**
 * User roles. Values must match what the Laravel backend returns/stores
 * (users.role) — never retype these strings in components, import ROLES.
 */
export const ROLES = Object.freeze({
    ADMIN: "admin",
    ALUMNI: "alumni",
    DEPARTMENT_HEAD: "department_head",
});

export const ROLE_LABELS = Object.freeze({
    [ROLES.ADMIN]: "Administrator",
    [ROLES.ALUMNI]: "Alumni",
    [ROLES.DEPARTMENT_HEAD]: "Department Head",
});

/** Where each role lands after login / on "/". */
export const ROLE_HOME = Object.freeze({
    [ROLES.ADMIN]: "/home",
    [ROLES.ALUMNI]: "/home",
    [ROLES.DEPARTMENT_HEAD]: "/department-dashboard",
});

export const isRole = (value, ...roles) => roles.includes(value);
