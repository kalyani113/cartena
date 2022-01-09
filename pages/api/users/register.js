import nc from 'next-connect';
import User from '../../../models/User';
import {gerenateToken} from '../../../utils/auth';

const handler = nc();
handler.post(async (req, res) => {
  const {email, password, name} = req.body;
  const newUser = new User({email, password, name});
  const user = await newUser.save();
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
