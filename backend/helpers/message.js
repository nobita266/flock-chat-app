const Chat = require("../models/chat");
const Message = require("../models/message");
const dotenv = require("dotenv");
dotenv.config();

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PROGRAMATIC_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_PROGRAMATIC_USER_SECRET_ACCESS_KEY,
  },
});

class MessageHelper {
  constructor() {}
  async saveMessage({ userId, content, chatId, fileName, contentType }) {
    const message = new Message({
      sender: userId,
      content: content,
      chat: chatId,
      uploadedFile: {
        fileName,
        contentType,
      },
    });

    await message.save();

    return message;
  }

  async findCurrentMessage({ userId, content, chatId }) {
    let results = await Message.find({
      sender: userId,
      content,
      chat: chatId,
    })
      .sort({ $natural: -1 })
      .limit(1)
      .populate("sender", "name")
      .populate("chat");

    results = await Message.populate(results, {
      path: "chat.users",
      select: "name email",
    });
    return results[0];
  }
  async updateLatestMessage({ chatId, latestMessage }) {
    await Chat.findByIdAndUpdate(chatId, { latestMessage });
  }

  putObjectUrl({ fileName, contentType }) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${process.env.AWS_S3_BUCKET_KEY}/${fileName}`,
      ContentType: contentType,
    });
    const url = getSignedUrl(s3client, command);
    return url;
  }

  getObjectUrl({ fileName }) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${process.env.AWS_S3_BUCKET_KEY}/${fileName}`,
    });
    const url = getSignedUrl(s3client, command);
    return url;
  }
}

module.exports = MessageHelper;
