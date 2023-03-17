'use strict';

const { JobSeeker, Experience, Education, Skill } = require('../models');

exports.preview = async (req, res) => {
    const jobSeeker = await JobSeeker.findOne({ where: { UserId: req.params.userId } });
    const experiences = await Experience.findAll({ where: { JobSeekerId: jobSeeker.id } });
    const education = await Education.findAll({ where: { JobSeekerId: jobSeeker.id } });
    const skills = await Skill.findAll({ where: { JobSeekerId: jobSeeker.id } });
    res.render('cv/preview', { 'jobSeeker': jobSeeker, 'experiences': experiences, 'education': education, 'skills': skills });
};

exports.edit = async (req, res) => {
    const jobSeeker = await JobSeeker.findOne({ where: { UserId: req.user.id } });
    const experiences = await Experience.findAll({ where: { JobSeekerId: jobSeeker.id } });
    const education = await Education.findAll({ where: { JobSeekerId: jobSeeker.id } });
    const skills = await Skill.findAll({ where: { JobSeekerId: jobSeeker.id } });
    res.render('cv/cv', { 'jobSeeker': jobSeeker, 'experiences': experiences, 'education': education, 'skills': skills });
};

exports.editPersonalDetails = async (req, res) => {
    const input = Object.assign(req.body);

    // Sanitization and validation can be added here (if required).

    try {
        await JobSeeker.update({
            firstName: input.firstName,
            lastName: input.lastName,
            profession: input.profession,
            email: input.email,
            phoneNumber: input.phoneNumber,
            dateOfBirth: input.dateOfBirth ? input.dateOfBirth : null,
            yearsOfExperience: input.yearsOfExperience
        }, {
            where: { UserId: req.user.id }
        });
        req.flash('success', 'Your personal details were updated.');
    } catch (error) {
        req.flash('error', 'Your personal details could not be updated. Please try again later.');
    }

    res.redirect('/cv/');
};

exports.addExperience = async (req, res) => {
    const input = Object.assign(req.body);

    // Sanitization and validation can be added here (if required).

    const jobSeeker = await JobSeeker.findOne({ where: { UserId: req.user.id } });

    try {
        await Experience.create({
            lineOne: input.lineOne,
            lineTwo: input.lineTwo,
            dateFrom: input.dateFrom ? input.dateFrom : null,
            dateTo: input.dateTo ? input.dateTo : null,
            experience: input.experience,
            JobSeekerId: jobSeeker.id
        });
        req.flash('success', 'Your experience details were added.');
    } catch (error) {
        req.flash('error', 'Your experience details could not be added. Please try again later.');
    }

    res.redirect('/cv/');
}

exports.editExperience = async (req, res) => {
    const input = Object.assign(req.body);

    // Sanitization and validation can be added here (if required).

    if ("save" in input) {
        try {
            await Experience.update({
                lineOne: input.lineOne,
                lineTwo: input.lineTwo,
                dateFrom: input.dateFrom ? input.dateFrom : null,
                dateTo: input.dateTo ? input.dateTo : null,
                experience: input.experience,
            }, {
                where: { id: req.params.id }
            });
            req.flash('success', 'Your experience details were updated.');
        } catch (error) {
            req.flash('error', 'Your experience details could not be udpated. Please try again later.');
        }
    } else if ("delete" in input) {
        try {
            await Experience.destroy({ where: { id: req.params.id } });
            req.flash('success', 'Your experience details were deleted.');
        } catch (Error) {
            req.flash('error', 'Your experience details could not be deleted. Please try again later.');
        }
    }

    res.redirect('/cv/');
}

exports.addEducation = async (req, res) => {
    const input = Object.assign(req.body);

    // Sanitization and validation can be added here (if required).

    const jobSeeker = await JobSeeker.findOne({ where: { UserId: req.user.id } });

    try {
        await Education.create({
            school: input.school,
            dateFrom: input.dateFrom ? input.dateFrom : null,
            dateTo: input.dateTo ? input.dateTo : null,
            description: input.description,
            JobSeekerId: jobSeeker.id
        });
        req.flash('success', 'Your education details were added.');
    } catch (erro) {
        req.flash('error', 'Your education details could not be added. Please try again later.');
    }

    res.redirect('/cv/');
};

exports.editEducation = async (req, res) => {
    const input = Object.assign(req.body);

    // Sanitization and validation can be added here (if required).

    if ("save" in input) {
        try {
            await Education.update({
                school: input.school,
                dateFrom: input.dateFrom ? input.dateFrom : null,
                dateTo: input.dateTo ? input.dateTo : null,
                description: input.description
            }, {
                where: { id: req.params.id }
            });
            req.flash('success', 'Your education details were updated.');
        } catch (error) {
            req.flash('error', 'Your education details could not be updated. Please try again later.');
        }
    } else if ("delete" in input) {
        try {
            await Education.destroy({ where: { id: req.params.id } });
            req.flash('success', 'Your education details were deleted.');
        } catch (error) {
            req.flash('error', 'Your education details could not be deleted. Please try again later.');

        }
    }
    res.redirect('/cv/');
};

exports.addSkill = async (req, res) => {
    const input = Object.assign(req.body);

    // Sanitization and validation can be added here (if required).

    const jobSeeker = await JobSeeker.findOne({ where: { UserId: req.user.id } });

    try {
        await Skill.create({
            skill: input.skill,
            proficiency: input.proficiency,
            JobSeekerId: jobSeeker.id
        });
        req.flash('success', 'Your skill details were added.');
    } catch (error) {
        req.flash('error', 'Your skill details could not be added. Please try again later.');
    }

    res.redirect('/cv/');
};

exports.editSkill = async (req, res) => {
    const input = Object.assign(req.body);

    // Sanitization and validation can be added here (if required).

    if ("save" in input) {
        try {
            await Skill.update({
                skill: input.skill,
                proficiency: input.proficiency
            }, {
                where: { id: req.params.id }
            });
            req.flash('success', 'Your skill details were updated.');
        } catch (error) {
            req.flash('error', 'Your skill details could not be updated. Please try again later.');
        }
    } else if ("delete" in input) {
        try {
            await Skill.destroy({ where: { id: req.params.id } });
            req.flash('success', 'Your skill details were deleted.');
        } catch (error) {
            req.flash('error', 'Your skill details could not be deleted. Please try again later.');
        }
    }

    res.redirect('/cv/');
};
