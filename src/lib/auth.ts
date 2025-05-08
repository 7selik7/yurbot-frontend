import { axiosInstance } from '@/lib/instance';
import {LoginData, LoginResponse, SignupData, UserDataResponse} from '@/types/auth';

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
    errorCallback: () => void,
) => {
  axiosInstance
      .post('/auth/signup', signupData)
      .then((response) => {
        callback();
      })
      .catch((err) => {
        errorCallback();
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
