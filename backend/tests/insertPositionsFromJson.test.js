const pool = require("../db_config.js");
const moment = require('moment');
require('dotenv').config();
jest.setTimeout(1000000);

describe('getAtlasPositionGroup function', () => {
  it('should return a value', async () => {
    try {
      console.log("starting");
      // const studentId = 8;
      // const result = await pool.query("SELECT id, positions FROM student_applications WHERE student_id = $1 order by application_date desc limit 1", [studentId]);
      // console.log(result.rows);
      // const body = result.rows[0].positions;
      // const applicationId = result.rows[0].id;
      // for (const obj of body) {
      //   console.log(obj.upload_date);
      //   obj.upload_date = moment(obj.upload_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      //   console.log(studentId, obj.priority, obj.company, obj.title, obj.place, obj.upload_date, obj.position_id, obj.afm, obj.internal_position_id, applicationId);
      //   await pool.query("INSERT INTO final_app_positions" +
      //     "(student_id, priority, company, title, place, upload_date, position_id, afm, internal_position_id, application_id)" +
      //     " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      //     [studentId, obj.priority, obj.company, obj.title, obj.place, obj.upload_date, obj.position_id, obj.afm, obj.internal_position_id, applicationId]);
      // }

      const values = [
        309, 99, 106, 117, 133, 146, 391, 247, 361, 312, 236, 165, 173, 362, 118, 110, 116, 245, 126, 122, 129, 301, 200, 392, 182, 175, 119, 108, 141, 90, 127, 123, 148, 326, 121, 296, 254, 125, 279, 435, 105, 183, 366, 176, 181, 180, 124, 134, 299, 152, 120, 75, 128, 169, 130, 103
      ];

      for (const value of values) {
        await pool.query(`UPDATE student_applications
                        SET protocol_number = (
                                  SELECT apps.protocol_number FROM semester_interest_apps apps
                          inner join student_applications on
                          apps.student_id = student_applications.student_id and apps.period_id = student_applications.period_id
                          and student_applications.application_status = true AND student_applications.student_id = $1
                          limit 1
                        ) where student_applications.application_status = true AND student_id = $1`, [value]);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }

  });
});
