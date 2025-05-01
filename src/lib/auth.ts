import { axiosInstance } from '@/lib/instance';
import { LoginData, LoginResponse, UserDataResponse } from '@/types/auth';

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
