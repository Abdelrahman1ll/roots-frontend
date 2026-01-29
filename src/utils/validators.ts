/**
 * Regex for validating Egyptian mobile numbers (01x...).
 * تعبير نمطي للتحقق من أرقام الهواتف المصرية المحمولة.
 */
export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

/**
 * Validates the format of an email address.
 * يتحقق من صحة تنسيق البريد الإلكتروني.
 */
export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Helper function to check if a phone number matches the Egyptian format.
 * وظيفة مساعدة للتأكد من مطابقة رقم الهاتف للتنسيق المصري.
 */
export const isValidEgyptianPhone = (phone: string) => {
  return EGYPTIAN_PHONE_REGEX.test(phone);
};
