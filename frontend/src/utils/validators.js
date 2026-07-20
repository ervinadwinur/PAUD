// Validasi Email
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validasi Password (minimal 6 karakter)
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Validasi Nomor HP Indonesia
export const validatePhone = (phone) => {
  return /^(08|\+628)[0-9]{8,12}$/.test(phone);
};

// Validasi Input Kosong
export const isRequired = (value) => {
  return (
    value !== null && value !== undefined && value.toString().trim() !== ""
  );
};

// Validasi Panjang Minimal
export const minLength = (value, length) => {
  return value.length >= length;
};

// Validasi Panjang Maksimal
export const maxLength = (value, length) => {
  return value.length <= length;
};
