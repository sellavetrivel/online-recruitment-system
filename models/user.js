'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isJobSeeker: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isEmployer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});
  User.associate = function (models) {
    User.hasMany(models.OTP);
    User.hasMany(models.AuthToken);
    User.hasOne(models.JobSeeker);
  };
  return User;
};
