import bcrypt from "bcrypt";

const data = {
  products: [
    {
      name: 'Free Shirt',
      category: 'Shirts',
      image: '/images/shirt1.jpg',
      price: 70,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      slug: 'free-shirt'
    },
    {
      name: 'Fit Shirt',
      category: 'Shirts',
      image: '/images/shirt2.jpg',
      price: 80,
      brand: 'Adidas',
      rating: 4.2,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      slug: 'fit-shirt'
    },
    {
      name: 'Slim Shirt',
      category: 'Shirts',
      image: '/images/shirt3.jpg',
      price: 90,
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      slug: 'slim-shirt'
    },
    {
      name: 'Golf Pants',
      category: 'Pants',
      image: '/images/pants1.jpg',
      price: 90,
      brand: 'Oliver',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'Smart looking pants',
      slug: 'golf-pants'
    },
    {
      name: 'Fit Pants',
      category: 'Pants',
      image: '/images/pants2.jpg',
      price: 95,
      brand: 'Zara',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants',
      slug: 'fit-pants'
    },
    {
      name: 'Classic Pants',
      category: 'Pants',
      image: '/images/pants3.jpg',
      price: 75,
      brand: 'Casely',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants',
      slug: 'classic-pants'
    }
  ],
  users: [
    {
      name: 'admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('admin', 10),
      isAdmin: true
    },
    {
      name: 'kalyani',
      email: 'kalyani.github@gmail.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false
    }
  ]
};
export default data;
