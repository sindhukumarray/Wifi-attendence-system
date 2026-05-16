const TOKEN_KEY = 'wifi_attendance_jwt';
const USER_KEY = 'wifi_attendance_user';

export const setAuthData = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
