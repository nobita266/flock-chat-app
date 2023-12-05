# Chat App Backend implementation

This repository contains the source code for a chat application built using Express.js, MongoDB, and Socket.io. The app allows users to communicate in real-time through chat rooms, sending and receiving messages.

## Features

- User authentication using JWT tokens.
- Ability to join and create chat rooms.
- Real-time messaging with Socket.io.
- Secure token-based authentication for API endpoints.
- MongoDB for storing user data, chats, and messages.

## Prerequisites

Before you begin, ensure you have the following dependencies installed:

- Node.js
- npm
- MongoDB

## Installation

1. Clone this repository:

```
git clone https://github.com/yamansaini0/chat-app.git
```

2. Install dependencies:

```
cd chat-app
npm install
```

3. Create a .env file and set the following environment variables:

```
MONGO_URL=your_mongodb_connection_string
PORT=5000
```

## Entry point

For backend `backend/server.js` is the entry point of the application and for frontend `frontend/src/index.js` is the entry point of the application

## Running the Application

Start the Express.js server at the entry point i.e., backend/server.js:

```
npm start
```

Start the React app at the entry point i.e., frontend/src/index.js:

```
npm start
```

## Database

This repository contains MongoDB models for a chat application. The models are created using Mongoose, a popular MongoDB object modeling tool for Node.js.

## API ENDPOINTS

- GET /: Returns a welcome message.

- POST /api/auth/signup: Sign up a new user.

- POST /api/auth/login: Log in as a user and generate a JWT token.

- GET /api/user/searchUsers: Get the list of users based on the passed keyword in params.

- POST /api/chat/accessChats: returns an object of chat based on people in a one-on-one conversation.If chat object is already there it returns it, if not it gets created and then returned to be accessed

- GET /api/chat/fetchChats: Get the list of chats where the authenticated user has ever been involved.

- GET /api/chat/searchRooms: Get the list of rooms based on the passed keyword in params.

- POST /api/chat/createRoom: Creates a room based on the name of the room passed in the body of the request, only if room name is unique in the database.

- POST /api/chat/accessRoom: Get the list of users based on the passed keyword in params.

- POST /api/message/sendMessage: `chatContent`, `chatId` is passed into the request body of Post request along with attached file `contentType` and attached file `fileName`. A chat message JSON is returned (along with pre-signed `putObjectURL` from AWS if a file is attached).
  That pre-signed URL is requested to PUT the file from the front end in the AWS S3 Bucket.

- GET /api/message/fetchAllMessages/:chatId: Fetches all the messages of the passed `chatId`.

- GET /api/message/fetchPreSignedGetUrl/:fileName: Fetches a pre-signed url from AWS to be accessed in the frontend to get the objects in S3 Bucket

## Middlewares

verifyToken:
This function is a middleware function that hijacks every request made to access any resource and checks if the `req.header("authorization")` gives a token back. It then verifies that token with `jwt.verify()` and infuse `req.id` with `userId` of the username and `req.verified = true`. On failing, `req.id = null` and `req.verified = false` with a `req.msg`. Each successive controller receives `userId` from this middleWare and checks if the request is verified by this middleware(req.verify==true).

## Using AWS S3 for storing and retrieving files/attachments

The provided code is a JavaScript module for generating pre-signed URLs for uploading and retrieving objects from an AWS S3 bucket using the AWS SDK for JavaScript (v3). Let's break down the code step by step:

1. Importing AWS SDK Modules

The code starts by importing necessary modules from the AWS SDK for JavaScript (v3). These modules are used for working with AWS S3:

```
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

```

2. Creating the S3 Client

The code creates an instance of the S3Client class, which is used for interacting with AWS S3. It configures the client with the AWS region and API credentials from environment variables:

```
const s3client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PROGRAMATIC_USER_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_PROGRAMATIC_USER_SECRET_ACCESS_KEY,
  },
});
```

- AWS_S3_REGION is expected to contain the AWS region where your S3 bucket is located.
- AWS_PROGRAMATIC_USER_ACCESS_KEY_ID and AWS_PROGRAMATIC_USER_SECRET_ACCESS_KEY should contain the access key ID and secret access key of an IAM user with the necessary permissions for working with the S3 bucket.

3. putObjectUrl Function

```
putObjectUrl({ fileName, contentType }) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${process.env.AWS_S3_BUCKET_KEY}/${fileName}`,
    ContentType: contentType,
  });
  const url = getSignedUrl(s3client, command);
  return url;
}

```

- `putObjectUrl` is a function that generates a pre-signed URL for uploading an object to an S3 bucket.
- It takes two parameters: `fileName` (the name of the file you want to upload) and `contentType` (the content type of the file).
- It creates a `PutObjectCommand` instance with the specified S3 bucket name, file key (including the path), and content type.
- It then calls `getSignedUrl` with the `s3client` and the `PutObjectCommand` instance to generate the pre-signed URL.
  Finally, it returns the generated URL

4. getObjectUrl Function

```
getObjectUrl({ fileName }) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${process.env.AWS_S3_BUCKET_KEY}/${fileName}`,
  });
  const url = getSignedUrl(s3client, command);
  return url;
}
```

- `getObjectUrl` is a function that generates a pre-signed URL for retrieving an object from an S3 bucket.
- It takes one parameter: `fileName` (the name of the file you want to retrieve).
- Similar to `putObjectUrl`, it creates a `GetObjectCommand` instance with the specified S3 bucket name and file key.
- It then calls `getSignedUrl` with the `s3client` and the `GetObjectCommand` instance to generate the pre-signed URL.
  Finally, it returns the generated URL.

5. fetchPreSignedGetUrl Function

```
const fetchPreSignedGetUrl = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const { fileName } = req.params;
  try {
    const preSignedGETUrl = await getObjectUrl({ fileName });
    res.status(200).json(preSignedGETUrl);
  } catch (error) {
    res.status(400).json(error);
  }
};
```

- `fetchPreSignedGetUrl` is an asynchronous function designed to be used with an Express.js route.
- It first checks if `req.verified` is false, indicating that the request is not verified. In such a case, it responds with a 403 Forbidden status and the message stored in req.msg.
- If the request is verified, it extracts the `fileName` from the request's parameters.
- It then calls the `getObjectUrl` function to generate a pre-signed URL for the specified file.
- If successful, it responds with a JSON object containing the pre-signed URL and a status code of 200 (OK).
- If there is an error during the process, it responds with a JSON representation of the error and a status code of 400 (Bad Request).

## Testing using mocha,chai,sinon

To run the tests for this application, use the following command:

```
npm run test
```

## WebSocket Integration

The app uses Socket.io for real-time communication. Socket.io allows users to join chat rooms and send/receive messages instantly.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues if you find any problems or improvements.

### Checkout README.md for chat-app overview

[Features of Chat-app](https://github.com/yamansaini0/chat-app/blob/main/README.md)

### Checkout README.md for frontend implementation

[Frontend](https://github.com/yamansaini0/chat-app/blob/main/frontend/README.md)
