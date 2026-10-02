// Matches common Pakistani mobile formats: 03XXXXXXXXX or +923XXXXXXXXX
const PK_PHONE = /^(\+92|0)3\d{9}$/;

export function isValidPakistaniPhone(value: string): boolean {
  return PK_PHONE.test(value.replace(/[\s-]/g, ""));
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
