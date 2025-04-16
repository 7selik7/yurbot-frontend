export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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
