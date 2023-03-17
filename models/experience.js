'use strict';

module.exports = (sequelize, DataTypes) => {
    const Experience = sequelize.define('Experience', {
        lineOne: {
            type: DataTypes.STRING
        },
        lineTwo: {
            type: DataTypes.STRING
        },
        dateFrom: {
            type: DataTypes.DATEONLY
        },
        dateTo: {
            type: DataTypes.DATEONLY
        },
        experience: {
            type: DataTypes.TEXT
        }
    }, {});
    Experience.associate = function (models) { };
    return Experience;
};
