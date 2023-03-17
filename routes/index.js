var express = require('express');
var router = express.Router();

const CandidatesSearchController = require('../controllers/candidatesSearch');

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

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/dashboard', isAuthenticated, function (req, res, next) {
  res.render('accounts/dashboard');
})

router.get('/candidates-search', isEmployerOrSelf, CandidatesSearchController.search);

module.exports = router;
