export const apiEndpoints = {
    USER: {
        GET_ALL: "/users",
        GET_ID: (userId: string) => `/users/${userId}`,
        CREATE: "/users",
        EDIT: (userId: string) => `/users/${userId}`,
        DELETE: (userId: string) => `/users/${userId}`,
        CHANGE_PASSWORD: "/users/change-password",
        CHANGE_PASSWORD_FIRST_TIME: "/users/change-password-first-time"
    },
    ASSET: {
        GET_ALL: "/assets",
        GET_ID: (assetId: string) => `/assets/${assetId}`,
        CREATE: "/assets",
        EDIT: (assetId: string) => `/assets/${assetId}`,
        DELETE: (assetId: string) => `/assets/${assetId}`,
    },
    ASSIGNMENT: {
        GET_ALL: "/assignments",
        GET_ID: (assignmentId: string) => `/assignments/${assignmentId}`,
        CREATE: "/assignments",
        EDIT: (assignmentId: string) => `/assignments/${assignmentId}`,
        DELETE: (assignmentId: string) => `/assignments/${assignmentId}`,
        HISTORY: (assetId: string) => `/assignments/asset-historical/${assetId}`,
        RESPOND: "/assignments/respond"
    },
    RETURN_REQUEST: {
        GET_ALL: "/return-requests",
        COMPLETE: (returnRequestId:string) => `/return-requests/${returnRequestId}/state`,
        CREATE: "/return-requests"
    },
    CATEGORY: {
        GET_ALL: "/categories",
        CREATE: "/categories",
        CHECK_UNIQUE: "/categories/unique-prefix-name"
    },
    TYPE: {
        GET_ALL: "/types"
    },
    REPORT: {
        GET_ALL: "/reports",
        EXPORT: "/reports/export"
    },
    LOGIN: "/users/login"
}