import jwt from 'jsonwebtoken';

export const gerenateToken = async (user) => {
  const token = await jwt.sign({
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
}