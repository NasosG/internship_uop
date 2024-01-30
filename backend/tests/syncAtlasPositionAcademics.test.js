jest.setTimeout(100000000);
// database connection configuration
const pool = require("../db_config.js");
const axios = require("axios");
require('dotenv').config();

describe('syncAtlasPositionAcademics function', () => {
  it('should return a value', async () => {
    try {
      console.log("starting");
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

      const result = await pool.query(`SELECT * FROM atlas_position_group where atlas_position_id='231358'`);
      console.log("Query executed successfully");

      for (const obj of result.rows) {
        let positionGroupResults = await getPositionGroupDetails(obj.atlas_position_id, accessToken);
        console.log(positionGroupResults);
        if (!positionGroupResults?.message?.Academics) console.log('no academics');
        let academics = getAcademicsByPosition(positionGroupResults.message.Academics);
        try {
          let res = await pool.query("SELECT * FROM position_has_academics WHERE position_id = $1", [obj.atlas_position_id]);
          console.log(1);
          // if (obj.atlas_position_id == '231358') {
          for (let academic of academics) {
            // await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
            //   " VALUES ($1, $2)", [obj.atlas_position_id, academic.academicsId]);
            console.log(academic.academicsId);
            console.log(positionGroupResults.message.Academics);
          };
          // }

          if (res.rows.length === 0) {
            console.log(academics.length);
            for (let academic of academics) {
              await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
                " VALUES ($1, $2)", [obj.atlas_position_id, academic.academicsId]);
            }
          }
        } catch (error) {
          console.log('Error while updating position_has_academics for position ' + obj.atlas_position_id + ' error: ' + error.message);
        }
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });
});

const getPositionGroupDetails = async (positionId, accessToken) => {
  try {
    const ATLAS_URL = 'https://submit-atlas.grnet.gr/Api/Offices/v1';
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
