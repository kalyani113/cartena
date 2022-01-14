import React, {useContext, useEffect} from 'react';
import Layout from '../components/Layout';
import {Store} from '../utils/Store';
import {Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Link, Select, MenuItem, Button, Card, List, ListItem} from '@material-ui/core';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';
import useStyles from '../utils/styles';

function PlaceOrder() {
  const classes = useStyles();
  const router = useRouter();
  const {state, dispatch} = useContext(Store);
  const {
    cart: {cartItems, shippingAddress, paymentMethod}
  } = state;

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, []);

  const handlePlaceOrder = () => {};

  const itemPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxPrice = itemPrice * 0.15;
  const shippingPrice = itemPrice > 200 ? 0 : 15;
  const totalPrice = itemPrice + taxPrice + shippingPrice;

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
                {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.postalCode}, {shippingAddress.city}, {shippingAddress.county}
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
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
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
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price}</TableCell>
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
                    ${itemPrice}
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
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), {ssr: false});
