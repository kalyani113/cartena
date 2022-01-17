import React, {useContext} from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import {Grid, Link, List, ListItem, Typography, Button, Card} from '@material-ui/core';
import Image from 'next/image';
import NextLink from 'next/link';
import useStyles from '../../utils/styles';
import db from '../../utils/db';
import Product from '../../models/Product';
import {Store} from '../../utils/Store';
import {useRouter} from 'next/router';


export default function ProductDescription(props) {
  const {state, dispatch} = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const reqProduct = props.product;
  if (!reqProduct) {
    return <div>Product not found..</div>;
  }
  const addToCart = async () => {
    const extistingCartItems = state.cart.cartItems;
    const productExists = extistingCartItems.find((item) => item.slug === reqProduct.slug);
    const quantity = productExists ? productExists.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${reqProduct._id}`);
    if (data && data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
    } else {
      dispatch({type: 'ADD_TO_CART', payload: { ...data, quantity}});
      router.push('/cart');
    }
  }
  return (
    <Layout title={reqProduct.name} description={reqProduct.description}>
      <div className={classes.linkToBack}>
        <NextLink href='/' passHref>
          <Link><Typography>Back to products</Typography></Link>
        </NextLink>
      </div>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Image src={reqProduct.image} alt={reqProduct.name} width={600} height={700} layout='responsive' />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component='h1' variant='h1'>{reqProduct.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {reqProduct.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {reqProduct.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {reqProduct.rating} stars ({reqProduct.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography> Description: {reqProduct.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${reqProduct.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{reqProduct.countInStock > 0 ? 'In stock' : 'Unavailable'}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button fullWidth color='secondary' variant='contained' onClick={addToCart}>
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({slug}).lean();
  await db.disconnect();
  return {
    props: {
      product: db.docToObject(product),
    },
  };
}