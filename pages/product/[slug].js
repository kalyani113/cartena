import {useRouter} from 'next/router';
import React from 'react';
import data from '../../utils/dummy-data';
import Layout from '../../components/Layout';
import {Grid, Link, List, ListItem, Typography, Button, Card} from '@material-ui/core';
import Image from 'next/Image';
import NextLink from 'next/link';
import useStyles from '../../utils/styles';

export default function ProductDescription() {
  const classes = useStyles();
  const router = useRouter();
  const {slug} = router.query;
  const reqProduct = data.products.find((i) => i.slug === slug);
  if (!reqProduct) {
    return <div>Product not found..</div>;
  }
  return (
    <Layout title={reqProduct.name} description={reqProduct.description}>
      <div className={classes.linkToBack}>
        <NextLink href='/' passHref>
          <Link><Typography>Back to products</Typography></Link>
        </NextLink>
      </div>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Image src={reqProduct.image} alt={reqProduct.name} width={600} height={700} layout='responsive' />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component='h1' variant='h1'>{reqProduct.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {reqProduct.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {reqProduct.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {reqProduct.rating} stars ({reqProduct.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography> Description: {reqProduct.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${reqProduct.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{reqProduct.countInStock > 0 ? 'In stock' : 'Unavailable'}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button fullWidth color='secondary' variant='contained'>
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
