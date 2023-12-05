const ChatHelper = require("../helpers/chat");
const Chat = require("../models/chat");
const User = require("../models/user");

const accessChats = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const { recieverUserId } = req.body;
  if (!recieverUserId) {
    return res.status(400).json({ msg: "recieved user id is invalid" });
  }
  const userId = req.id;

  if (!userId) {
    return res.status(400).json({ msg: "UserId param not sent with request" });
  }
  const { getChat } = new ChatHelper();
  const chat = await getChat({ userId, recieverUserId });

  if (chat) {
    res
      .status(200)
      .json({ chat, msg: "Successfully fetched already present chat" });
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, recieverUserId],
    };

    try {
      const { createNewChat } = new ChatHelper();
      const chat = await createNewChat({ chatData });
      res.status(200).json({ chat, msg: "Successfully created a new chat" });
    } catch (error) {
      res.status(400).json({ msg: JSON.stringify(error) });
    }
  }
};

const fetchChats = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const userId = req.id;

  try {
    Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).json({ msg: JSON.stringify(error) });
  }
};

const createRoom = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }

  const { roomName } = req.body;
  const userId = req.id;

  if (!userId) {
    return res.status(400).send("UserId param not sent with request");
  }

  const chatData = {
    chatName: roomName,
    isGroupChat: true,
    users: [userId],
  };
  try {
    const isChatNameAlreadyExist = await Chat.findOne({ chatName: roomName });
    if (isChatNameAlreadyExist) {
      return res
        .status(400)
        .json({ msg: "a chat of this name already exists, try another name" });
    }
    await Chat.create(chatData);

    let createdRoom = await Chat.findOne({
      isGroupChat: true,
      chatName: roomName,
    })
      .populate("users", "-password")
      .populate("latestMessage");

    res.status(200).json({ createdRoom });
  } catch (err) {
    res.status(400).json({ msg: JSON.stringify(err) });
  }
};

const accessRoom = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }

  const { roomName } = req.body;
  const userId = req.id;

  if (!userId) {
    return res.status(400).send("UserId param not sent with request");
  }

  let isChat = await Chat.find({
    isGroupChat: true,
    chatName: roomName,
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  const isUserExistInRoom = isChat[0].users.find((user) => user._id === userId);

  if (isUserExistInRoom) {
    return res.status(200).send(isChat[0]);
  }

  await Chat.findOneAndUpdate(
    {
      isGroupChat: true,
      chatName: roomName,
    },
    { $push: { users: userId } }
  );

  isChat = await Chat.find({
    isGroupChat: true,
    chatName: roomName,
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  return res.status(200).send(isChat[0]);
};

const searchRooms = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const keyword = {
    chatName: { $regex: req.query.chatName, $options: "i" },
    isGroupChat: true,
  };

  try {
    Chat.find(keyword)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  accessChats,
  fetchChats,
  searchRooms,
  createRoom,
  accessRoom,
};
