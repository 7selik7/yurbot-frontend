export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  host: string;
}

export interface ForgotPasswordData {
  email: string;
  host: string;
}

export interface ConfirmPasswordData {
  new_password: string;
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
