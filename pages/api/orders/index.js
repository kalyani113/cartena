import nc from "next-connect";
import Order from '../../../models/Order';
import db from '../../../utils/db';
import { isAuth } from '../../../utils/auth';

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  const newOrder = await new Order({...req.body, user: req.user.data.id});
  const order = await newOrder.save();
  await db.disconnect();
  res.status(201).send(order);
})

export default handler;