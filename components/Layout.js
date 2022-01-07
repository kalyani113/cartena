import React, {useContext} from 'react';
import Head from 'next/head';
import {AppBar, Toolbar, Typography, Container, Link, createTheme, ThemeProvider, CssBaseline, Switch, Badge} from '@material-ui/core';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import {Store} from '../utils/Store';
import Cookies from 'js-cookie';

export default function Layout({children, title, description}) {
  const {state, dispatch} = useContext(Store);
  const classes = useStyles();
  const {darkMode, cart} = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0'
      }
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000'
      },
      secondary: {
        main: '#208080'
      }
    }
  });

  const darkModeChangeHandler = () => {
    dispatch({type: darkMode? 'DARK_MODE_OFF': 'DARK_MODE_ON'});
    Cookies.set('darkMode', !darkMode ? 'ON' : 'OFF');
  }
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazon` : 'Next Amazon'}</title>
        {description && <meta name='description' content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' className={classes.appBar}>
          <Toolbar>
            <NextLink href='/' passHref>
              <Link>
                <Typography className={classes.logo}>Amazon</Typography>
              </Link>
            </NextLink>
            <div className={classes.flexGrow}></div>
            <Switch checked={darkMode} onChange={darkModeChangeHandler}></Switch>
            <NextLink href='/cart' passHref>
              <Link>
                {cart?.cartItems?.length ? (
                  <Badge color='secondary' badgeContent={state.cart?.cartItems?.length}>
                    Cart
                  </Badge>
                ) : (
                  'Cart'
                )}
              </Link>
            </NextLink>
            <NextLink href='/login' passHref>
              <Link>Login</Link>
            </NextLink>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Next Amazona.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
