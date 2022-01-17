import nc from "next-connect";
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import {gerenateToken} from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc();
handler.post(async (req, res) => {
  await db.connect();
  const {email, password} = req.body;
  const user = await User.findOne({email});
  await db.disconnect();
  if(user && bcrypt.compareSync(password, user.password)) {
    const token = await gerenateToken(user);
    res.send({
      user,
      token
    });
  } else {
    res.status(401).send({message: 'Invalid email / password'});
  }
});

export default handler;