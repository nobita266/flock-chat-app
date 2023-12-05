process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const MessageHelper = require("../../helpers/message");
const TestUtils = require("../testUtils");

describe("verification of successfully sent message /api/message/sendMessage", () => {
  let verifyStub;
  let stubbedMessageObject;
  let stubbedMessage;
  let stubbedLatestMessage;
  beforeEach(() => {
    verifyStub = sinon
      .stub(jwt, "verify")
      .callsFake((token, secret, callback) => {
        callback(null, { id: "someUserId" });
      });
    stubbedMessageObject = sinon
      .stub(MessageHelper.prototype, "saveMessage")
      .resolves({});
    stubbedMessage = sinon
      .stub(MessageHelper.prototype, "findCurrentMessage")
      .resolves({});

    stubbedLatestMessage = sinon
      .stub(MessageHelper.prototype, "updateLatestMessage")
      .resolves({});
  });
  afterEach(() => {
    const { expectedToBeCalledOnce } = new TestUtils();
    expectedToBeCalledOnce({
      verifyStub,
      stubbedMessageObject,
      stubbedMessage,
      stubbedLatestMessage,
    });
    sinon.restore();
  });
  it("sending message with text and attachment", (done) => {
    const sendMessageBody = {
      content: "some content",
      chatId: "some chat id",
      contentType: "random content type",
      fileName: "some filename",
    };

    const token = "fakeToken";

    const stubbedPreSignedPUTUrl = sinon
      .stub(MessageHelper.prototype, "putObjectUrl")
      .returns("dummyPresignedURL");

    chai
      .request(server)
      .post("/api/message/sendMessage")
      .send(sendMessageBody)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const {
          status,
          body: { preSignedPUTUrl, message },
        } = res;

        const { expectedToBeCalledOnce } = new TestUtils();

        expect(status).equal(200);
        expect(preSignedPUTUrl).equal("dummyPresignedURL");
        expectedToBeCalledOnce({ stubbedPreSignedPUTUrl });
        done();
      });
  });
  it("sending message with only text and no attachment", (done) => {
    const sendMessageBody = {
      content: "some content",
      chatId: "some chat id",
    };

    const token = "fakeToken";

    chai
      .request(server)
      .post("/api/message/sendMessage")
      .send(sendMessageBody)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const { status } = res;

        expect(status).equal(200);

        done();
      });
  });
  it("sending message with no text and only attachment", (done) => {
    const sendMessageBody = {
      chatId: "some chat id",
      contentType: "random content type",
      fileName: "some filename",
    };

    const token = "fakeToken";

    const stubbedPreSignedPUTUrl = sinon
      .stub(MessageHelper.prototype, "putObjectUrl")
      .returns("dummyPresignedURL");

    chai
      .request(server)
      .post("/api/message/sendMessage")
      .send(sendMessageBody)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const {
          status,
          body: { preSignedPUTUrl, message },
        } = res;

        const { expectedToBeCalledOnce } = new TestUtils();

        expect(status).equal(200);
        expect(preSignedPUTUrl).equal("dummyPresignedURL");
        expectedToBeCalledOnce({ stubbedPreSignedPUTUrl });
        done();
      });
  });
});

describe("verification of unsuccessfully sent message /api/message/sendMessage", () => {
  let verifyStub;
  beforeEach(() => {
    verifyStub = sinon
      .stub(jwt, "verify")
      .callsFake((token, secret, callback) => {
        callback(null, { id: "someUserId" });
      });
  });
  afterEach(() => {
    const { expectedToBeCalledOnce } = new TestUtils();
    expectedToBeCalledOnce({
      verifyStub,
    });
    sinon.restore();
  });
  it("sending message with no text and no attachment", (done) => {
    const sendMessageBody = {
      chatId: "some chat id",
    };

    const token = "fakeToken";

    chai
      .request(server)
      .post("/api/message/sendMessage")
      .send(sendMessageBody)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const {
          status,
          body: { msg },
        } = res;

        expect(status).equal(400);
        expect(msg).equal("Invalid data passed into request");
        done();
      });
  });
  it("sending message with no chatId", (done) => {
    const sendMessageBody = {
      content: "some content",
      contentType: "random content type",
      fileName: "some filename",
    };

    const token = "fakeToken";

    chai
      .request(server)
      .post("/api/message/sendMessage")
      .send(sendMessageBody)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const {
          status,
          body: { msg },
        } = res;

        const { expectedToBeCalledOnce, restoreStubs } = new TestUtils();

        expect(status).equal(400);
        expect(msg).equal("Invalid data passed into request");
        done();
      });
  });
});
