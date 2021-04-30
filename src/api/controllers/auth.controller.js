const httpStatus = require('http-status');
const { User } = require('../models');

const createResponseToken = (user, accessToken) => {
  const tokenType = 'Bearer';
  // const refreshToken = RefreshToken.generate(user).token;
  // const expiresIn = moment().add(jwtExpirationInterval, 'minutes');

  return {
    tokenType,
    accessToken,
    // refreshToken,
    // expiresIn,
  };
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const token = createResponseToken(user, user.token());

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};