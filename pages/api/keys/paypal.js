import nc from "next-connect";
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
  await db.disconnect();
})

export default handler;