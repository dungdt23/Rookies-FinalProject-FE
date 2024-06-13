export interface User {
    id: string,
    email: string,
    name: string,
    types: UserType
}

export interface UserCredential {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string
}

export enum UserType {
    Admin = "Admin",
    Staff = "Staff"
}