var express = require('express');

const CVsController = require('../controllers/cv');

var router = express.Router();

function isEmployerOrSelf(req, res, next) {
    if (req.user && (req.user.isEmployer || req.user.id == req.params.userId)) {
        next();
    } else {
        res.status(404).send('Not found');
    }
}

function isAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/accounts/signin/');
    }
}

router.get('/', isAuthenticated, CVsController.edit);
router.get('/:userId/preview/', isEmployerOrSelf, CVsController.preview);
router.post('/personal-details/', CVsController.editPersonalDetails);
router.post('/experience/', CVsController.addExperience);
router.post('/experience/:id/', CVsController.editExperience);
router.post('/education/', CVsController.addEducation);
router.post('/education/:id/', CVsController.editEducation);
router.post('/skill/', CVsController.addSkill);
router.post('/skill/:id/', CVsController.editSkill);

module.exports = router;
