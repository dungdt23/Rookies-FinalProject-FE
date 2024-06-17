export const routeNames = {
    login: "/login",
    index: "/",
    unauthorized: "/unauthorized",
    forbidden: "/forbidden",
    notFound: "/404",
    serverError: "/server-error",
    user: {
        list: "/users",
        create: "/users/create",
        edit: (userId: string): string => `/users/edit/${userId}`
    },
}