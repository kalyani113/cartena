import React, {useContext, useEffect, useState} from 'react';
import Layout from '../components/Layout';
import {Store} from '../utils/Store';
import {Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Link, Button, Card, List, ListItem, CircularProgress} from '@material-ui/core';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';
import useStyles from '../utils/styles';
import axios from 'axios';
import {getError} from '../utils/error';
import {useSnackbar} from 'notistack';
import Cookies from 'js-cookie';

function PlaceOrder() {
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const {state, dispatch} = useContext(Store);
  const {
    cart: {cartItems, shippingAddress, paymentMethod},
    userInfo
  } = state;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (!cartItems.length) {
      router.push('/cart');
    }
  }, []);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxPrice = itemsPrice * 0.15;
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const handlePlaceOrder = async () => {
    closeSnackbar();
    setLoading(true);
    try {
      const {data} = await axios.post('/api/orders', {paymentMethod, cartItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice}, {headers: {authorization: `Bearer ${userInfo?.token}`}});
      dispatch({type: 'CART_CLEAR'});
      Cookies.remove('cartItems');
      router.push(`/orders/${data._id}`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), {variant: 'error'});
    }
  };

  return (
    <Layout>
      <CheckoutWizard activeStep={3} />
      <Typography variant='h2'>Place Order</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant='h2' component='h2'>
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress?.fullName}, {shippingAddress?.address}, {shippingAddress?.postalCode}, {shippingAddress?.city}, {shippingAddress?.county}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant='h2' component='h2'>
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant='h2'>Cart Items</Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align='right'>Quantity</TableCell>
                        <TableCell align='right'>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image src={item.image} width='100' height='100' />
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link href={`/product/${item.slug}`}>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align='right'>{item.quantity}</TableCell>
                          <TableCell align='right'>${item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} className={classes.section}>
          <Card>
            <List>
              <ListItem>
                <Typography variant='h2'>Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    Items:
                  </Grid>
                  <Grid item xs={6} align='right'>
                    ${itemsPrice}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    Tax:
                  </Grid>
                  <Grid item xs={6} align='right'>
                    ${taxPrice}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    Shipping:
                  </Grid>
                  <Grid item xs={6} align='right'>
                    ${shippingPrice}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <strong>Total:</strong>
                  </Grid>
                  <Grid item xs={6} align='right'>
                    <strong>${totalPrice}</strong>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button fullWidth color='primary' variant='contained' onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), {ssr: false});
