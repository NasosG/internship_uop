require('dotenv').config();
jest.setTimeout(10000000);
const axios = require("axios");

test('fetchAtlasData should return data', async () => {
  const token = "//insert-token-here";
  const positionId = '270038';

  let positionGroupResults = await getPositionGroupDetails(positionId, token);

  console.log(positionGroupResults.message.Result);
});

const getPositionGroupDetails = async (positionId, accessToken) => {
  try {
    const ATLAS_PROD = 'https://submit-atlas.grnet.gr/Api/Offices/v1';
    const atlasResponse = await axios({
      url: `${ATLAS_PROD}/GetPositionGroupDetails?ID=${positionId}`,
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
    console.log(error.message);
    return {
      message: "something went wrong while fetching position group details",
      status: "400 bad request"
    };
  }
};
