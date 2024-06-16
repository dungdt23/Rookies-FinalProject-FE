export interface User {
    id: string;
    staffCode: string;
    firstName: string;
    lastName: string;
    userName: string;
    joinedDate: string;
    typeGender: UserGender;
    type: UserType;
}

export interface JWTPayload {
    id: string;
    username: string;
    typeId: string;
    type: string;
    locationId: string;
    location: string;
    nbf: number;
    exp: number;
    iat: number;
}

export enum UserGender {
    Male = 1,
    Female = 0
}

export enum UserType {
    Admin = "Admin",
    Staff = "Staff"
}