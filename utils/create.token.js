const jwt = require("jsonwebtoken");

const tokenGenerator = async (id) => {
    const token = jwt.sign(
        { id },
        process.env.SECRET,
        { expiresIn: process.env.EXPIRATION }
    )
    
    return token;
}

exports.createToken = async (user, statusCode, response) => {
    const token = await tokenGenerator(user._id);

    
    user.password = undefined;

    response.status(statusCode).json({
        status: 'success',
        data: {
            token,
            user
        }
    });
}

