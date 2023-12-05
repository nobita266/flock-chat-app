const dotenv = require("dotenv");

const Message = require("../models/message");
const MessageHelper = require("../helpers/message");
dotenv.config();


const fetchPreSignedGetUrl = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const { fileName } = req.params;
  try {
    const { getObjectUrl } = new MessageHelper();
    const preSignedGETUrl = await getObjectUrl({ fileName });
    res.status(200).json(preSignedGETUrl);
  } catch (error) {
    res.status(400).json(error);
  }
};

const sendMessage = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const { content, chatId, contentType, fileName } = req.body;

  const isContentAbsent = !content;
  const isFileAttachmentAbsent = !fileName;
  const isChatIdAbsent = !chatId;

  if ((isContentAbsent && isFileAttachmentAbsent) || isChatIdAbsent) {
    return res.status(400).json({ msg: "Invalid data passed into request" });
  }

  const { saveMessage, findCurrentMessage, putObjectUrl, updateLatestMessage } =
    new MessageHelper();

  let preSignedPUTUrl;
  if (fileName && contentType) {
    preSignedPUTUrl = await putObjectUrl({ fileName, contentType });
  }

  const userId = req.id;

  try {
    const messageObject = await saveMessage({
      userId,
      content,
      chatId,
      fileName,
      contentType,
    });
    const message = await findCurrentMessage({ userId, chatId, content });
    await updateLatestMessage({ chatId, latestMessage: messageObject });
    res.status(200).json({
      message,
      preSignedPUTUrl,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const fetchAllMessages = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const { chatId } = req.params;
  try {
    let messages;
    if (process.env.NODE_ENV !== "test") {
      messages = await Message.find({ chat: chatId })
        .populate("sender", "name email")
        .populate("chat");
    }

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error" });
  }
};

module.exports = { sendMessage, fetchAllMessages, fetchPreSignedGetUrl };
