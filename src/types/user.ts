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

export interface UserCredential {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string
}

export enum UserGender {
    Male = 1,
    Female = 0
}

export enum UserType {
    Admin = "Admin",
    Staff = "Staff"
}