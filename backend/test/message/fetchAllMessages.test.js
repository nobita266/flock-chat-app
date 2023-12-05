process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const TestUtils = require("../testUtils");

describe("verification of fetching messages /api/message/fetchAllMessages/:chatId", () => {
  let verifyStub;
  beforeEach(() => {
    verifyStub = sinon
      .stub(jwt, "verify")
      .callsFake((token, secret, callback) => {
        callback(null, { id: "someUserId" });
      });
  });
  afterEach(() => {
    const { expectedToBeCalledOnce, restoreStubs } = new TestUtils();
    expectedToBeCalledOnce({
      verifyStub,
    });
    restoreStubs({ verifyStub });
  });
  it("successfully fetching all messages of a valid provided chatId", (done) => {
    const token = "fakeToken";

    chai
      .request(server)
      .get("/api/message/fetchAllMessages/fakeChatId")
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        const { status } = res;

        //Message.find.populate.populate has been handled by using process.env.NODE_ENV!='test'

        expect(status).equal(200);
        sinon.restore();
        done();
      });
  });
});
