export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserDataResponse {
  uuid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  isFirstLogin: boolean;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}
