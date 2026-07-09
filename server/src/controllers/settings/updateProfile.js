const updateProfile = require("../../services/settings/updateProfile");

const updateProfileController = async (req, res) => {
  try {
    const user = await updateProfile(req.user._id, req.body);

    res.status(200).json({ message: "Profile updated.", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = updateProfileController;
