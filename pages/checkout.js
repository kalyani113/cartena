import React, {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import {Store} from '../utils/Store';
import Layout from '../components/Layout';
import {Controller, useForm} from 'react-hook-form';
import useStyles from '../utils/styles';
import {Typography, List, ListItem, TextField, Button} from '@material-ui/core';
import CheckoutWizard from '../components/CheckoutWizard';

export default function Shipping() {
  const router = useRouter();
  const classes = useStyles();
  const {state, dispatch} = useContext(Store);
  const {
    userInfo,
    cart: {cartItems}
  } = state;
  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue
  } = useForm();

  const saveShippingAddress = ({fullName, address, city, postalCode, country}) => {
    dispatch({type: 'SAVE_SHIPPING_ADDRESS', payload: {fullName, address, city, postalCode, country}});
    router.push('/payment');
  };

  useEffect(() => {
    if (!cartItems.length) {
      router.push('/cart');
    }
    if (!userInfo) {
      router.push('/login?redirect=checkout');
    }
    setValue('fullName', state.cart.shippingAddress?.fullName);
    setValue('address', state.cart.shippingAddress?.address);
    setValue('city', state.cart.shippingAddress?.city);
    setValue('postalCode', state.cart.shippingAddress?.postalCode);
    setValue('country', state.cart.shippingAddress?.country);
  }, []);

  return (
    <Layout>
      <CheckoutWizard activeStep={1} />
      <form className={classes.form}>
        <Typography component='h1' variant='h1'>
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='fullName'
              control={control}
              rules={{required: true, minLength: 4}}
              render={({field}) => (
                <TextField
                  variant='outlined'
                  label='Full Name'
                  fullWidth
                  inputProps={{type: 'text'}}
                  {...field}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName ? (errors.fullName.type === 'required' ? 'Full name is required' : 'Full name should conatain min 4 characters') : ''}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='address'
              control={control}
              rules={{required: true, minLength: 4}}
              render={({field}) => (
                <TextField
                  variant='outlined'
                  label='Address'
                  fullWidth
                  inputProps={{type: 'text'}}
                  {...field}
                  error={Boolean(errors.address)}
                  helperText={errors.address ? (errors.address.type === 'minLength' ? 'address should contain minimum 4 characters' : 'address is required') : ''}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='city'
              control={control}
              rules={{required: true, minLength: 4}}
              render={({field}) => (
                <TextField
                  variant='outlined'
                  label='City'
                  fullWidth
                  inputProps={{type: 'text'}}
                  {...field}
                  error={Boolean(errors.city)}
                  helperText={errors.city ? (errors.city.type === 'required' ? 'City is required' : 'City should have minimum 4 characters') : ''}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='postalCode'
              control={control}
              rules={{required: true}}
              render={({field}) => (
                <TextField
                  variant='outlined'
                  label='Postal code'
                  fullWidth
                  inputProps={{type: 'text'}}
                  {...field}
                  error={Boolean(errors.postalCode)}
                  helperText={errors.postalCode && errors.postalCode.type === 'required' ? 'Postal code is required' : ''}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='country'
              control={control}
              rules={{required: true, minLength: 4}}
              render={({field}) => (
                <TextField
                  variant='outlined'
                  label='Country'
                  fullWidth
                  inputProps={{type: 'text'}}
                  {...field}
                  error={Boolean(errors.country)}
                  helperText={errors.country ? (errors.country.type === 'minLength' ? 'Country should contain minimum 4 characters' : 'Country is required') : ''}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button color='primary' variant='contained' fullWidth onClick={handleSubmit(saveShippingAddress)}>
              Save Address
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
