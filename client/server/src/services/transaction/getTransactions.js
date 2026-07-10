const Transaction = require("../../models/transaction.model");

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (d) =>
  new Date(d).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatTransaction = (txn) => ({
  id: txn._id,
  date: formatDate(txn.createdAt),
  time: formatTime(txn.createdAt),
  sponsor: txn.isAnonymous ? "Anonymous Sponsor" : txn.sponsorName,
  isAnonymous: txn.isAnonymous,
  type: txn.type,
  network: txn.network,
  amount:
    txn.quantityUnit === "GB"
      ? `${txn.quantity}GB`
      : `₦${txn.quantity.toLocaleString()}.00`,
  valuedAt:
    txn.quantityUnit === "GB" ? `₦${txn.valueNaira.toLocaleString()}.00` : null,
  status: txn.status,
  reference: txn.reference,
});

const getTransactions = async (
  userId,
  { type, status, search, page = 1, limit = 20 },
) => {
  const query = { recipient: userId };

  if (type && type !== "All") query.type = type;
  if (status && status !== "All") query.status = status;
  if (search) query.sponsorName = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const [transactions, totalCount] = await Promise.all([
    Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(query),
  ]);

  return {
    transactions: transactions.map(formatTransaction),
    totalCount,
    page: Number(page),
    totalPages: Math.ceil(totalCount / Number(limit)),
  };
};

module.exports = getTransactions;
