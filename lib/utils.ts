export function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Only lowercase and numbers
  const length = Math.floor(Math.random() * 3) + 6; // 6-8 chars
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

