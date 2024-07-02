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
        edit: (userId: string): string => userId !== '' ? `/users/edit/${userId}` : `/users/edit`
    },
    asset: {
        list: "/assets",
        create: "/assets/create",
        edit: (assetId: string): string => assetId !== '' ? `/assets/edit/${assetId}` : `/assets/edit`
    },
    assignment: {
        list: "/assignments",
        create: "/assignments/create",
        edit: (assignmentId: string): string => assignmentId !== '' ? `/assignments/edit/${assignmentId}` : '/assignments/edit',
        staffList: "/"
    },
    returnRequest:{
        list:"/return-request",
    },
    report: {
        list: "/reports"
    }
}