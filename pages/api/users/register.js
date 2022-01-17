import nc from 'next-connect';
import User from '../../../models/User';
import {gerenateToken} from '../../../utils/auth';
import bcrypt from 'bcrypt';
import db from '../../../utils/db';

const handler = nc();
handler.post(async (req, res) => {
  await db.connect();
  const {email, password, name} = req.body;
  const newUser = new User({email, password: bcrypt.hashSync(password, 10), name});
  const user = await newUser.save();
  await db.disconnect();
  if (user) {
    const token = await gerenateToken(user);
    res.send({
      user,
      token
    });
  } else {
    res.status(401).send({message: 'Error while registering user'});
  }
});

export default handler;
