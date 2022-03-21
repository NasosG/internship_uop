const axios = require("axios");

// test pilot atlas login
const atlasLogin = async (uid = false, username = null, password = null) => {
  //const myData = JSON.stringify(request.body);
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
      status: '400 bad request',
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
      status: '400 bad request',
      message: "something went wrong while fetching academics"
    });
  }
};


const getPositionGroupDetails = async (request, response) => {
  let accessToken = await atlasLogin();
  try {
    const stoixeia = getProviderDetails(5);
    const urlId = 5;
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetPositionGroupDetails?ID=' + urlId,
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
      status: '400 bad request',
      message: "something went wrong while fetching academics"
    });
  }
};

const getProviderDetails = async (request, response) => {
  let accessToken = await atlasLogin();
  try {
    const providerId = 196; // provider id for position with id 5
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetProviderDetails?ID=' + providerId,
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
      status: '400 bad request',
      message: "something went wrong while fetching academics"
    });
  }
};

const getAvailablePositionGroups = async (request, response) => {
  let accessToken = await atlasLogin();
  console.log("asdasdas" + accessToken);
  try {
    let myData = { 'Skip': '0', 'Take': '10' };

    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetAvailablePositionGroups',
      method: 'POST',
      data: myData,
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
    console.log("ERROR" + error.message);
    return response.status(400).json({
      status: '400 bad request',
      message: "something went wrong while fetching academics"
    });
  }
};

module.exports = {
  getDepartmentIds,
  getPhysicalObjects,
  getPositionGroupDetails,
  getAvailablePositionGroups,
  getProviderDetails
};
