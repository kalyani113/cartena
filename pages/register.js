import {Typography, List, ListItem, TextField, Button, Link} from '@material-ui/core';
import React, {useContext} from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import axios from 'axios';
import {Store} from '../utils/Store';
import {Controller, useForm} from 'react-hook-form';
import { useSnackbar } from 'notistack';

export default function Register() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const {redirect} = router.query;
  const {dispatch} = useContext(Store);
  const {
    handleSubmit,
    control,
    formState: {errors}
  } = useForm();

  const handleRegister = async ({password, confirmPassword, name, email}) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords are not matching', {variant: 'error'});
      return;
    }
    try {
      const {
        data: {user, token}
      } = await axios.post('/api/users/register', {name, email, password});
      dispatch({type: 'USER_LOGIN', payload: {...user, token}});
      router.push(redirect ? redirect : '/');
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || error, {variant: 'error'});
    }
  };

  return (
    <Layout>
      <form className={classes.form}>
        <Typography component='h1' variant='h1'>
          Register
        </Typography>
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
            <Controller
              name='confirmPassword'
              control={control}
              rules={{required: true, minLength: 4}}
              render={({field}) => (
                <TextField
                  variant='outlined'
                  label='Confirm Password'
                  fullWidth
                  inputProps={{type: 'password'}}
                  {...field}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword ? (errors.confirmPassword.type === 'minLength' ? 'Confirm Password should contain minimum 4 characters' : 'Confirm Password is required') : ''}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button color='primary' variant='contained' fullWidth onClick={handleSubmit(handleRegister)}>
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have account?&nbsp;
            <NextLink href={`/login?redirect=${redirect ? redirect : '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
