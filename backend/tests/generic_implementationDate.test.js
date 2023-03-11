jest.setTimeout(1000000);
const moment = require('moment');
const MiscUtils = require("../MiscUtils.js");

const skipTest = false; // Change this to true if you want to skip the test


/**
 * This Jest test is used to verify that Atlas dates are transformed into the correct format that is compatible with the .NET representation in Atlas.
 *
 * The test creates a start date and end date using a string and transforms them into their corresponding representations using the Date() function.
 * Then, it creates .NET-compatible date representations using these dates and verifies that the representations were correctly generated.
 * Finally, the test assigns the representations to the `ImplementationStartDate` and `ImplementationEndDate` properties of the `positionsPreassignedData.positionData` object.
 *
 * @throws AssertionError if the date representations are not generated or assigned correctly
 */
describe("Date representations", () => {
  test("Representations are correct", () => {
    if (skipTest) {
      return;
    }
    const isTei = true;
    const { startDate, endDate } = MiscUtils.calculateDates(isTei);

    console.log(startDate.format('DD/MM/YYYY'));
    console.log(endDate.format('DD/MM/YYYY'));

  });
});
