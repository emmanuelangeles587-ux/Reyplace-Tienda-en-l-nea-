/**
 * Masking utilities for PII protection and sensitive ID logs
 */

export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') return '***@***.***';
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const [local, domain] = parts;
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function maskId(id: string): string {
  if (!id || typeof id !== 'string') return '***';
  if (id.length <= 4) return '***';
  return `${id.slice(0, 3)}***${id.slice(-2)}`;
}
