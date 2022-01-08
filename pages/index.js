import Layout from '../components/Layout';
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button} from '@material-ui/core';
import axios from 'axios';
import NextLink from 'next/link';
import db from '../utils/db';
import Product from '../models/Product';
import {Store} from '../utils/Store';
import {useContext} from 'react';
import {useRouter} from 'next/router';

export default function Home(props) {
  const {state, dispatch} = useContext(Store);
  const {products} = props;
  const router = useRouter();

  const addToCart = async (product) => {
    const extistingCartItems = state.cart.cartItems;
    const productExists = extistingCartItems.find((item) => item.slug === product.slug);
    const quantity = productExists ? productExists.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`);
    if (data && data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
    } else {
      dispatch({type: 'ADD_TO_CART', payload: { ...data, quantity}});
      router.push('/cart');
    }
  }
  
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia component='img' height='500' image={product.image} alt={product.name} />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size='small' color='primary' onClick={() => addToCart(product)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.docToObject),
    },
  };
}