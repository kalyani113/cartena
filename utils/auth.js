import jwt from 'jsonwebtoken';

export const gerenateToken = async (user) => {
  const token = await jwt.sign(
    {
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    },
    process.env.JWT_SECRET_KEY,
    {expiresIn: '1h'}
  );
  return token;
};

export const isAuth = async (req, res, next) => {
  const {authorization} = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) {
        res.status(401).send({message: 'Token is not valid'});
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({message: 'Token is missinng'});
  }
};
