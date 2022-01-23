import React, {useContext} from 'react';
import Head from 'next/head';
import {AppBar, Toolbar, Typography, Container, Link, createTheme, ThemeProvider, CssBaseline, Switch, Badge, Button, Menu, MenuItem} from '@material-ui/core';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import {Store} from '../utils/Store';
import Cookies from 'js-cookie';
import {useRouter} from 'next/router';

export default function Layout({children, title, description}) {
  const {state, dispatch} = useContext(Store);
  const classes = useStyles();
  const {darkMode, cart, userInfo} = state;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
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
    dispatch({type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON'});
    Cookies.set('darkMode', !darkMode ? 'ON' : 'OFF');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const handleLogout = () => {
    dispatch({type:'USER_LOGOUT'});
    setAnchorEl(null);
    router.push('/');
  }

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Cartena` : 'Cartena'}</title>
        {description && <meta name='description' content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' className={classes.appBar}>
          <Toolbar>
            <NextLink href='/' passHref>
              <Link>
                <Typography className={classes.logo}>Cartena</Typography>
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
            {userInfo ? (
              <Button onClick={(e)=>handleClick(e)} className={classes.navbarButton}>{userInfo.name}</Button>
            ) : (
              <NextLink href='/login' passHref>
                <Link>Login</Link>
              </NextLink>
            )}
          </Toolbar>
        </AppBar>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          <MenuItem onClick={()=>handleClose('/profile')}>Profile</MenuItem>
          <MenuItem onClick={()=>handleClose('/orderHistory')}>Order History</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Cartena.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
