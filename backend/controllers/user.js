const User = require("../models/user");

const searchUsers = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const userId = req.id;

  const keyword = req.query.user
    ? {
        $or: [
          { name: { $regex: req.query.user, $options: "i" } },
          { email: { $regex: req.query.user, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: userId } });
  res.status(200).send(users);
};

module.exports = {searchUsers}
