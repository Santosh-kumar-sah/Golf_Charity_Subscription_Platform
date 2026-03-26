// import jwt from "jsonwebtoken";

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, isAdmin: user.isAdmin }, // include isAdmin flag
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN }
//   );
// };

// export { generateToken };

import jwt from "jsonwebtoken";

export const generateToken = ({ id, isAdmin, role }) => {
  return jwt.sign(
    { id, isAdmin, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};