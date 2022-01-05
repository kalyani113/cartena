import Layout from '../components/Layout';
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button} from '@material-ui/core';
import data from '../utils/dummy-data';
import NextLink from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing='3'>
          {data.products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia component='img' height='500' image={product.image} alt={product.name} />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size='small' color='primary'>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}
