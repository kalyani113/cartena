import {Button, CircularProgress, Typography, Grid, Card, List, ListItem, ListItemText, TextField} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useEffect, useContext, useState} from 'react';
import Layout from '../components/Layout';
import {Store} from '../utils/Store';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import axios from 'axios';
import {Controller, useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import {getError} from '../utils/error';

function Profile() {
  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue
  } = useForm();
  const classes = useStyles();
  const {state, dispatch} = useContext(Store);
  const {userInfo} = state;
  const router = useRouter();
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async ({password, confirmPassword, name, email}) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords are not matching', {variant: 'error'});
      return;
    }
    try {
      setLoading(true);
      const {
        data: {user, token}
      } = await axios.put('/api/users/profile', {name, email, password}, {headers: {authorization: `Bearer ${userInfo.token}`}});
      setLoading(false);
      enqueueSnackbar('Profile updated successfully', {variant: 'success'});
      dispatch({type: 'USER_LOGIN', payload: {...user, token}});
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), {variant: 'error'});
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  }, []);

  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card className={classes.section}>
              <List>
                <ListItem button component='a'>
                  <NextLink href='/profile' passHref selected>
                    <ListItemText>Profile</ListItemText>
                  </NextLink>
                </ListItem>
                <ListItem button component='a'>
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
                  Profile
                </Typography>
              </ListItem>
              <List>
                <ListItem>
                  <Controller
                    name='name'
                    control={control}
                    rules={{required: true, minLength: 4}}
                    render={({field}) => (
                      <TextField
                        variant='outlined'
                        label='Name'
                        fullWidth
                        inputProps={{type: 'text'}}
                        {...field}
                        error={Boolean(errors.name)}
                        helperText={errors.name ? (errors.name.type === 'required' ? 'Name is required' : 'Name should conatain min 4 characters') : ''}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='email'
                    control={control}
                    rules={{required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/}}
                    render={({field}) => (
                      <TextField
                        variant='outlined'
                        label='Email'
                        fullWidth
                        inputProps={{type: 'email'}}
                        {...field}
                        error={Boolean(errors.email)}
                        helperText={errors.email ? (errors.email.type === 'pattern' ? 'Email is invalid' : 'Email is required') : ''}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='password'
                    control={control}
                    rules={{minLength: 4}}
                    render={({field}) => (
                      <TextField
                        variant='outlined'
                        label='Password'
                        fullWidth
                        inputProps={{type: 'password'}}
                        {...field}
                        error={Boolean(errors.password)}
                        helperText={errors.password ? 'Password should contain minimum 4 characters' : ''}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{minLength: 4}}
                    render={({field}) => (
                      <TextField
                        variant='outlined'
                        label='Confirm Password'
                        fullWidth
                        inputProps={{type: 'password'}}
                        {...field}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword ? 'Confirm Password should contain minimum 4 characters' : ''}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Button color='primary' variant='contained' fullWidth onClick={handleSubmit(handleUpdate)}>
                    Update
                  </Button>
                </ListItem>
              </List>
            </List>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), {ssr: false});
