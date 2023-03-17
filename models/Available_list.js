'use strict';

module.exports = (sequelize, DataTypes) => {
    const JobSeeker = sequelize.define('JobSeeker', {
        email: {
            type: DataTypes.STRING
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        profession: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
        },
        bio: {
            type: DataTypes.TEXT
        },
        yearsOfExperience: {
            type: DataTypes.INTEGER,
            default: 0
        }
    }, {});
    JobSeeker.associate = function (models) { 
        JobSeeker.hasMany(models.Experience);
        JobSeeker.hasMany(models.Education);
        JobSeeker.hasMany(models.Skill);
    };
    return JobSeeker;
};
