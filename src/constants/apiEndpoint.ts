export const apiEndpoints = {
    USER: {
        GET_ALL: "/users",
        GET_ID: (userId: string) => `/users/${userId}`,
        CREATE: "/users",
        EDIT: (userId: string) => `/users/${userId}`,
        DELETE: (userId: string) => `/users/${userId}`,
    },
    ASSET: {
        GET_ALL: "/assets",
        GET_ID: (assetId: string) => `/assets/${assetId}`,
        CREATE: "/assets",
        EDIT: (assetId: string) => `/assets/${assetId}`,
        DELETE: (assetId: string) => `/assets/${assetId}`,
    },
    LOGIN: "/users/login"
}