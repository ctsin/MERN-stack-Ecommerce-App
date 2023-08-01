import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const salt = 10;

    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error(error);
  }
};

export const comparePassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);
