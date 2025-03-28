// database connection configuration
const mssql = require("../config/secretariat_db_config.js");
const msql = require('mssql');
require('dotenv').config();

describe('getStudentFactorProcedure', () => {
  it('should return the correct values for a valid department ID and student AM', async () => {
    const depId = process.env.depId;
    const studentAM = process.env.studentAm;
    const result = await getStudentFactorProcedure(depId, studentAM);
    console.log("res " + result);
    // expect(result.Praktiki).toBeFalse();
  });
});

const getStudentFactorProcedure = async (depId, studentAM) => {
  try {
    let mspool = await msql.connect(mssql);

    const result = await mspool.request()
      .input('DepId', msql.Int, depId)
      .input('am', msql.VarChar(100), studentAM)
      .execute('usp_GetStudentFactorPraktiki');
    console.log(result.recordset[0]);
    return result.recordset[0];
  } catch (error) {
    console.log("error: " + error);
  }
};
