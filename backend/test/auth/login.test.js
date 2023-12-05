process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const server = require("../../server");
const User = require("../../models/user");
chai.use(chaiHttp);

const expect = chai.expect;

describe("verification of login calls to the server", () => {
  it("Successful Login", (done) => {
    const signInBody = {
      email: "yamansaini0@gmail.com",
      password: "qwerty",
    };

    const userFindOneStub = sinon.stub(User, "findOne").resolves({
      _id: "64bf7fdbedc92015d28dd35e",
      name: "Yaman Saini",
      email: "yamansaini0@gmail.com",
      password: "$2b$04$ywFAvBgfDX7XBH/CFYxG1uGWZy4i7JFTjZ37xuXcYJprR/DG9aPgm",
      isAdmin: false,
      __v: 0,
    });

    const jwtStub = sinon.stub(jwt, "sign").returns("stubbedAccessToken");

    const bcryptStub = sinon.stub(bcrypt, "compareSync").returns(true);

    chai
      .request(server)
      .post("/api/auth/login")
      .send(signInBody)
      .end((err, res) => {
        const {
          status,
          body: { msg, accessToken },
        } = res;

        expect(status).equal(200);
        expect(msg).equal("login successful");
        expect(typeof accessToken).equal("string");
        expect(userFindOneStub.calledOnce).to.be.true;
        expect(jwtStub.calledOnce).to.be.true;
        expect(bcryptStub.calledOnce).to.be.true;
        userFindOneStub.restore();
        jwtStub.restore();
        bcryptStub.restore();
        done();
      });
  });

  it("Unsuccessful Login due to invalid username", (done) => {
    const signInBody = {
      email: "sainiswastik0@newsagg",
      password: "randomPasswordInput",
    };

    chai
      .request(server)
      .post("/api/auth/login")
      .send(signInBody)
      .end((err, res) => {
        expect(res.status).equal(400);
        expect(res.body.msg).equal("email address entered is not valid");
        done();
      });
  });

  it("Unsuccessful Login due to valid but unknown username", (done) => {
    const signInBody = {
      email: "yamansaini1@gmail.com",
      password: "qwerty",
    };

    const userStub = sinon.stub(User, "findOne").resolves(null);

    chai
      .request(server)
      .post("/api/auth/login")
      .send(signInBody)
      .end((_, res) => {
        const {
          status,
          body: { msg },
        } = res;
        expect(status).equal(400);
        expect(msg).equal("email not found, try signing-up first");
        expect(userStub.calledOnce).to.be.true;
        userStub.restore();
        done();
      });
  });

  it("Unsuccessful Login due to invalid password", (done) => {
    const signInBody = {
      email: "yamansaini0@gmail.com",
      password: "wrongpasswordinput",
    };

    const userStub = sinon.stub(User, "findOne").resolves({
      _id: "64bf7fdbedc92015d28dd35e",
      name: "Yaman Saini",
      email: "yamansaini0@gmail.com",
      password: "$2b$04$ywFAvBgfDX7XBH/CFYxG1uGWZy4i7JFTjZ37xuXcYJprR/DG9aPgm",
      isAdmin: false,
      __v: 0,
    });

    const bcryptStub = sinon.stub(bcrypt, "compareSync").returns(false);

    chai
      .request(server)
      .post("/api/auth/login")
      .send(signInBody)
      .end((_, res) => {
        const {
          status,
          body: { msg },
        } = res;

        expect(status).equal(400);
        expect(msg).equal("invalid password");
        expect(userStub.calledOnce).to.be.true;
        expect(bcryptStub.calledOnce).to.be.true;
        userStub.restore();
        bcryptStub.restore();
        done();
      });
  });
});
