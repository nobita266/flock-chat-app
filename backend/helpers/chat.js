const Chat = require("../models/chat");
const User = require("../models/user");

class ChatHelper {
  constructor() {}
  async getChat({ userId, recieverUserId }) {
    let requiredChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: recieverUserId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    requiredChat = await User.populate(requiredChat, {
      path: "latestMessage.sender",
      select: "name email",
    });
    return requiredChat[0];
  }

  async createNewChat({chatData}){
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    return fullChat;
  }
}

module.exports = ChatHelper;
