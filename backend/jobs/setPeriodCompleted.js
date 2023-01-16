const pool = require("../db_config.js");

/**
 * setPeriodCompleted
 *
 * This function marks the completion of the period by updating its state,
 * This happens for the period(s) that have a date_to that matches today's date and a phase_state of 4.
 *
 * @throws {Error} - If there is an error while updating the period.
 *
 * @return {void}
 */
const setPeriodCompleted = async () => {
  console.log("Job started at" + new Date().toLocaleString());
  try {
    await pool.query("UPDATE period  \
                      SET is_active = 'false', \
                          is_completed = 'true' \
                      WHERE DATE(NOW()) = DATE(date_to) AND phase_state = 4");
    console.log("Job finished at" + new Date().toLocaleString());
  } catch (error) {
    console.error(error);
    throw Error("Error while updating period in job: " + error.message);
  }
};

module.exports = { setPeriodCompleted };
