/**
 * NiramayNet Validation Utilities
 * Strict validation for Patient Name, 10-Digit Mobile Number, and ABHA ID
 */

export interface ValidationResult {
  isValid: boolean;
  messageKey?: string;
}

/**
 * Validates a proper patient name.
 * Accepts Latin and Devanagari (Marathi/Hindi) alphabets, spaces, dots, and hyphens.
 * Rejects numbers, special symbols, single-letter names, and random keyboard mashes.
 */
export const validatePatientName = (name: string): ValidationResult => {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, messageKey: 'invalidNameError' };
  }

  if (trimmed.length < 2 || trimmed.length > 60) {
    return { isValid: false, messageKey: 'invalidNameError' };
  }

  // Must contain only letters (Latin A-Z or Devanagari Unicode \u0900-\u097F), spaces, dots, or hyphens
  const validNameRegex = /^[a-zA-Z\u0900-\u097F\s\.\'-]+$/;
  if (!validNameRegex.test(trimmed)) {
    return { isValid: false, messageKey: 'invalidNameError' };
  }

  // Reject digits
  if (/\d/.test(trimmed)) {
    return { isValid: false, messageKey: 'invalidNameError' };
  }

  // Reject repetitive character mashes (e.g., "aaaaa", "zzzzz")
  if (/(.)\1{3,}/i.test(trimmed)) {
    return { isValid: false, messageKey: 'invalidNameError' };
  }

  // Require at least 2 distinct letters
  const lettersOnly = trimmed.replace(/[^a-zA-Z\u0900-\u097F]/g, '');
  const uniqueLetters = new Set(lettersOnly.toLowerCase());
  if (uniqueLetters.size < 2) {
    return { isValid: false, messageKey: 'invalidNameError' };
  }

  return { isValid: true };
};

/**
 * Validates a 10-digit Indian mobile number.
 * Must start with 6, 7, 8, or 9 and be exactly 10 digits long.
 * Rejects dummy numbers (e.g. 0000000000, 1111111111, 1234567890).
 */
export const validateMobileNumber = (phone: string): ValidationResult => {
  const digits = phone.replace(/\D/g, '');

  if (!digits || digits.length !== 10) {
    return { isValid: false, messageKey: 'invalidPhoneError' };
  }

  // Indian mobile numbers start with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(digits)) {
    return { isValid: false, messageKey: 'invalidPhoneError' };
  }

  // Reject repetitive dummy numbers like 0000000000, 1111111111, etc.
  if (/^(\d)\1{9}$/.test(digits)) {
    return { isValid: false, messageKey: 'invalidPhoneError' };
  }

  // Reject 1234567890
  if (digits === '1234567890') {
    return { isValid: false, messageKey: 'invalidPhoneError' };
  }

  return { isValid: true };
};

/**
 * Automatically formats an ABHA ID into XX-XXXX-XXXX-XXXX as digits are typed.
 */
export const formatAbhaIdInput = (input: string): string => {
  // If user enters an ABHA address like user@abdm, preserve it
  if (input.includes('@')) {
    return input.trim();
  }

  // Otherwise clean to digits and format as XX-XXXX-XXXX-XXXX
  const digits = input.replace(/\D/g, '').slice(0, 14);
  const parts: string[] = [];

  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 10));
  if (digits.length > 10) parts.push(digits.slice(10, 14));

  return parts.join('-');
};

/**
 * Validates a National Health Authority (NHA) ABHA ID.
 * Standard format: 14 digits formatted as XX-XXXX-XXXX-XXXX or valid ABHA address (user@abdm).
 */
export const validateAbhaId = (abhaId: string): ValidationResult & { isVerified?: boolean } => {
  const trimmed = abhaId.trim();

  if (!trimmed) {
    return { isValid: false, isVerified: false, messageKey: 'invalidAbhaError' };
  }

  // ABHA Address format (e.g. user@abdm, user@sbx)
  const abhaAddressRegex = /^[a-zA-Z0-9._-]+@(abdm|sbx|nha|abha)$/i;
  if (abhaAddressRegex.test(trimmed)) {
    return { isValid: true, isVerified: true };
  }

  // Standard 14-digit ABHA ID (e.g. 91-8823-4410-12)
  const standardAbhaRegex = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
  if (standardAbhaRegex.test(trimmed)) {
    return { isValid: true, isVerified: true };
  }

  // Raw 14 digits
  const rawDigits = trimmed.replace(/\D/g, '');
  if (rawDigits.length === 14) {
    return { isValid: true, isVerified: true };
  }

  return { isValid: false, isVerified: false, messageKey: 'invalidAbhaError' };
};
