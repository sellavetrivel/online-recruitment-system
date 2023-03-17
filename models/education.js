'use strict';

module.exports = (sequelize, DataTypes) => {
    const Education = sequelize.define('Education', {
        school: {
            type: DataTypes.STRING
        },
        dateFrom: {
            type: DataTypes.DATEONLY
        },
        dateTo: {
            type: DataTypes.DATEONLY
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {});

    Education.associate = function (models) { };

    return Education;
};
