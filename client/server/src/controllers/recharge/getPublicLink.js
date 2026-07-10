const getPublicLink = require("../../services/recharge/getPublicLink");

const getPublicLinkController = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await getPublicLink(username);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = getPublicLinkController;
