export const maskEmail = (email: string): string => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  return `${username[0]}***${username.slice(-1)}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/.(?=.{4})/g, '*');
};
