import React, {useContext, useEffect} from 'react';
import {Button, TextField, Typography, List, ListItem, Link} from '@material-ui/core';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';
import {Store} from '../utils/Store';
import {useRouter} from 'next/router';
import {useForm, Controller} from 'react-hook-form';
import { useSnackbar } from 'notistack';

export default function Login() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const {dispatch, state} = useContext(Store);
  const {redirect} = router.query;
  const {
    handleSubmit,
    control,
    formState: {errors}
  } = useForm();

  const handleLogin = async ({email, password}) => {
    closeSnackbar();
    try {
      const {
        data: {user, token}
      } = await axios.post('/api/users/login', {email, password});
      dispatch({type: 'USER_LOGIN', payload: {...user, token}});
      router.push(redirect ? redirect : '/');
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || error, {variant: 'error'});
    }
  };

  useEffect(() => {
    if (state.userInfo) {
      router.push('/');
    }
  }, []);

  return (
    <Layout>
      <form className={classes.form} onSubmit={handleSubmit(handleLogin)}>
        <Typography component='h1' variant='h1'>
          Login
        </Typography>
        <List>
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
              rules={{required: true, minLength: 4}}
              render={({field}) => (
                <TextField
                  variant='outlined'
                  label='Password'
                  fullWidth
                  inputProps={{type: 'password'}}
                  {...field}
                  error={Boolean(errors.password)}
                  helperText={errors.password ? (errors.password.type === 'minLength' ? 'Password should contain minimum 4 characters' : 'Password is required') : ''}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button type='submit' color='primary' variant='contained' fullWidth>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don&apos;t have account?&nbsp;
            <NextLink href={`/register?redirect=${redirect ? redirect : '/'}`} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
