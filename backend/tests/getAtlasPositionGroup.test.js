const axios = require("axios");
const atlasService = require("../services/atlasService");
require('dotenv').config();
jest.setTimeout(100000);


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

    //await atlasService.getCredentials().access_token;;
    if (!accessToken) {
      return;
    }
    let positionId = '245072';
    // let positionGroupResults = await getPositionGroupDetails(positionId, accessToken);
    // console.log(positionGroupResults.message);
    let skip = await atlasService.getCountOfPositionPairs();
    skip = Number.parseInt(skip);
    console.log(skip);
    const batchSize = 200;
    let availablePositionGroups = [];
    do {
      availablePositionGroups = await getAvailablePositionGroups(skip, batchSize, accessToken);
      //console.log("\nGetting skip/res->NumberOfItems");
      //console.log(availablePositionGroups.message.NumberOfItems);
      //console.log("Scanning for updated items...\n");
      for (const atlasItem of availablePositionGroups.message.Pairs) {
        if (atlasItem.PositionGroupID == positionId) {
          console.log("Found item: " + atlasItem.PositionGroupID);
          return;
        }
      }
      skip += batchSize;
    } while (availablePositionGroups.message.NumberOfItems > skip);

  });
});

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
