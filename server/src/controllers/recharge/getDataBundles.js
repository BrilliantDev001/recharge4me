const getDataBundles = require("../../services/recharge/getDataBundles");

const getDataBundlesController = async (req, res) => {
  try {
    const { username } = req.params;
    const bundles = await getDataBundles(username);

    res.status(200).json({ bundles });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getDataBundlesController;
