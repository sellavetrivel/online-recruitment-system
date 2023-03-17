'use strict';

const { User, AuthToken } = require('../models');

module.exports = async function(req, res, next) {

  // Look for "auth_token" in the cookies.
  const token = req.cookies.auth_token;

  // If "auth_token" is found, we will try to find it's associated user.
  // If there is one, we attach it to the "req" object, so that any
  // following middleware, routing and controller logic will have access to
  // the authenticated user.
  if (token) {
    const authToken = await AuthToken.findOne({ where: { token }, include: User });
    if (authToken) {
      req.user = authToken.User;
      res.locals.user = authToken.User;
    }
  }

  next();
}
