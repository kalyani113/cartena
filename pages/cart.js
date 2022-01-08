import React, {useContext} from 'react';
import Layout from '../components/Layout';
import {Store} from '../utils/Store';
import {Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Link, Select, MenuItem, Button, Card, List, ListItem} from '@material-ui/core';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

function CartPage() {
  const {state, dispatch} = useContext(Store);
  const {
    cart: {cartItems}
  } = state;

  const updateCartItemQuantity = (product, quantity) => {
    dispatch({type: 'ADD_TO_CART', payload: {...product, quantity}});
  };

  const removeCartItem = (product) => {
    dispatch({type: 'REMOVE_FROM_CART', payload: product});
  }

  return (
    <div>
      <Layout>
        <Typography variant='h2'>Cart Page</Typography>
        {cartItems.length > 0 ? (
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Action</TableCell>
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
                          <TableCell>
                            <Select value={item.quantity} onChange={(e) => updateCartItemQuantity(item, e.target.value)}>

                            {[...Array(item.countInStock).keys()].map((i) => (
                                <MenuItem key={i} value={i+1}>{i+1}</MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>
                            <Button color='secondary' variant='contained' onClick = {()=>removeCartItem(item)}>
                              X
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <List>
                    <ListItem>
                      <Typography variant='h2'>
                        Subtotal: ({cartItems.reduce((a, i) => i.quantity + a, 0)} items): $ {cartItems.reduce((a, i) => i.quantity * i.price + a, 0)}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Button fullWidth color='secondary' variant='contained'>
                        Checkout
                      </Button>
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div>
            <p>No items in cart</p>
            <NextLink href='/' passHref><Link> Go to shopping</Link></NextLink>
          </div>
        )}
      </Layout>
    </div>
  );
}

export default dynamic(() => Promise.resolve(CartPage), {ssr: false});
