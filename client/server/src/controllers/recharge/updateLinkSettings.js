const updateLinkSettings = require("../../services/recharge/updateLinkSettings");

const updateLinkSettingsController = async (req, res) => {
  try {
    const result = await updateLinkSettings(req.user._id, req.body);

    res
      .status(200)
      .json({ message: "Link settings updated.", settings: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateLinkSettingsController;
