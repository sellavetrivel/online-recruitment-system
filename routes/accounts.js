const express = require('express');

const AccountsController = require('../controllers/accounts');

const router = express.Router();

router.get('/signin/', function (req, res, next) {
    res.render('accounts/signin');
});
router.post('/signin/', AccountsController.signin);

router.get('/signup/', function (req, res, next) {
    res.render('accounts/signup');
});
router.post('/signup/', AccountsController.signup);

router.get('/email-verification/', function (req, res, next) {
    res.render('accounts/email-verification');
});
router.post('/email-verification/', AccountsController.emailVerification);

router.get('/signout/', AccountsController.signout);

module.exports = router;
