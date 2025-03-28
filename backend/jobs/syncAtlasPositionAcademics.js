// database connection configuration
const pool = require("../config/db_config.js");
const axios = require("axios");
const MiscUtils = require("../utils/MiscUtils.js");
require('dotenv').config();
// Logging
const logger = require('../config/logger');

// Global variables
const ATLAS_URL = (process.env.ATLAS_ENV !== 'PROD') ? process.env.ATLAS_PILOT_NEW : process.env.ATLAS_PROD;

const executeSync = async () => {
  logger.info("syncAtlasPositionAcademics.executeSync() started at: " + new Date().toLocaleString());
  try {
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

    const result = await pool.query(`SELECT * FROM atlas_position_group`);
    logger.info("syncAtlasPositionAcademics.executeSync() - Query executed successfully");

    for (const obj of result.rows) {
      let positionGroupResults = await getPositionGroupDetails(obj.atlas_position_id, accessToken);

      let academics;

      if (positionGroupResults?.message?.IsAvailableToAllAcademics) {
        const allDepartments = getAllDepartmentCodes(); // Logic to get standard department codes
        academics = allDepartments.map(departmentCode => ({
          'department': null,
          'academicsId': departmentCode // Set to appropriate value or leave null if not applicable
        }));
      }

      else if (!positionGroupResults?.message?.Academics) continue;
      else academics = getAcademicsByPosition(positionGroupResults.message.Academics);
      try {
        //let res = await pool.query("SELECT * FROM position_has_academics WHERE position_id = $1", [obj.atlas_position_id]);

        for (let academic of academics) {
          const checkExistingQuery = 'SELECT 1 FROM position_has_academics WHERE position_id = $1 AND academic_id = $2';
          const checkResult = await pool.query(checkExistingQuery, [obj.atlas_position_id, academic.academicsId]);

          if (checkResult.rows.length === 0) {
            await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
              " VALUES ($1, $2)", [obj.atlas_position_id, academic.academicsId]);
          }
        }

      } catch (error) {
        logger.info('Error while updating position_has_academics for position ' + obj.atlas_position_id + ' error: ' + error.message);
      }
    }

    logger.info("syncAtlasPositionAcademics.executeSync() ended at: " + new Date().toLocaleString());

    return true;
  } catch (error) {
    logger.error("syncAtlasPositionAcademics.executeSync() error: " + error);
    return false;
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
      message: atlasResponse.data.Result,
      status: atlasResponse.status
    };
  } catch (error) {
    return {
      message: "something went wrong while fetching position group details",
      status: "400 bad request"
    };
  }
};

const getAllDepartmentCodes = () => {
  return Object.keys(MiscUtils.departmentsMap);
};

const getAcademicsByPosition = (atlasAcademics) => {
  try {
    let academics = [];
    for (const key in atlasAcademics) {
      academics.push({
        'department': atlasAcademics[key].Department,
        'academicsId': atlasAcademics[key].ID
      });
    }
    return academics;
  } catch (error) {
    throw Error(error.message);
  }
};

module.exports = { executeSync };
