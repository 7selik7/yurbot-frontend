import axios from 'axios';
import { toCamelCase } from '@/utils/toCamelCase';
import { config } from '@/config';

export const axiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

async function tryRefreshToken(originalRequest: any) {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    handleLogout();
    return;
  }

  try {
    const response = await axios.post(`${config.API_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;
    localStorage.setItem('accessToken', newAccessToken);

    originalRequest._retry = true;
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return axios(originalRequest);
  } catch (err) {
    handleLogout();
    return Promise.reject(err);
  }
}

axiosInstance.interceptors.response.use(
  (res) => {
    res.data = toCamelCase(res.data);
    return res;
  },
  async (error) => {
    const { response, config } = error;
    const isExpired =
      response?.status === 401 &&
      response.data?.detail === 'Token has expired' &&
      config &&
      !config._retry;
    if (isExpired) {
      return tryRefreshToken(config);
    }

    const message = response?.data?.detail || 'Something went wrong';
    return Promise.reject({ message, status: response?.status });
  },
);
