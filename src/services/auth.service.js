import bcrypt from "bcrypt"

export const toHashPassword = async(password,salt=12) => {
   const hashedPassword = await bcrypt.hash(password,salt);
   return hashedPassword;
}
export const toComparePassword = async(password,hashedPassword) => {
   const isMatch = await bcrypt.compare(password,hashedPassword);
   return isMatch;
}