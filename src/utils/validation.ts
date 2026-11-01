export const formatCardNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
};

export const formatExpiry = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

export const detectCardBrand = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  return 'Tarjeta Internacional';
};

export const validateLuhn = (raw: string): boolean => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  if (/^0+$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export interface CardValidationErrors {
  number?: string;
  name?: string;
  expiry?: string;
  cvc?: string;
}

export const validateCardFields = (fields: {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}): CardValidationErrors => {
  const errors: CardValidationErrors = {};
  const digits = fields.number.replace(/\D/g, '');

  if (!digits) {
    errors.number = 'Ingresa los 16 dígitos de tu tarjeta.';
  } else if (!validateLuhn(digits)) {
    errors.number = 'El número no supera la verificación Luhn. Revisa los dígitos.';
  }

  if (!fields.name || fields.name.trim().length < 4) {
    errors.name = 'Ingresa el nombre completo del titular.';
  }

  const expMatch = /^(\d{2})\/(\d{2})$/.exec(fields.expiry.trim());
  if (!expMatch) {
    errors.expiry = 'Usa formato MM/AA.';
  } else {
    const month = parseInt(expMatch[1], 10);
    const year = 2000 + parseInt(expMatch[2], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (month < 1 || month > 12) {
      errors.expiry = 'Mes inválido (01–12).';
    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
      errors.expiry = 'La tarjeta ingresada está vencida.';
    }
  }

  if (!/^\d{3,4}$/.test(fields.cvc.trim())) {
    errors.cvc = 'Ingresa 3 o 4 dígitos.';
  }

  return errors;
};
