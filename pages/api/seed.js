import nc from "next-connect";
import Product from '../../models/Product';
import db from '../../utils/db';
import data from '../../utils/dummy-data';
import User from '../../models/User';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await Product.deleteMany();
  await User.deleteMany();
  const products = await Product.insertMany(data.products);
  const users = await User.insertMany(data.users);
  await db.disconnect();
  res.send({products,users});
})

export default handler;