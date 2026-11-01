import { COLORS } from "~/config/theme";

export const statusColors = {
    Employed: "green",
    Unemployed: "red",
    "Under Employed": "orange",
};

export const employmentStatusOptions = [
    { value: "all", label: "All Employment", color: "default" },
    { value: "employed", label: "Employed", color: "green" },
    { value: "unemployed", label: "Unemployed", color: "red" },
    { value: "under_employed", label: "Under Employed", color: "orange" },
    // { value: "graduate_school", label: "Graduate School", color: "blue" },
];

export const statusOptions = [
    { value: "all", label: "All Status", color: "default" },
    { value: "pending", label: "Pending Review", color: "orange" },
    { value: "approved", label: "Approved", color: "green" },
    { value: "new_registered", label: "New Registered", color: "blue" },
    { value: "inactive", label: "Inactive", color: "red" },
    { value: "rejected", label: "Rejected", color: "red" },
];

export const majorOptions = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Biology",
    "Psychology",
    "Marketing",
    "Finance",
    "Arts & Sciences",
];

export const sortOptions = [
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "graduation-desc", label: "Graduation: Recent First" },
    { value: "graduation-asc", label: "Graduation: Oldest First" },
    { value: "salary-desc", label: "Salary: High to Low" },
    { value: "salary-asc", label: "Salary: Low to High" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "lastActive-desc", label: "Recently Active" },
];

export const courseFolders = [
    {
        id: 1,
        code: "BSIT",
        name: "Bachelor of Science in Information Technology",
        color: COLORS.f5222d,
    },
    {
        id: 2,
        code: "BSEd",
        name: "Bachelor in Teacher Education",
        color: COLORS.antdBlue,
    },
    {
        id: 3,
        code: "BEED",
        name: "Bachelor of Elementary Education",
        color: COLORS.antdBlue,
    },
    {
        id: 4,
        code: "BSBA",
        name: "Bachelor of Science in Business Administration",
        color: COLORS.antdGold,
    },
];
