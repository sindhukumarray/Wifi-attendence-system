const { sendSuccess, sendError } = require('../utils/response');
const authService = require('../services/authService');

const registerController = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    
    return sendSuccess(res, `${req.body.role} registered successfully`, {
      user
    }, 201);
  } catch (error) {
    // If it's our custom thrown error, send it as 400 Bad Request
    return sendError(res, error.message, null, 400);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const { user, token } = await authService.login(email, password, role);

    return sendSuccess(res, 'Login successful', {
      token,
      user: {
        ...user,
        role // explicitly append role so client knows their authorization level
      }
    });
  } catch (error) {
    return sendError(res, error.message, null, 401);
  }
};

const profileController = async (req, res) => {
  // If we reach here, the protect middleware has already validated the JWT
  // and attached req.user
  return sendSuccess(res, 'Profile retrieved successfully', {
    user: req.user
  });
};

module.exports = {
  registerController,
  loginController,
  profileController
};
