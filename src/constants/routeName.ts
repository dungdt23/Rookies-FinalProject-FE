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
    asset: {
        list: "/assets",
        create: "/assets/create",
        edit: (assetId: string): string => `/assets/edit/${assetId}`
    },
    assignment: {
        list: "/assignments",
        create: "/assignments/create",
        edit: (assignmentId: string): string => `/assignments/edit/${assignmentId}`
    }
}