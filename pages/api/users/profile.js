import nc from 'next-connect';
import User from '../../../models/User';
import {gerenateToken, isAuth} from '../../../utils/auth';
import bcrypt from 'bcrypt';
import db from '../../../utils/db';

const handler = nc();

handler.use(isAuth);

handler.put(async (req, res) => {
  const {email, password, name} = req.body;
  const userId = req.user.data.id;
  await db.connect();
  const user = await User.findById(userId);
  user.name = name;
  user.email = email;
  user.password = password ? bcrypt.hashSync(password, 10) : user.password;
  const savedUser = await user.save();
  const token = await gerenateToken(savedUser);
  await db.disconnect();
  res.send({user: savedUser, token});
});

export default handler;
