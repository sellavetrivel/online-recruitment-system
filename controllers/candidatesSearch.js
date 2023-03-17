'use strict';

const { Op } = require('sequelize');
const { User, JobSeeker, Skill, Education } = require('../models');


exports.search = async (req, res) => {
   const skillsRequired = req.query.skills ? req.query.skills.split(',').map(skill => skill.trim()) : [];
   const yearsOfExperience = req.query.yearsOfExperience ? req.query.yearsOfExperience : 0;
   const qualificationsRequired = req.query.qualifications ? req.query.qualifications.split(',').map(skill => skill.trim()) : [];

   const candidateWithRequiredYearsOfExperienceIds = await JobSeeker.findAll({
      attributes: ['id'],
      where: {
         yearsOfExperience: {
            [Op.gte]: yearsOfExperience
         }
      }
   }).map(candidate => candidate.get('id'));

   let candidatesWithRequiredSkillsAndYearsOfExperience = [];

   for (let candidateId of candidateWithRequiredYearsOfExperienceIds) {
      const skillsInCurrentCandidate = await Skill.findAll({
         attributes: ['skill'],
         where: {
            JobSeekerId: candidateId
         }
      }).map(skill => skill.get('skill'));

      if (skillsRequired.every(skill => skillsInCurrentCandidate.includes(skill))) {
         candidatesWithRequiredSkillsAndYearsOfExperience.push(candidateId);
      }
   }

   let requiredCandidatesWithAllCriteria = [];

   for (let candidateId of candidatesWithRequiredSkillsAndYearsOfExperience) {
      const qualificationsInCurrentCandidate = await Education.findAll({
         attributes: ['description'],
         where: {
            JobSeekerId: candidateId
         }
      }).map(skill => skill.get('description'));


      let doesCandidateHasThisQualification = false;
      for (let q1 of qualificationsRequired) {
         q1 = q1.toLowerCase();
         
         if (qualificationsInCurrentCandidate.length == 0) {
            doesCandidateHasThisQualification = false;
            break;
         }

         doesCandidateHasThisQualification = false;

         for (let q2 of qualificationsInCurrentCandidate) {
            q2 = q2.toLowerCase();
            
            if (q2.indexOf(q1) > -1 || q1.indexOf(q2) > -1) {
               doesCandidateHasThisQualification = true;
               break;
            }
         }

         if (!doesCandidateHasThisQualification) {
            break;
         }
      }

      if (qualificationsRequired.length == 0 || doesCandidateHasThisQualification) {
         requiredCandidatesWithAllCriteria.push(candidateId);
      }
   }

   const candidates = await JobSeeker.findAll({
      where: {
         id: requiredCandidatesWithAllCriteria
      }
   })

   res.render('candidate-search', { 'candidates': candidates, 'skills': req.query.skills, 'yearsOfExperience': req.query.yearsOfExperience, 'qualifications': req.query.qualifications });
};
