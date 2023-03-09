const axios = require("axios");
const atlasService = require("../services/atlasService");
require('dotenv').config();
jest.setTimeout(100000000);
const pool = require("../db_config.js");

var FOUND_IN_ATLAS = 0;
var TO_BE_DELETED = 0;

describe('getAtlasPositionGroup function', () => {
  it('should return a value', async () => {
    const loginData = {
      'Username': process.env.usernameTestProd,
      'Password': process.env.passwordTestProd
    };

    const ATLAS_PROD = 'https://submit-atlas.grnet.gr/Api/Offices/v1';
    const atlasResponse = await axios({
      url: ATLAS_PROD + '/Login',
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
    // let positionId = '18';

    // let geta = GetInstitutions(accessToken);
    // console.log(geta.message);

    // let positionGroupResults = await getPositionGroupDetails('219930', accessToken);
    // console.log(positionGroupResults.message);
    // return;
    const ids = await getPositionIdsfromDB();

    for (const pos of ids) {
      let positionGroupResults = await getPositionGroupDetails(pos.atlas_position_id, accessToken);

      if (positionGroupResults?.message && positionGroupResults?.message?.Success == false) {
        // console.log("position not found in atlas");
        let hasStudentChosenPosition = await checkIfPositionHasBeenChosenByStudent(pos.atlas_position_id);
        if (!hasStudentChosenPosition) {
          TO_BE_DELETED++;
          await pool.query("DELETE FROM atlas_position_group WHERE atlas_position_id=$1", [pos.atlas_position_id]);
        }
      } else {
        // console.log("position found in atlas");
        FOUND_IN_ATLAS++;
      }

      if (FOUND_IN_ATLAS > 0 && FOUND_IN_ATLAS % 300 == 0) {
        console.log("FOUND_IN_ATLAS: " + FOUND_IN_ATLAS);
        console.log("TO_BE_DELETED: " + TO_BE_DELETED);
      }

      // if (FOUND_IN_ATLAS + TO_BE_DELETED >= 2) {
      //   break;
      // }

    }

    // console.log("POSITIONS IN LOCAL DB AND ATLAS TOO: " + POSITIONS_IN_LOCAL_DB_AND_ATLAS_TOO);
    console.log("FOUND_IN_ATLAS: " + FOUND_IN_ATLAS);
    console.log("TO_BE_DELETED: " + TO_BE_DELETED);

  });
});

const getPositionIdsfromDB = async () => {
  try {
    const results = await pool.query("SELECT atlas_position_id FROM atlas_position_group");
    return results.rows;
  } catch (error) {
    console.log("POSITIONS IN LOCAL DB AND ATLAS TOO: " + error.message);
    throw error;
  }
};

const checkIfPositionHasBeenChosenByStudent = async (position) => {
  try {
    let rows = await pool.query("SELECT * FROM final_app_positions WHERE position_id=$1", [position]);
    return rows.rowCount > 0;
  } catch (error) {
    console.log("POSITIONS IN LOCAL DB AND ATLAS TOO: " + error.message);
    throw error;
  }
};

const getPositionGroupDetails = async (positionId, accessToken) => {
  try {
    const ATLAS_PROD = 'https://submit-atlas.grnet.gr/Api/Offices/v1';
    const atlasResponse = await axios({
      url: ATLAS_PROD + '/GetPositionGroupDetails?ID=' + positionId,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });
    // console.log(atlasResponse.data.Result);
    return {
      message: atlasResponse.data,
      status: atlasResponse.status
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "something went wrong while fetching position group details",
      status: "400 bad request"
    };
  }
};

