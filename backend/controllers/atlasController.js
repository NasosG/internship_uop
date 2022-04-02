const axios = require("axios");
const atlasService = require("../services/atlasService");

// test pilot atlas login
const atlasLogin = async (uid = false, username = null, password = null) => {
  // credentials retrieved by the db
  const credentials = await atlasService.getCredentials();
  const accessToken = credentials.access_token;
  if (accessToken != null) return accessToken;

  try {
    if (credentials.username == null || credentials.password == null) return null;
    loginData = {
      'Username': credentials.username,
      'Password': credentials.password
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
    return null;
    //console.log(atlasResponse.data.Message),
  }
};


const getDepartmentIds = async (request, response) => {
  const UOP_INSITUTION_ID = 25;
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
        if (item.InstitutionID == UOP_INSITUTION_ID)
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

const getPositionGroupDetails = async (positionId, accessToken) => {
  try {

    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetPositionGroupDetails?ID=' + positionId,
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
      message: "something went wrong while fetching academics",
      status: "400 bad request"
    };
  }
};

const getProviderDetails = async (providerId, accessToken) => {
  try {

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

const getAvailablePositionGroupsUI = async (request, response) => {
  try {
    const offset = (request.params.begin != null) ? request.params.begin : 0;
    // console.log(offset);
    const limit = 6; // Number of rows to fetch from the database
    const results = await atlasService.getAvailablePositionsUI(offset, limit);
    let positionsArray = [];

    for (const item of results) {
      positionsArray.push({
        'positionGroupLastUpdateString': item.last_update_string,
        'city': item.city,
        'title': item.title,
        'description': item.description,
        'positionType': item.position_type,
        'availablePositions': item.available_positions,
        'duration': item.duration,
        'physicalObjects': item.physical_objects,
        'name': item.name,
        'providerContactEmail': item.contact_email,
        'providerContactName': item.contact_name,
        'providerContactPhone': item.contact_phone
      });
    }

    return response.status(200).json(positionsArray);
  } catch (error) {
    console.log("error while fetching available positions from db: " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while fetching available positions from db: " + error.message
    };
  }
};

const insertPositionGroup = async (request, response) => {
  let accessToken = await atlasLogin();

  try {
    let begin = 10;
    const batchSize = 50;

    let availablePositionGroups = [];
    availablePositionGroups = await getAvailablePositionGroups(begin, batchSize, accessToken);

    let positionsArray = [];
    let providersArray = [];

    for (const item of availablePositionGroups.message.Pairs) {
      let positionGroupId = item.PositionGroupID;
      let providerId = item.ProviderID;

      let positionGroupResults = await getPositionGroupDetails(positionGroupId, accessToken);
      let providerResults = await getProviderDetails(providerId, accessToken);

      positionsArray.push({
        'lastUpdateString': item.PositionGroupLastUpdateString,
        'city': positionGroupResults.message.City,
        'title': positionGroupResults.message.Title,
        'description': positionGroupResults.message.Description,
        'positionType': positionGroupResults.message.PositionType,
        'availablePositions': positionGroupResults.message.AvailablePositions,
        'duration': positionGroupResults.message.Duration,
        'physicalObjects': positionGroupResults.message.PhysicalObjects,
        'providerId': positionGroupResults.message.ProviderID,
        'atlasPositionId': positionGroupResults.message.ID
      });

      providersArray.push({
        'atlasProviderId': providerResults.message.ID,
        'name': providerResults.message.Name,
        'providerContactEmail': providerResults.message.ContactEmail,
        'providerContactName': providerResults.message.ContactName,
        'providerContactPhone': providerResults.message.ContactPhone
      });
    }

    // remove duplicates from provider's array
    let cleanedProviderArray = providersArray.filter((providersArray, index, self) =>
      index === self.findIndex((t) => t.atlasProviderId === providersArray.atlasProviderId));

    // console.log(cleanedProviderArray);
    await atlasService.insertProvider(cleanedProviderArray);
    await atlasService.insertPositionGroup(positionsArray);

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

const getAvailablePositionGroups = async (begin, end, accessToken) => {
  // let accessToken = await atlasLogin();

  try {
    //let begin = request.params.begin;
    // let end = parseInt(begin) + 10;
    let paginationData = {
      'Skip': begin,
      'Take': end
    };

    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetAvailablePositionGroups',
      method: 'POST',
      data: paginationData,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    // let positionsArray = [];

    // for (const item of atlasResponse.data.Result.Pairs) {
    //   let positionGroupId = item.PositionGroupID;
    //   let providerId = item.ProviderID;

    //   let positionGroupResults = await getPositionGroupDetails(positionGroupId, accessToken);
    //   let providerResults = await getProviderDetails(providerId, accessToken);

    // positionsArray.push({
    //   'positionGroupLastUpdateString': item.PositionGroupLastUpdateString,
    //   'city': positionGroupResults.message.City,
    //   'title': positionGroupResults.message.Title,
    //   'description': positionGroupResults.message.Description,
    //   'positionType': positionGroupResults.message.PositionType,
    //   'availablePositions': positionGroupResults.message.AvailablePositions,
    //   'duration': positionGroupResults.message.Duration,
    //   'physicalObjects': positionGroupResults.message.PhysicalObjects,
    //   'name': providerResults.message.Name,
    //   'providerContactEmail': providerResults.message.ContactEmail,
    //   'providerContactName': providerResults.message.ContactName,
    //   'providerContactPhone': providerResults.message.ContactPhone
    // });
    // }
    let positionsArray = atlasResponse.data.Result;
    return {
      message: positionsArray,
      status: atlasResponse.status
    };
    // return response.status(200).json(positionsArray);
  } catch (error) {
    console.log("error while fetching available positions: " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while fetching available positions: " + error.message
    };
  }
};

module.exports = {
  getDepartmentIds,
  getPhysicalObjects,
  getAvailablePositionGroupsUI,
  getAvailablePositionGroups,
  insertPositionGroup
};
