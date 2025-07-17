// src/users/interfaces/create-user.interface.ts
export interface CreateUserDto {
  login: string;
  email?: string;
  password: string;
  roles?: string[];
  verifiedEmail?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  birthday?: Date;
  avatar?: string;
  sex?: 'male' | 'female';
}