const loginUser = require("../../services/auth/loginUser.service");

const loginUserController = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = loginUserController;
