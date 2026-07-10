const { getOrCreateLink } = require("../../services/recharge/createLink");

const getMyLinkController = async (req, res) => {
  try {
    const result = await getOrCreateLink(req.user._id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getMyLinkController;
