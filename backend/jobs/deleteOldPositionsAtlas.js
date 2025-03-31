require('dotenv').config();
const axios = require("axios");
const pool = require("../config/db_config.js");
// Logging
const logger = require('../config/logger');
const MiscUtils = require('../utils/MiscUtils.js')

// Global variables
const ATLAS_URL = (process.env.ATLAS_ENV !== 'PROD') ? process.env.ATLAS_PILOT_NEW : process.env.ATLAS_PROD;

let FOUND_IN_ATLAS = 0;
let TO_BE_DELETED = 0;

const doDelete = async () => {
  logger.info("deleteOldPositionsAtlas.doDelete() started at: " + new Date().toLocaleString());

  const loginData = {
    'Username': process.env.usernameTestProd,
    'Password': process.env.passwordTestProd
  };

  const atlasResponse = await axios({
    url: ATLAS_URL + '/Login',
    method: 'POST',
    data: loginData,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  let accessToken = atlasResponse.data.Result.AuthToken;

  if (!accessToken) {
    return;
  }
  const ids = await getPositionIdsfromDB();

  for (const pos of ids) {
    let positionGroupResults = await getPositionGroupDetails(pos.atlas_position_id, accessToken);

    if (positionGroupResults?.message && positionGroupResults?.message?.Success == false) {
      // logger.info("position not found in atlas");

      // Update availability status to false
      await pool.query("UPDATE atlas_position_group SET is_available = false WHERE atlas_position_id = $1", [pos.atlas_position_id]);

      try {
        let hasStudentChosenPosition = await checkIfPositionHasBeenChosenByStudent(pos.atlas_position_id);
        if (!hasStudentChosenPosition) {
          TO_BE_DELETED++;
          await pool.query("DELETE FROM position_has_academics WHERE position_id=$1", [pos.atlas_position_id]);
          await pool.query("DELETE FROM atlas_position_group WHERE atlas_position_id=$1", [pos.atlas_position_id]);
          await pool.query("DELETE FROM atlas_position_group_relations WHERE position_group_id=$1", [pos.atlas_position_id]);
        }
      } catch (error) {
        logger.error(`Error in try 2. Error: ${error.message}`);
      }

    } else {
      // logger.info("position found in atlas");
      FOUND_IN_ATLAS++;
    }

    if (FOUND_IN_ATLAS > 0 && FOUND_IN_ATLAS % 300 == 0) {
      logger.info("FOUND_IN_ATLAS: " + FOUND_IN_ATLAS);
      logger.info("TO_BE_DELETED: " + TO_BE_DELETED);
      await MiscUtils.sleep(MiscUtils.TEN_MINUTES);
    }
  }

  logger.info("FOUND_IN_ATLAS: " + FOUND_IN_ATLAS);
  logger.info("TO_BE_DELETED: " + TO_BE_DELETED);
  logger.info("deleteOldPositionsAtlas.doDelete() completed at: " + new Date().toLocaleString());
};

const getPositionIdsfromDB = async () => {
  try {
    const results = await pool.query("SELECT atlas_position_id FROM atlas_position_group");
    return results.rows;
  } catch (error) {
    logger.info("POSITIONS IN LOCAL DB AND ATLAS TOO: " + error.message);
    throw error;
  }
};

const checkIfPositionHasBeenChosenByStudent = async (position) => {
  try {
    let rows = await pool.query("SELECT * FROM final_app_positions WHERE position_id=$1", [position]);
    return rows.rowCount > 0;
  } catch (error) {
    logger.info("POSITIONS IN LOCAL DB AND ATLAS TOO: " + error.message);
    throw error;
  }
};

const getPositionGroupDetails = async (positionId, accessToken) => {
  try {
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetPositionGroupDetails?ID=' + positionId,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });
    return {
      message: atlasResponse.data,
      status: atlasResponse.status
    };
  } catch (error) {
    logger.info(error.message);
    return {
      message: "something went wrong while fetching position group details",
      status: "400 bad request"
    };
  }
};

module.exports = { doDelete };
