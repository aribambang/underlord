const bcrypt = require('bcrypt');

const saltRounds = 12;

export const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};
