const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
        ,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true
        ,
        select: false
    }

    ,
    createdAt: {
        type: Date,
        default: Date.now
    }
    ,
    phone: {
        type: String,
        required: false,
        trim: true
    }
,
role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String, 
    passwordResetExpires: Date   

})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password =await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // remove passwordConfirm from the database
    next();
})
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChanged) {
        const changedTimestamp = parseInt(this.passwordChanged.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false; 
};
userSchema.methods.creatPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken, passwordResetToken: this.passwordResetToken });
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000; 
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;