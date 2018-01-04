const jwt = require('jsonwebtoken');
// const { JWT_SECRET: secret } = process.env;
// console.log('token file initialized....');

function generateToken(payload, subject) {
  const { JWT_SECRET: secret } = process.env;
  return new Promise(
    (resolve, reject) => {
      jwt.sign(payload, secret, {
        issuer: 'localhost.com',
        expiresIn: '7d',
        subject
      }, (error, token) => {
        if(error) reject(error);
        resolve(token);
      });
    }
  );
}

function decodeToken(token) {
  const { JWT_SECRET: secret } = process.env;
  return new Promise(
    (resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if(error) reject(error);
        resolve(decoded);
      });
    }
  );
}

exports.generateToken = generateToken;
exports.decodeToken = decodeToken;