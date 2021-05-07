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

    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    return next(User.checkDuplicateUsername(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.authenticate(req.body);

    const token = createResponseToken(user, accessToken);

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
};
