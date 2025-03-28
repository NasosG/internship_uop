const pool = require("../config/db_config.js");
const deactivateJob = true;
// Logging
const logger = require('../config/logger');

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
  if (deactivateJob) {
    logger.info("Period finish job deactivated");
    return;
  }
  logger.info("Job started at: " + new Date().toLocaleString());
  try {
    await pool.query("UPDATE period  \
                      SET is_active = 'false', \
                          is_completed = 'true' \
                      WHERE DATE(NOW()) = DATE(date_to) AND phase_state >= 2");
    logger.info("Job finished at: " + new Date().toLocaleString());
  } catch (error) {
    logger.error(error);
    throw Error("Error while updating period in job: " + error.message);
  }
};

module.exports = { setPeriodCompleted };
