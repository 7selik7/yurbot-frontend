import { axiosInstance } from '@/lib/instance';
import {
  ConfirmPasswordData,
  ForgotPasswordData,
  LoginData,
  LoginResponse,
  SignupData,
  UserDataResponse,
} from '@/types/auth';

export const authLoginRequest = async (
  loginData: LoginData,
  callback: (res: LoginResponse) => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .post<LoginResponse>('/auth/login', loginData)
    .then((response) => {
      callback(response.data);
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const authSignUpRequest = async (
  signupData: SignupData,
  callback: () => void,
  errorCallback: (err: any) => void,
) => {
  axiosInstance
    .post('/auth/signup', signupData)
    .then((response) => {
      callback();
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const forgotPasswordRequest = async (
  forgotPasswordData: ForgotPasswordData,
  callback: () => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .post('/auth/forgot-password', forgotPasswordData)
    .then(() => {
      callback();
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const confirmRegistrationRequest = async (
  token: string,
  callback: () => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .get(`/auth/confirmation_of_registration/${token}`)
    .then(() => {
      callback();
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const confirmPasswordRequest = async (
  token: string,
  confirmPasswordData: ConfirmPasswordData,
  callback: () => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .post(`/auth/forgot-password/${token}`, confirmPasswordData)
    .then(() => {
      callback();
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const getUserDataRequest = async (
  callback: (res: UserDataResponse) => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .get<UserDataResponse>('/auth/me', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
    })
    .then((response) => {
      callback(response.data);
    })
    .catch((err) => {
      errorCallback(err);
    });
};
