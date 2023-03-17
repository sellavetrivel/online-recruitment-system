'use strict';

const crypto = require('crypto');

const AUTH_TOKEN_LENGTH = 32;

module.exports = (sequelize, DataTypes) => {
  const AuthToken = sequelize.define('AuthToken', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {});

  AuthToken.associate = function (models) {
    AuthToken.belongsTo(models.User);
  };

  AuthToken.generate = async function (userId) {
    if (!userId) {
      throw new Error(`
        The argument - userId is missing.
        The generation of an authentication token requires a userId.
      `)
    }

    let token = crypto.randomBytes(Math.ceil(AUTH_TOKEN_LENGTH / 2)).toString('hex');

    return AuthToken.create({ token, userId })
  }

  return AuthToken;
};