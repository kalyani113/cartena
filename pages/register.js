import {Typography, List, ListItem, TextField, Button, Link} from '@material-ui/core';
import React, {useContext, useState} from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import axios from 'axios';
import {Store} from '../utils/Store';

export default function Register() {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {redirect} = router.query;
  const {dispatch} = useContext(Store);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords are not matching');
      return;
    }
    try {
      const {
        data: {user, token}
      } = await axios.post('/api/users/register', {name, email, password});
      dispatch({type: 'USER_LOGIN', payload: {...user, token}});
      router.push(redirect ? redirect : '/');
    } catch (error) {
      alert(error.response?.data?.message || error);
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
            <TextField variant='outlined' label='Name' fullWidth inputProps={{type: 'name'}} onChange={(e) => setName(e.target.value)} value={name} />
          </ListItem>
          <ListItem>
            <TextField variant='outlined' label='Email' value={email} fullWidth inputProps={{type: 'email'}} onChange={(e) => setEmail(e.target.value)} />
          </ListItem>
          <ListItem>
            <TextField variant='outlined' label='Password' fullWidth inputProps={{type: 'password'}} onChange={(e) => setPassword(e.target.value)} value={password} />
          </ListItem>
          <ListItem>
            <TextField variant='outlined' label='Confirm Password' fullWidth inputProps={{type: 'password'}} onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
          </ListItem>
          <ListItem>
            <Button color='primary' variant='contained' fullWidth onClick={handleRegister}>
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
