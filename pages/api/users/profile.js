import nc from 'next-connect';
import User from '../../../models/User';
import {gerenateToken, isAuth} from '../../../utils/auth';
import bcrypt from 'bcrypt';

const handler = nc();

handler.use(isAuth);
handler.put(async (req, res) => {
  const {email, password, name} = req.body;
  const userId = req.user.data.id;
  const user = await User.findById(userId);
  user.name = name;
  user.email = email;
  user.password = password ? bcrypt.hashSync(password, 10) : user.password;
  const savedUser = await user.save();
  const token = await gerenateToken(savedUser);
  res.send({user: savedUser, token});
});

export default handler;
