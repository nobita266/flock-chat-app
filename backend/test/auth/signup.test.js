process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const server = require("../../server");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const User = require("../../models/user");

describe("verification of signup calls to the server", () => {
  it("Successful Signup", (done) => {
    const signUpBody = {
      name: "Random singh",
      email: "random0@gmail.com",
      password: "qwerty",
    };

    const userFindOneStub = sinon.stub(User, "findOne").resolves(null);

    const bcryptStub = sinon
      .stub(bcrypt, "hashSync")
      .returns("$2b$04$ywFAvBgfDX7XBH/CFYxG1uGWZy4i7JFTjZ37xuXcYJprR/DG9aPgm");

    const userSaveStub = sinon.stub(User.prototype, "save").resolves();
    chai
      .request(server)
      .post("/api/auth/signup")
      .send(signUpBody)
      .end((err, res) => {
        const {
          status,
          body: { msg },
        } = res;

        expect(status).equal(200);
        expect(msg).equal("Account created Successfully!");
        expect(userFindOneStub.calledOnce).to.be.true;
        expect(userSaveStub.calledOnce).to.be.true;
        expect(bcryptStub.calledOnce).to.be.true;
        userFindOneStub.restore();
        userSaveStub.restore();
        bcryptStub.restore();
        done();
      });
  });

  it("Unsuccessful signup due to already present email", (done) => {
    const signUpBody = {
      name: "Yaman Saini",
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

    chai
      .request(server)
      .post("/api/auth/signup")
      .send(signUpBody)
      .end((err, res) => {
        const {
          status,
          body: { msg },
        } = res;

        expect(status).equal(400);
        expect(msg).equal(
          "user with this email already exists, try signing in with some other email"
        );
        expect(userFindOneStub.calledOnce).to.be.true;
        userFindOneStub.restore();
        done();
      });
  });
});
