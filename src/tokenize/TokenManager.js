const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  // generateAccessToken(payload) {
  //   return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  // },
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken); // UNTUK MEN-DECODED TOKEN
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY); // VERIFIKASI
      /*
        Fungsi verifySignature ini akan mengecek apakah refresh token memiliki
        signature yang sesuai atau tidak. Jika hasil verifikasi sesuai, fungsi ini akan lolos.
        Namun bila tidak, maka fungsi ini akan membangkitkan eror.
      */
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
