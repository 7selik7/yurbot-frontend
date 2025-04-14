import { axiosInstance } from '@/lib/instance';
import { LoginResponse } from '@/types/auth';

interface LoginData {
  email: string;
  password: string;
}

export const authLogin = async (
  loginData: LoginData,
  callback: (res: LoginResponse) => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .post<LoginResponse>('/login', loginData)
    .then((response) => {
      callback(response.data);
    })
    .catch((err) => {
      errorCallback(err);
    });
};
