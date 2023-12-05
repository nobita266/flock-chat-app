process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const ChatHelper = require("../../helpers/chat");

describe("verification of /api/chat/accessChats", () => {
  it("accessing already present chat", (done) => {
    const accessChatBody = {
      recieverUserId: "someRecieverUserId",
    };

    const token = "fakeToken";

    const verifyStub = sinon
      .stub(jwt, "verify")
      .callsFake((token, secret, callback) => {
        callback(null, { id: "someUserId" });
      });

    const getChatStub = sinon
      .stub(ChatHelper.prototype, "getChat")
      .resolves({});

    chai
      .request(server)
      .post("/api/chat/accessChats")
      .send(accessChatBody)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const { status,body:{msg} } = res;

        expect(status).equal(200);
        expect(msg).equal("Successfully fetched already present chat");
        expect(verifyStub.calledOnce).to.be.true;
        expect(getChatStub.calledOnce).to.be.true;
        verifyStub.restore();
        getChatStub.restore();
        done();
      });
  });
  it("accessing a whole new chat", (done) => {
    const accessChatBody = {
      recieverUserId: "someRecieverUserId",
    };

    const token = "fakeToken";

    const verifyStub = sinon
      .stub(jwt, "verify")
      .callsFake((token, secret, callback) => {
        callback(null, { id: "someUserId" });
      });

    const getChatStub = sinon
      .stub(ChatHelper.prototype, "getChat")
      .resolves();

    const createNewChatStub  = sinon
    .stub(ChatHelper.prototype, "createNewChat")
    .resolves({});

    chai
      .request(server)
      .post("/api/chat/accessChats")
      .send(accessChatBody)
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const { status,body:{msg} } = res;

        expect(status).equal(200);
        expect(msg).equal("Successfully created a new chat");
        expect(verifyStub.calledOnce).to.be.true;
        expect(getChatStub.calledOnce).to.be.true;
        expect(createNewChatStub.calledOnce).to.be.true;
        verifyStub.restore();
        getChatStub.restore();
        createNewChatStub.restore()
        done();
      });
  });
});
