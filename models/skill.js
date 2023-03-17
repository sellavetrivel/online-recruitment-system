'use strict';

module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define('Skill', {
        skill: {
            type: DataTypes.STRING
        },
        proficiency: {
            type: DataTypes.STRING
        }
    }, {});
    Skill.associate = function (models) { };
    return Skill;
};
