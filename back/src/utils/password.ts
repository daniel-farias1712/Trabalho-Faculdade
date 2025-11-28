import bcrypt from 'bcryptjs';

export async function hashPassword(senha: string) {
  return bcrypt.hash(senha, 10);
}

export async function comparePassword(senha: string, hash: string) {
  return bcrypt.compare(senha, hash);
}
