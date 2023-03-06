const pool = require("../db_config.js");
const moment = require('moment');
require('dotenv').config();
jest.setTimeout(1000000);

describe('getAtlasPositionGroup function', () => {
  it('should return a value', async () => {
    try {
      console.log("asd");
      const studentId = 8;
      const result = await pool.query("SELECT id, positions FROM student_applications WHERE student_id = $1", [studentId]);
      console.log(result.rows);
      const body = result.rows[0].positions;
      const applicationId = result.rows[0].id;
      for (const obj of body) {
        if (obj.priority < 4) continue;
        console.log(obj.upload_date);
        obj.upload_date = moment(obj.upload_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        console.log(studentId, obj.priority, obj.company, obj.title, obj.place, obj.upload_date, obj.position_id, obj.afm, obj.internal_position_id, applicationId);
        // await pool.query("INSERT INTO final_app_positions" +
        //   "(student_id, priority, company, title, place, upload_date, position_id, afm, internal_position_id, application_id)" +
        //   " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        //   [studentId, obj.priority, obj.company, obj.title, obj.place, obj.upload_date, obj.position_id, obj.afm, obj.internal_position_id, applicationId]);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }

  });
});
