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
    const loginData = {
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
    //console.log(atlasResponse.data.Message);
    console.log('Error', error.message);
    return null;
  }
};

const getInstitutions = async (request, response) => {
  try {
    const institutions = await atlasService.getInstitutions();
    response.status(200).json(institutions);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getCities = async (request, response) => {
  try {
    const cities = await atlasService.getCities();
    response.status(200).json(cities);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertDepartmentIds = async (accessToken) => {
  const UOP_INSITUTION_ID = 25;
  // let departments = new Map();
  let departments = [];
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
          departments.push({
            'id': item.ID,
            'department': item.Department,
          });
        // departments[item.ID] = item.Department;
      });
    } catch (error) {
      console.log("error in populating department array: " + error.message);
    }

    await atlasService.insertDepartmentIds(departments, UOP_INSITUTION_ID);

    return {
      message: departments,
      status: atlasResponse.status
    };
  } catch (error) {
    console.log("An error occured while fetching academics");
    return {
      status: "400 bad request",
      message: "something went wrong while fetching academics"
    };
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

const insertCitiesFromAtlas = async (accessToken) => {
  console.log("citiessssssssss");
  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetCities',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    await atlasService.insertCities(atlasResponse.data.Result);
    return {
      message: "Success. Inserted cities to the database."
    };
  } catch (error) {
    return {
      message: "Failed to insert to the database."
    };
  }
};


const insertPrefecturesFromAtlas = async (accessToken) => {
  console.log("prefectures");
  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetPrefectures',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    await atlasService.insertPrefectures(atlasResponse.data.Result);
    return {
      message: "Success. Inserted prefectures to the database."
    };
  } catch (error) {
    return {
      message: "Failed to insert to the database."
    };
  }
};


const insertCountriesFromAtlas = async (accessToken) => {
  console.log("countries");
  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetCountries',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    await atlasService.insertCountries(atlasResponse.data.Result);
    return {
      message: "Success. Inserted countries to the database."
    };
  } catch (error) {
    return {
      message: "Failed to insert to the database."
    };
  }
};

const insertPhysicalObjsFromAtlas = async (accessToken) => {
  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetPhysicalObjects',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    await atlasService.insertPhysicalObjects(atlasResponse.data.Result);
    return {
      message: "Success. Inserted physical objects to the database."
    };
  } catch (error) {
    return {
      message: "Failed to insert to the database."
    };
  }
};

const getAvailablePositionGroupsUI = async (request, response) => {
  try {
    const offset = (request.params.begin != null) ? request.params.begin : 0;
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
        'providerContactPhone': item.contact_phone,
        'atlasPositionId': item.atlas_position_id
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

const getAtlasFilteredPositions = async (request, response) => {
  try {
    let filters = request.body;
    const offset = (request.params.begin != null) ? request.params.begin : 0;
    const limit = 6; // Number of rows to fetch from the database
    const results = await atlasService.getAtlasFilteredPositions(offset, limit, filters);
    let positionsArray = [];

    for (const item of results) {
      positionsArray.push({
        'atlasPositionId': item.atlas_position_id,
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

const insertTablesFromAtlas = async (request, response) => {
  let accessToken = await atlasLogin();

  try {
    // await insertDepartmentIds(accessToken);
    // await insertCountriesFromAtlas(accessToken);
    // await insertPrefecturesFromAtlas(accessToken);
    // await insertCitiesFromAtlas(accessToken);
    // await insertPhysicalObjsFromAtlas(accessToken);
    const message = await insertPositionGroup(accessToken);
    response.status(200).json(message);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertPositionGroup = async (accessToken) => {
  try {
    let begin = 0;
    const batchSize = 100;

    let availablePositionGroups = [];
    availablePositionGroups = await getAvailablePositionGroups(begin, batchSize, accessToken);

    let positionsArray = [];
    let providersArray = [];

    for (const item of availablePositionGroups.message.Pairs) {
      let positionGroupId = item.PositionGroupID;
      let providerId = item.ProviderID;

      let positionGroupResults = await getPositionGroupDetails(positionGroupId, accessToken);
      let providerResults = await getProviderDetails(providerId, accessToken);

      let atlasAcademics = positionGroupResults.message.Academics;
      let academics = [];
      for (const key in atlasAcademics) {
        // console.log(atlasAcademics[key]);
        academics.push({
          'department': atlasAcademics[key].Department,
          'academicsId': atlasAcademics[key].ID
        });
      }

      positionsArray.push({
        'lastUpdateString': item.PositionGroupLastUpdateString.replace("μμ", "pm").replace("πμ", "am"),
        'city': positionGroupResults.message.City,
        'title': positionGroupResults.message.Title,
        'description': positionGroupResults.message.Description,
        'positionType': positionGroupResults.message.PositionType,
        'availablePositions': positionGroupResults.message.AvailablePositions,
        'duration': positionGroupResults.message.Duration,
        'physicalObjects': positionGroupResults.message.PhysicalObjects,
        'providerId': positionGroupResults.message.ProviderID,
        'atlasPositionId': positionGroupResults.message.ID,
        'atlasCityId': positionGroupResults.message.CityID,
        'atlasCountryId': positionGroupResults.message.CountryID,
        'atlasPrefectureId': positionGroupResults.message.PrefectureID,
        'academics': academics
      });

      academics = []; // reset the array just to be sure

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
    return {
      message: 'done'
    };
  } catch (error) {
    console.log("ERROR -> " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while fetching academics"
    };
  }
};

const getAvailablePositionGroups = async (begin, end, accessToken) => {
  try {
    //let begin = request.params.begin;
    //let end = parseInt(begin) + 10;
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
  getAvailablePositionGroupsUI,
  getAvailablePositionGroups,
  getAtlasFilteredPositions,
  getInstitutions,
  getCities,
  insertTablesFromAtlas,
  insertPositionGroup
};
