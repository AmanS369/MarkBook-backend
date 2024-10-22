import bcrypt from "bcrypt";

export const hash = async (password) => {
  try {
    const hashpassword = await bcrypt.hash(password, 10);
    return hashpassword;
  } catch (e) {
    console.log(e);
  }
};
export const compare = async (password, hashpassword) => {
  return bcrypt.compare(password, hashpassword);
};
