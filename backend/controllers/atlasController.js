const axios = require("axios");

// test pilot atlas login
const atlasLogin = async (uid = false, username = null, password = null) => {
  // TODO: this token will be retrieved by the db
  const accessToken = '';
  if (accessToken != null) return accessToken;
  if (username == null || password == null) return "";

  try {
    loginData = {
      'Username': username,
      'Password': password
    };

    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/Login',
      method: 'POST',
      data: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return atlasResponse.data.Result.AuthToken;
  } catch (error) {
    console.log('Error', error.message);
    return "";
    //console.log(atlasResponse.data.Message),
  }
};


const getDepartmentIds = async (request, response) => {
  const UOPInstitutionID = 25;
  let departments = new Map();
  let accessToken = await atlasLogin();

  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetAcademics',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    try {
      atlasResponse.data.Result.forEach((item) => {
        if (item.InstitutionID == UOPInstitutionID)
          departments[item.ID] = item.Department;
      });
    } catch (error) {
      console.log("error in populating department array: " + error.message);
    }

    return response.status(200).json({
      message: departments,
      status: atlasResponse.status
    });
  } catch (error) {
    return response.status(400).json({
      status: "400 bad request",
      message: "something went wrong while fetching academics"
    });
  }
};

const getPhysicalObjects = async (request, response) => {
  let accessToken = await atlasLogin();
  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetPhysicalObjects',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    console.log(atlasResponse.data.Result);

    return response.status(200).json({
      message: atlasResponse.data.Result,
      status: atlasResponse.status
    });
  } catch (error) {
    return response.status(400).json({
      status: "400 bad request",
      message: "something went wrong while fetching academics"
    });
  }
};

const getPositionGroupDetails = async (urlId) => {
  let accessToken = await atlasLogin();
  try {
    //const urlId = 3;
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetPositionGroupDetails?ID=' + urlId,
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
      status: "400 bad request",
      message: "something went wrong while fetching academics"
    };
  }
};

const getProviderDetails = async (providerId) => {
  let accessToken = await atlasLogin();
  try {
    //const providerId = 191;
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetProviderDetails?ID=' + providerId,
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
    // return response.status(400).json({
    //   status: "400 bad request",
    //   message: "something went wrong while fetching academics"
    // });
  }
};

const getAvailablePositionGroups = async (request, response) => {
  let accessToken = await atlasLogin();

  try {
    let begin = request.params.begin;
    // let end = parseInt(begin) + 10;
    let myData = { 'Skip': begin, 'Take': 8 };

    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetAvailablePositionGroups',
      method: 'POST',
      data: myData,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionsArray = [];

    for (const item of atlasResponse.data.Result.Pairs) {
      let positionGroupId = item.PositionGroupID;
      let providerId = item.ProviderID;

      let positionGroupResults = await getPositionGroupDetails(positionGroupId);
      let providerResults = await getProviderDetails(providerId);

      //item.PositionGroupID = positionGroupResults.message;
      //item.ProviderID = providerResults.message;

      positionsArray.push({
        'city': positionGroupResults.message.City,
        'title': positionGroupResults.message.Title,
        'description': positionGroupResults.message.Description,
        'name': providerResults.message.Name
      });
    }

    //console.log(atlasResponse.data.Result);
    return response.status(200).json(positionsArray);
  } catch (error) {
    console.log("ERROR" + error.message);
    return response.status(400).json({
      status: "400 bad request",
      message: "something went wrong while fetching academics"
    });
  }
};

module.exports = {
  getDepartmentIds,
  getPhysicalObjects,
  getAvailablePositionGroups,
};
