export const apiEndpoints = {
    USER: {
        GET_ALL: "/users",
        GET_ID: "/users",
        CREATE: "/users",
        EDIT: (userId: string) => `/users/${userId}`,
    },
    LOGIN: "/users/login"
}