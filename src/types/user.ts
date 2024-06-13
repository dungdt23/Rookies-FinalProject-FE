export interface User {
    id: string,
    email: string,
    name: string,
    roles: Role[]
}

export interface Role {
    id: string
    name: RoleName,
    description: string | null
}

export enum RoleName {
    Admin = "Admin",
    User = "User"
}

export interface UserCredential {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string
}