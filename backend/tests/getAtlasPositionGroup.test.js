const axios = require("axios");
const atlasService = require("../services/atlasService");
require('dotenv').config();
jest.setTimeout(100000000);
const pool = require("../db_config.js");

var COUNTER = 0;
var POSITIONS_IN_LOCAL_DB_AND_ATLAS_TOO = 0;

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
    // let positionId = '219930';

    // let geta = GetInstitutions(accessToken);
    // console.log(geta.message);

    //    let positionGroupResults = await getPositionGroupDetails(positionId, accessToken);
    //    console.log(positionGroupResults.message);
    let skip = 0;//await atlasService.getCountOfPositionPairs();
    // skip = Number.parseInt(skip);
    console.log(skip);
    const batchSize = 200;
    let availablePositionGroups = [];
    availablePositionGroups = await getAvailablePositionGroups(skip, batchSize, accessToken);
    console.log(availablePositionGroups.message.NumberOfItems);
    do {
      for (const atlasItem of availablePositionGroups.message.Pairs) {
        let localPositionGroups = await atlasService.getPositionGroupRelations(atlasItem);
        if (localPositionGroups) {
          if (localPositionGroups.position_group_id == atlasItem.PositionGroupID) {
            POSITIONS_IN_LOCAL_DB_AND_ATLAS_TOO++;
            let positionGroupResults = await getPositionGroupDetails(atlasItem.PositionGroupID, accessToken);
            // console.log(positionGroupResults.message);
            await updatePositionsList(positionGroupResults.message);
            // console.log("position found in local position groups\n");
          }
        }
        // console.log(atlasItem.PositionGroupID);
        // if (atlasItem.PositionGroupID == positionId) {
        //   console.log("Found item: " + atlasItem.PositionGroupID);
        //   return;
        // }
      }
      skip += batchSize;
    } while (availablePositionGroups.message.NumberOfItems > skip);
    console.log("POSITIONS IN LOCAL DB AND ATLAS TOO: " + POSITIONS_IN_LOCAL_DB_AND_ATLAS_TOO);
    console.log("COUNTER for academics inserts: " + COUNTER);

  });
});

const updatePositionsList = async (item) => {
  try {
    // console.log(item);
    if (!item.Academics) return;
    // console.log(item.Academics);
    // Insert academics into academics table
    for (let academic of item.Academics) {
      const result = await pool.query("SELECT * FROM position_has_academics WHERE position_id=$1 AND academic_id=$2", [item.ID, academic.ID]);
      if (result.rowCount === 0) {
        COUNTER++;

        // await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
        //   " VALUES ($1, $2)", [item.ID, academic.ID]);
      }
    }
    // return updateResults;
  } catch (error) {
    console.log('Error while updating academics available to atlas groups[s] ' + error.message + ' _ ' + item.ID);
    //throw Error('Error while updating academics available to atlas groups[s]');

  }
};

const GetInstitutions = async (accessToken) => {
  try {
    const ATLAS_PROD = 'https://submit-atlas.grnet.gr/Api/Offices/v1';
    const atlasResponse = await axios({
      url: ATLAS_PROD + '/GetInstitutions',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });
    console.log(atlasResponse.data);
    return {
      message: atlasResponse.data.Result,
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
      message: atlasResponse.data.Result,
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

const getAvailablePositionGroups = async (begin, end, accessToken) => {
  try {
    const ATLAS_PROD = 'https://submit-atlas.grnet.gr/Api/Offices/v1';
    let paginationData = {
      'Skip': begin,
      'Take': end
    };

    const atlasResponse = await axios({
      url: ATLAS_PROD + '/GetAvailablePositionGroups',
      method: 'POST',
      data: paginationData,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionsArray = atlasResponse.data.Result;
    return {
      message: positionsArray,
      status: atlasResponse.status
    };
  } catch (error) {
    return {
      status: "400 bad request",
      message: "something went wrong while fetching available positions: " + error.message
    };
  }
};
