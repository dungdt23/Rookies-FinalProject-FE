export const apiEndpoints = {
    USER: {
        GET_ALL: "/users",
        GET_ID: (userId: string) => `/users/${userId}`,
        CREATE: "/users",
        EDIT: (userId: string) => `/users/${userId}`,
        DELETE: (userId: string) => `/users/${userId}`,
    },
    LOGIN: "/users/login"
}