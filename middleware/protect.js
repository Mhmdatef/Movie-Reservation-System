const User = require('./../Models/UserModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
exports.userProtect = catchAsync(async (request, response, next) => {
    let token;

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }

    const token_data = await jwt.verify(token, process.env.SECRET);

    const user = await User.findById(token_data.id);
    if (!user) {
        return next(new AppError('The user associated with this token no longer exists', 401));
    }

    if (user.changedPasswordAfter(token_data.iat)) {
        return next(new AppError('Password was recently changed. Please log in again', 401));
    }

    user.password = undefined;
    request.user = user;

    next();
});

exports.restrictTo = (...roles) => {
    return (request, response, next) => {
        if (!roles.includes(request.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
}


