const User= require('../Models/UserModel');
const hanlerFactory = require('../Controllers/handlerFactoryController');
const Reservation = require('../Models/ReservationModel');
const bcrypt = require('bcrypt');
const {createToken} = require('../utils/create.token');

// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const { path } = require('../app');

exports.getAllUsers = hanlerFactory.getAll(User ) ;
exports.updateUser = hanlerFactory.updateOne(User);
exports.deleteUser = hanlerFactory.deleteOne(User);

// Get all reservations for a user
exports.getUserReservations = async (req, res) => {
    const userId = req.user._id;
    try {
        const reservations = await Reservation.find({ userId })
            .populate({
                path: 'showTimeId',
                select: 'hall showDate showTime _id',
                populate: {
                    path: 'movieId',
                    select: 'title -_id'
                }
            }).
            populate({
                path: 'seatsIds',
                select: 'seatNumber '
            });
        res.status(200).json({
            status: 'success',
            data: reservations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.MakeUserAdmin = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = 'admin';
        await user.save();
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getUser = async (req, res) => {
    const userId = req.user._id; // Get the user ID from the token
    try {
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updatePassword = async (request, response, next) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = request.body;

        // Validate input
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return response.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmNewPassword) {
            return response.status(400).json({ message: "Passwords do not match" });
        }

        // Find the user by ID and include the password field
        const user = await User.findById(request.user._id).select('+password');

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Check if the current password is correct
        const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordCorrect) {
            return next(new AppError("Current password is incorrect", 401));
        }

        // Update password
        user.password = newPassword;
        user.passwordConfirm = confirmNewPassword;
        await user.save();

        // Create and send new token
        await createToken(user, 200, response);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};