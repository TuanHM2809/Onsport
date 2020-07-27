const jwt = require("jsonwebtoken");
const encode = (data, cert) => jwt.sign(data, cert, { algorithm: "RS256" });
const verify = (token, pubKey) => {
  try {
    if (pubKey) {
      return jwt.verify(token, pubKey);
    }
    return 0;
  } catch (err) {
    return err;
  }
};

const decode = token => jwt.decode(token);

module.exports = {
  encode,
  verify,
  decode
};
