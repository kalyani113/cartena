import {Typography, FormControl, RadioGroup, FormControlLabel, Radio, List, ListItem, Button} from '@material-ui/core';
import React, {useContext, useState, useEffect} from 'react';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import {useRouter} from 'next/router';
import {Store} from '../utils/Store';
import useStyles from '../utils/styles';
import {useSnackbar} from 'notistack';

export default function Payment() {
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const router = useRouter();
  const {state, dispatch} = useContext(Store);
  const {
    cart: {shippingAddress, paymentMethod}
  } = state;
  const [payment, setPayment] = useState('');
  const classes = useStyles();

  useEffect(() => {
    if (!shippingAddress) {
      router.push('/checkout');
    } else {
      setPayment(paymentMethod)
    }
  }, []);

  const savePayment = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!payment) {
      enqueueSnackbar('Please choose payment method', {variant: 'error'});
      return;
    }
    dispatch({type: 'SAVE_PAYMENT_METHOD', payload: payment});
    router.push('/placeOrder');
  };

  return (
    <Layout>
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={savePayment}>
        <Typography variant='h1' component='h1'>
          Payment
        </Typography>
        <List>
          <ListItem>
            <FormControl component='fieldset'>
              <RadioGroup aria-label='Payment Method' value={payment} name='paymentMethods' onChange={(e) => setPayment(e.target.value)}>
                <FormControlLabel value='paypal' control={<Radio />} label='Paypal' />
                <FormControlLabel value='stripe' control={<Radio />} label='Stripe' />
                <FormControlLabel value='cash' control={<Radio />} label='Cash' />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth color='secondary' variant='contained' onClick={() => router.push('/checkout')}>
              Back
            </Button>
          </ListItem>
          <ListItem>
            <Button fullWidth color='primary' variant='contained' type='submit'>
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
