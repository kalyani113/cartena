import React, {useContext, useEffect, useReducer} from 'react';
import Layout from '../../components/Layout';
import {Store} from '../../utils/Store';
import {Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Link, Button, Card, List, ListItem, CircularProgress} from '@material-ui/core';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import CheckoutWizard from '../../components/CheckoutWizard';
import useStyles from '../../utils/styles';
import axios from 'axios';
import {getError} from '../../utils/error';
import {usePayPalScriptReducer, PayPalButtons} from '@paypal/react-paypal-js';

function OrderDetails({params}) {
  const classes = useStyles();
  const {state} = useContext(Store);
  const {userInfo} = state;
  const orderId = params.id;
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

  const reducer = (state, {type, payload}) => {
    switch (type) {
      case 'FETCH_REQUEST':
        return {
          ...state,
          error: '',
          order: {},
          loading: true
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          error: '',
          order: payload,
          loading: false
        };
      case 'FETCH_FAIL':
        return {
          ...state,
          error: payload,
          order: {},
          loading: false
        };
      case 'PAY_REQUEST':
        return {
          ...state,
          paySuccess: false,
          payFail: ''
        };
      case 'PAY_SUCCESS':
        return {
          ...state,
          paySuccess: payload,
          payFail: ''
        };
      case 'PAY_FAIL':
        return {
          ...state,
          payFail: payload
        };
      default:
        return {...state};
    }
  };

  const [{loading, error, order, paySuccess}, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    order: {},
    paySuccess: false
  });

  const {shippingAddress, paymentMethod, cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, isDelivered, deliveredAt, isPaid, paidAt} = order;

  const fetchOrder = async () => {
    dispatch({type: 'FETCH_REQUEST'});
    try {
      const {data} = await axios.get(`/api/orders/${orderId}`, {headers: {authorization: `Bearer ${userInfo.token}`}});
      dispatch({type: 'FETCH_SUCCESS', payload: data});
    } catch (error) {
      dispatch({type: 'FETCH_FAIL', payload: getError(error)});
    }
  };
  const loadPaypalScript = async () => {
    const {data: clientId} = await axios.get('/api/keys/paypal', {headers: {authorization: `Bearer ${userInfo.token}`}});
    paypalDispatch({
      type: 'resetOptions',
      value: {
        currency: 'USD',
        'client-id': clientId
      }
    });
    paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
  };

  useEffect(() => {
    fetchOrder();
    loadPaypalScript();
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [paySuccess]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {value: totalPrice}
          }
        ]
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({type: 'PAY_REQUEST'});
        const {data} = await axios.put(`/api/orders/${order._id}/pay`, details, {
          headers: {authorization: `Bearer ${userInfo.token}`}
        });
        dispatch({type: 'PAY_SUCCESS', payload: data});
        enqueueSnackbar('Order is paid', {variant: 'success'});
      } catch (err) {
        dispatch({type: 'PAY_FAIL', payload: getError(err)});
        enqueueSnackbar(getError(err), {variant: 'error'});
      }
    });
  }

  function onError(err) {
    enqueueSnackbar(getError(err), {variant: 'error'});
  }

  return (
    <Layout>
      <CheckoutWizard activeStep={3} />
      <Typography variant='h2'>Order {orderId}</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
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
                <ListItem>Status: {isDelivered ? `delivered at ${deliveredAt}` : 'not delivered'}</ListItem>
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
                <ListItem>Status: {isPaid ? `Paid at ${paidAt}` : 'not paid'}</ListItem>
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
                        {cartItems?.map((item) => (
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
                  {!isPaid &&
                    (isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.fullWidth}>
                        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                      </div>
                    ))}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({params}) {
  return {props: {params}};
}

export default dynamic(() => Promise.resolve(OrderDetails), {ssr: false});
