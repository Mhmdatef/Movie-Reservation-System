const User = require('../Models/UserModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');   
const { createToken } = require('../utils/create.token');
const appError = require('../utils/appError');
const sendEmail = require('../utils/Email');
exports.signup = async (req, res) => {
    try {
        const { name, email, password, passwordConfirm, phone } = req.body;
        // Validate input
        if (!name || !email || !password || !passwordConfirm) { 
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password,
            passwordConfirm,
            phone,
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ 
            user:newUser,
            message: 'User created successfully'
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.log_in = async (request, response, next) => {
    console.log(request.body);

    const { email, password } = request.body;

    if (!email || !password)
        return response.status(400).send("Please provide email and password");

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return response.status(400).send("user not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return response.status(400).send("Incorrect email or password");
    }
    // If the email and password are correct, create a token
    await createToken(user, 200, response);
};
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError('There is no user with that email address', 404));
    }
  // Generate a reset token
  const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
try {
    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
    });
    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
    });


}catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
console.error('Error sending email: ', err);
return res.status(500).json({ message: 'There was an error sending the email.', error: err.message });
}
};

exports.resetPassword = async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user= await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
        return next(new appError('Token is invalid or has expired', 400));
    }
    // Update the user's password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // Log the user in, send JWT
   const token= await createToken(user, 200, res);
res.status(200).json({
        status: 'success',
        message: 'Password reset successful',
        token: token,
    });
};
