import React, {useState, useContext, useEffect} from 'react';
import {Button, TextField, Typography, List, ListItem, Link} from '@material-ui/core';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';
import {Store} from '../utils/Store';
import {useRouter} from 'next/router';

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const {dispatch, state} = useContext(Store);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {redirect} = router.query;

  const handleLogin = async () => {
    try {
      const {
        data: {user, token}
      } = await axios.post('/api/users/login', {email, password});
      dispatch({type: 'USER_LOGIN', payload: {...user, token}});
      router.push(redirect ? redirect : '/');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error);
    }
  };

  useEffect(() => {
    if (state.userInfo) {
      router.push('/');
    }
  }, []);

  return (
    <Layout>
      <form className={classes.loginForm}>
        <Typography component='h1' variant='h1'>
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField variant='outlined' label='Email' value={email} fullWidth inputProps={{type: 'email'}} onChange={(e) => setEmail(e.target.value)} />
          </ListItem>
          <ListItem>
            <TextField variant='outlined' label='Password' fullWidth inputProps={{type: 'password'}} onChange={(e) => setPassword(e.target.value)} value={password} />
          </ListItem>
          <ListItem>
            <Button color='primary' variant='contained' fullWidth onClick={handleLogin}>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Already have account?&nbsp;
            <NextLink href='/register' passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
