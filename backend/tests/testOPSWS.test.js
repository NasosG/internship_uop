jest.setTimeout(100000000);
const ops = require("../controllers/OPSController.js");

describe('testOPSWS function', () => {
  it('should return a value', async () => {
    try {

      await ops.testParsersWS();

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });
});
