const sinon = require("sinon");

class TestUtils {
  constructor() {}
  expectedToBeCalledOnce(collectionOfStubs) {
    Object.keys(collectionOfStubs).forEach((stubName) => {
      const stub = collectionOfStubs[stubName];
      sinon.assert.calledOnce(stub)
    });
  }
  restoreStubs(collectionOfStubs) {
    Object.keys(collectionOfStubs).forEach((stubName) => {
      const stub = collectionOfStubs[stubName];
      stub.restore();
    });
  }
}

module.exports = TestUtils;
