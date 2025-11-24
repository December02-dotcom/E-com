
const AUTH_KEY = 'greenshop_auth_token';
const PASSWORD_KEY = 'greenshop_admin_password';
const DEFAULT_PASSWORD = 'admin123';

// Initialize default password if not set
if (!localStorage.getItem(PASSWORD_KEY)) {
  localStorage.setItem(PASSWORD_KEY, DEFAULT_PASSWORD);
}

export const login = (password: string): boolean => {
  const currentPassword = localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  if (password === currentPassword) {
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

export const changePassword = (currentPass: string, newPass: string): { success: boolean; message: string } => {
  const storedPass = localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  
  if (currentPass !== storedPass) {
    return { success: false, message: 'Mật khẩu hiện tại không đúng.' };
  }

  if (newPass.length < 6) {
    return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
  }

  localStorage.setItem(PASSWORD_KEY, newPass);
  return { success: true, message: 'Đổi mật khẩu thành công.' };
};
