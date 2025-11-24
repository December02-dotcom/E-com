const AUTH_KEY = 'greenshop_auth_token';

export const login = (password: string): boolean => {
  // Mật khẩu cứng cho demo: 'admin123'
  if (password === 'admin123') {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};