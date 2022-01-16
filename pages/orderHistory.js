import {Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Card, List, ListItem, Link, ListItemText} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useEffect, useContext, useReducer} from 'react';
import Layout from '../components/Layout';
import {Store} from '../utils/Store';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import {getError} from '../utils/Error';
import axios from 'axios';

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        error: '',
        orders: [],
        loading: true
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        error: '',
        orders: payload,
        loading: false
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        error: payload,
        orders: [],
        loading: false
      };
  }
};

function OrderHistory() {
  const classes = useStyles();
  const {state} = useContext(Store);
  const {userInfo} = state;
  const router = useRouter();
  const [{loading, error, orders}, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    order: {},
    paySuccess: false
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const {data} = await axios.get(`/api/orders/history`, {headers: {authorization: `Bearer ${userInfo.token}`}});
        dispatch({type: 'FETCH_SUCCESS', payload: data});
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: getError(error)});
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card className={classes.section}>
              <List>
                <ListItem button component='a'>
                  <NextLink href='/profile' passHref>
                    <ListItemText>Profile</ListItemText>
                  </NextLink>
                </ListItem>
                <ListItem selected button component='a'>
                  <NextLink href='/orderHistory' passHref>
                    <ListItemText>Order History</ListItemText>
                  </NextLink>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Delivered</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders?.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item._id?.substring(20, 24)}</TableCell>
                          <TableCell>{item.createdAt}</TableCell>
                          <TableCell>${item.totalPrice}</TableCell>
                          <TableCell>{item.isPaid ? 'Paid' : 'Not paid'}</TableCell>
                          <TableCell>{item.isDelivered ? 'Delivered' : 'Not delivered'}</TableCell>
                          <TableCell>
                            <NextLink href={`/orders/${item._id}`} passHref>
                              <Button color='primary' variant='outlined'>
                                Details
                              </Button>
                            </NextLink>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), {ssr: false});
