import bcrypt from 'bcrypt';

export const createHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
