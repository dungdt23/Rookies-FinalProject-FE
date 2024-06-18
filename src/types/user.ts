export interface User {
    id: string;
    staffCode: string;
    firstName: string;
    lastName: string;
    userName: string;
    joinedDate: string;
    dateOfBirth: string;
    typeGender: UserGender;
    type: UserType;
    location: string;
}

export interface JWTPayload {
    id: string;
    username: string;
    role: string;
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
    Admin = "ADMIN",
    Staff = "STAFF"
}