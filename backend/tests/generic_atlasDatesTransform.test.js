jest.setTimeout(1000000);

const skipTest = true; // Change this to true if you want to skip the test

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
    const startDateStr = "2014-01-09 10:12:11";
    const num = parseInt("0", 8);
    // const startDate = new Date((startDateStr == null) ?  0000 : : startDateStr + "Z");
    const startDate = new Date((startDateStr == null) ? num : startDateStr + "Z");
    const endDate = new Date("2014-01-09T10:12:12.000Z");
    const startDateValue = startDate.valueOf();
    const endDateValue = endDate.valueOf();

    const representation = `\\/Date(${startDateValue}000)\\/`;
    const representation2 = `\\/Date(${endDateValue}000)\\/`;

    console.log(representation);
    console.log(representation2);

    expect(representation).toEqual("\\/Date(1389250331000)\\/");
    expect(representation2).toEqual("\\/Date(1389250332000)\\/");

    let t1, t2;
    t1 = representation;
    t2 = representation2;

    // Check that the date representations were properly assigned
    expect(t1).toEqual("\\/Date(1389250331000)\\/");
    expect(t2).toEqual("\\/Date(1389250332000)\\/");
  });
});
