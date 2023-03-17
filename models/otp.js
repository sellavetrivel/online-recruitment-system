'use strict';

const crypto = require('crypto');

const OTP_CODE_LENGTH = 6;

module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});

  OTP.associate = function (models) {
    OTP.belongsTo(models.User);
  };

  OTP.generate = async function (userId) {
    if (!userId) {
      throw new Error(`
        The argument - userId is missing.
        The generation of an OTP requires a userId.
      `)
    }

    const code = crypto.randomBytes(Math.ceil(OTP_CODE_LENGTH / 2)).toString('hex');

    return OTP.create({ code: code, UserId: userId })
  }

  return OTP;
};
