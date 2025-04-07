// database connection configuration
const mssql = require("../config/secretariat_db_config.js");
const msql = require('mssql');
require('dotenv').config();
const MiscUtils = require("../utils/MiscUtils.js");

describe('getStudentFactorProcedure', () => {
  it('should return the correct values for a valid department ID and student AM', async () => {
    // const depId = MiscUtils.departmentsMap[process.env.depId];
    // const studentAM = process.env.studentAm;
    const depId = MiscUtils.departmentsMap[process.env.depId];
    const studentAM = process.env.studentAm;
    const result = await getStudentFactorProcedure(depId, studentAM);
    calculateScore(result);
    console.log(calculateScore(result));
    // expect(result.Praktiki).toBeFalse();
  });
});

const calculateScore = async (procedureResults, departmentId) => {
  const ECTS_PER_SEMESTER = 30;
  // max years of study: 4 or 5 years depending on the school
  const N = 4;
  // all weights sum must be equal to 1
  const weightGrade = 0.5;
  const weightSemester = 0.4;
  const weightYearOfStudy = 0.1;

  let semester = procedureResults.Semester;
  let academicYear = Math.round(semester / 2);
  let yearTotal = (academicYear <= N) ? 100 : 100 - 10 * (academicYear - N);
  if (yearTotal < 0) yearTotal = 0;

  const capped = 2 * (N - 1);
  const maxECTS = capped * ECTS_PER_SEMESTER;
  const studentsECTS = (procedureResults.Ects > maxECTS) ? maxECTS : procedureResults.Ects;

  // return the actual calculation
  return ((procedureResults.Grade * 10 * weightGrade) +
    ((studentsECTS / maxECTS) * 100 * weightSemester) +
    (yearTotal * weightYearOfStudy)).toFixed(3);
};

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
