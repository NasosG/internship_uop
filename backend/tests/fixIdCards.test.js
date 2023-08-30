// database connection configuration
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const utils = require('../MiscUtils.js');
require('dotenv').config();

const pool = require("../db_config.js");
jest.setTimeout(10000000);

describe('fixIdCards', () => {
  it('should update the ids of the students who have not inserted id card', async () => {
    let updated = [];
    let notUpdated = [];

    const { rows, length } = await getStudentsWithNoIdCards();

    console.log("length is: " + length);
    if (length == 0) return;

    for (let i = 0; i < length; i++) {
      let studentAM = utils.splitStudentsAM(rows[i].am);

      let deptIdForProcedure = rows[i].dep_id;
      if (rows[i].dep_id.toString().length == 6) {
        deptIdForProcedure = utils.getAEICodeFromDepartmentId(rows[i].dep_id);
      }
      console.log(deptIdForProcedure, studentAM);

      const result = await getStudentFactorProcedure(deptIdForProcedure, studentAM);
      if (result.IDtype == 'Α') {
        await updateStudentId(rows[i].student_id, result.Adt);
        updated.push(rows[i].student_id);
        console.log('οκ');
      }
      else notUpdated.push(rows[i].student_id);
    }

    console.log("-- Updated --");
    console.log(updated);
    console.log("-- Not Updated --");
    console.log(notUpdated);
  });
});

const getStudentsWithNoIdCards = async () => {
  try {
    let res = await pool.query(`SELECT distinct sso_users.uuid as student_id, sso_users.department_id as dep_id, sso_users.schacpersonaluniqueCode as AM
                                FROM internship_assignment
                                INNER JOIN student_users su ON su.sso_uid = student_id
                                INNER JOIN sso_users ON sso_users.uuid = su.sso_uid
                                WHERE su.id_card is null`);

    if (res?.rows?.length > 0) {
      return { rows: res.rows, length: res?.rows?.length };
    }

    return { rows: null, length: 0 };
  } catch (error) {
    console.log("error: " + error);
  }
};

const updateStudentId = async (studentId, idCardNumber) => {
  try {
    await pool.query(`UPDATE student_users
                      SET id_card = $1
                      WHERE sso_uid = $2`,
      [idCardNumber, studentId]);
    console.log("Updated student " + studentId);
  } catch (error) {
    console.error("updateStudentId error: " + error);
  }
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
    console.error("procedure error: " + error);
  }
};
