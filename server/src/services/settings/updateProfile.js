const User = require("../../models/user.model");

const VALID_NETWORKS = ["MTN", "Airtel", "Glo", "9mobile"];

const updateProfile = async (userId, updates) => {
  const allowedFields = ["name", "phone", "profileMessage", "avatar", "network"];

  if (updates.network && !VALID_NETWORKS.includes(updates.network)) {
    throw new Error("Please select a valid network.");
  }
  const payload = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) payload[field] = updates[field];
  }

  if (updates.phone) {
    const existingPhone = await User.findOne({
      phone: updates.phone,
      _id: { $ne: userId },
    });
    if (existingPhone)
      throw new Error("Phone number already in use by another account.");
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) throw new Error("User not found.");

  return user;
};

module.exports = updateProfile;
