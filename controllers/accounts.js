'use strict';

const { User, OTP, AuthToken, JobSeeker } = require('../models');
const { isEmptyObject, sendMail } = require('./helpers');
const { constants } = require('./constants');

exports.signup = async (req, res) => {
    const input = Object.assign(req.body);
    const userRole = req.body.role;

    // Validate the provided input.
    let errors = {};
    // Check if "firstName" is empty or not.
    if (!input.firstName) {
        errors['firstName'] = 'This field should not be empty.';
    }
    // Check if the length of "firstName" is valid or not.
    if (input.firstName && input.firstName.length > 255) {
        errors['firstName'] = 'First name cannot be greater than 255 characters.';
    }
    // Check if "firstName" is valid or not.
    if (input.firstName && !(/^[a-zA-Z]+$/.test(input.firstName))) {
        errors['firstName'] = 'First name should consist of uppercase and/or lowercase English alphabets.';
    }
    // Check if "lastName" is empty or not.
    if (!input.lastName) {
        errors['lastName'] = 'This field should not be empty.';
    }
    // Check if the length of "lastName" is valid or not.
    if (input.lastName && input.lastName.length > 255) {
        errors['lastName'] = 'Last name cannot be greater than 255 characters.';
    }
    // Check if "lastName" is valid or not.
    if (input.lastName && !(/^[a-zA-Z]+$/.test(input.lastName))) {
        errors['lastName'] = 'Last name should consist of uppercase and/or lowercase English alphabets.';
    }
    // Check if "email" is empty or not.
    if (!input.email) {
        errors['email'] = 'This field should not be empty.';
    }
    // Check if the length of "email" is valid or not.
    if (input.email && input.email.length > 255) {
        errors['email'] = 'Email cannot be greater than 255 characters.';
    }
    // Check if "email" is valid or not.
    if (input.email && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.email))) {
        errors['email'] = 'This does not seems to be a valid email address.';
    }
    // Check if the "email" has already been used or not.
    const existingUserWithSameEmailAddress = await User.findOne({ where: { email: input.email } });
    if (existingUserWithSameEmailAddress) {
        errors['email'] = 'This email address is already in use.'
    }
    // Check if the "role" provided (in the input) is valid or not.
    // 0 -> 'Job Seeker'
    // 1 -> 'Employer'
    if (!userRole || !['0', '1'].includes(userRole)) {
        errors['role'] = 'You should belong to either of the two roles.'
    }
    // If there are errors, re-render the same view but with errors.
    if (!isEmptyObject(errors)) {
        res.render('accounts/signup', { input: input, errors: errors });
    }

    if (userRole == '0') {
        input.isJobSeeker = true;
    } else {
        input.isJobSeeker = false;
        input.isEmployer = true;
    }

    // Create the user.
    const user = await User.create(Object.assign(input));

    if (user.isJobSeeker) {
        await JobSeeker.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            UserId: user.id
        });
    }

    // Generate an OTP to verify the user's email.
    const otp = await OTP.generate(user.id);

    // Configurations/options for the email(containing the OTP).
    // ToDo: Add an HTML template for the email.
    const mailOptions = {
        from: 'Online Recruitment System <no-reply@online-recruitment-system.com>',
        to: input.email,
        subject: 'Sign in to your Online Recruitment System account',
        text: `
            Hi ${input.firstName},
            use this OTP - "${otp.code}" to sign in to your Online Recruitment System account.
        `
    };

    // Send the email(containing the OTP) to the user's email.
    await sendMail(mailOptions);

    res.redirect('/accounts/email-verification/');
};

exports.signin = async (req, res) => {

    let user;
    let errors = {};
    const email = req.body.email;

    // Check if "email" is empty or not.
    if (!email) {
        errors['email'] = 'This field should not be empty.';
    }
    // Check if "email" is valid or not.
    if (email && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        errors['email'] = 'This does not seems to be a valid email address.';
    } else {
        // If valid, check if any "User" is associated with the "email" or not.
        // Two users with the same email address cannot exist.
        user = await User.findOne({ where: { email: email } });
        if (!user) {
            errors['email'] = 'This email address is not associated with any account.';
        }
    }
    // If there are errors, re-render the same view but with errors.
    if (!isEmptyObject(errors)) {
        res.render('accounts/signin', { email: email, errors: errors });
    }

    // Generate an OTP to verify the user's email.
    const otp = await OTP.generate(user.id);

    // Configurations/options for the email(containing the OTP).
    // ToDo: Add an HTML template for the email.
    const mailOptions = {
        from: 'Online Recruitment System <no-reply@online-recruitment-system.com>',
        to: user.email,
        subject: 'Sign In to Your Online Recruitment System Account',
        text: `
            Hi ${user.firstName}
            
            Use this OTP - "${otp.code}" to sign in to your Online Recruitment System account.
        `
    };

    // Send the email(containing the OTP) to the user's email.
    await sendMail(mailOptions);

    res.redirect('/accounts/email-verification/');
};

exports.emailVerification = async (req, res) => {
    const inputCode = req.body.code;

    let errors = {};
    // Check if the "code" provided in the input is empty or not.
    if (!inputCode) {
        errors['code'] = 'This field should not be empty.';
        res.render('accounts/email-verification', { code: inputCode, errors: errors });
    }
    // Check if the length of the "code" is valid or not.
    if (inputCode && inputCode.length != 6) {
        errors['code'] = 'The OTP must contain a combinations of 6 alphabets and numbers.';
        res.render('accounts/email-verification', { code: inputCode, errors: errors });
    }

    // Fetch the OTP instance, associated with the "code" provided in the input, from the DB.
    let otp = await OTP.findOne({ where: { code: inputCode }, include: [{ model: User, required: true }] });

    // If no OTP instance is associated with the provided "code", the "code" is invalid.
    if (!otp) {
        errors['code'] = 'The OTP entered is invalid.';
        res.render('accounts/email-verification', { code: inputCode, errors: errors });
    }
    // Check if the "code" has been used or not.
    if (otp.isUsed) {
        errors['code'] = 'The OTP has been used.';
        res.render('accounts/email-verification', { code: inputCode, errors: errors });
    }
    // Check if the "code" has expired or not.
    if (otp.isExpired) {
        errors['code'] = 'The OTP has expired.';
        res.render('accounts/email-verification', { code: inputCode, errors: errors });
    }

    // Check if the "code" has expired or not.
    const otpExpiresAt = otp.createdAt + constants.OTP_EXPIRATION_DURATION;
    if (otpExpiresAt < new Date()) {
        otp.isExpired = true;
        await otp.save();

        // Re-render the view with appropriate error messages(s).
        errors['code'] = 'The OTP has expired.';
        res.render('accounts/email-verification', { code: inputCode, errors: errors });
    }

    // No errors?
    // Mark the OTP instance as used, and generate an authorization token for the user. 
    otp.isUsed = true;
    otp.save();

    const authToken = await AuthToken.generate(otp.User.id);
    await otp.User.addAuthToken(authToken);

    // Add the authorization token as an "httpOnly" cookie.
    res.cookie('auth_token', authToken.token, { httpOnly: true, maxAge: 2592000000 });
    res.redirect('/');
};

exports.signout = async (req, res) => {
    const token = req.cookies.auth_token;

    // Delete the authorization token.
    await AuthToken.destroy({ where: { token: token } });

    // Remove the 'auth_token' cookie also.
    res.clearCookie('auth_token');
    res.redirect('/');
}
