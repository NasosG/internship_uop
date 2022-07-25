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

const getPrefectures = async (request, response) => {
  try {
    const cities = await atlasService.getPrefectures();
    response.status(200).json(cities);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getCountries = async (request, response) => {
  try {
    const cities = await atlasService.getCountries();
    response.status(200).json(cities);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getPhysicalObjects = async (request, response) => {
  try {
    const physicalObjects = await atlasService.getPhysicalObjects();
    response.status(200).json(physicalObjects);
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
    // const results = await atlasService.getAvailablePositionsUI(offset, limit);
    const results = await atlasService.getAvailablePositionsUIUnion(offset, limit);
    let positionsArray = [];

    for (const item of results) {
      positionsArray.push({
        'id': item.g_position_id,
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
        'atlasPositionId': item.atlas_position_id,
        'afm': item.afm
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
        'id': item.g_position_id,
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


const getGenericPositionSearch = async (request, response) => {
  try {
    const userInput = request.query.text;
    const begin = request.query.begin;
    const offset = (begin != null) ? begin : 0;
    const limit = 6; // Number of rows to fetch from the database

    const results = await atlasService.getGenericPositionSearch(userInput, offset, limit);
    let positionsArray = [];

    for (const item of results) {
      positionsArray.push({
        'id': item.g_position_id,
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
        'atlasPositionId': item.atlas_position_id,
        'afm': item.afm
      });
    }

    return response.status(200).json(positionsArray);
  } catch (error) {
    console.log("error while fetching available positions from db: " + error.message);
    response.status(400).json({
      message: "something went wrong while fetching available positions from db: " + error.message
    });
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
      try {
        let positionPushed = false;

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
          'EndDate': positionGroupResults.message.EndDate,
          'EndDateString': positionGroupResults.message.EndDateString,
          'StartDate': positionGroupResults.message.StartDate,
          'StartDateString': positionGroupResults.message.StartDateString,
          'academics': academics
        });
        console.log(positionGroupResults.message);
        positionPushed = true;
        academics = []; // reset the array just to be sure

        providersArray.push({
          'atlasProviderId': providerResults.message.ID,
          'afm': providerResults.message.AFM,
          'name': providerResults.message.Name,
          'providerContactEmail': providerResults.message.ContactEmail,
          'providerContactName': providerResults.message.ContactName,
          'providerContactPhone': providerResults.message.ContactPhone
        });
      } catch (ex) {
        console.log("Failed to fetch provider or position group: " + ex.message);
        if (positionPushed) positionsArray.pop();
        continue;
      }
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
      message: "something went wrong while inserting position groups"
    };
  }
};

const getRegisteredStudent = async (academicIDNumber) => {
  try {
    let accessToken = await atlasLogin();

    // test academic id number: 4243761386827
    const atlasResponse = await axios({
      // url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetStudentDetails?StudentID=212468',
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetStudentDetails?AcademicIDNumber=' + academicIDNumber,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    // console.log(atlasResponse.data.Result);
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
    // return response
    //   .status(400)
    //   .json({
    //     message: "something went wrong while fetching available positions: " + error.message
    //   });
  }
};

const registerNewStudent = async (AcademicIDNumber) => {
  try {
    let accessToken = await atlasLogin();

    // let academicIDNumberData = {
    //   'AcademicIDNumber': AcademicIDNumber,
    // };

    // test academic id number: 4243761386827
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/RegisterNewStudent',
      method: 'POST',
      data: { AcademicIDNumber },
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
    // return response
    //   .status(400)
    //   .json({
    //     message: "something went wrong while fetching available positions: " + error.message
    //   });
  }
};


/**
* Returns preassigned positions of group, if none is found it preassigns a single position
*/
const getPositionPreassignment = async (groupId, academicId) => {
  try {
    let accessToken = await atlasLogin();
    let atlasResponse;

    atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetPreAssignedPositions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionIds = [];
    let positionData = [];

    if (atlasResponse.data.Result != null) {
      console.log("preassigned positions exist");
      for (position of atlasResponse.data.Result) {
        if (position.GroupID == groupId && position.PreAssignedForAcademic.ID == academicId) {
          // positionIds = position.ID;
          positionIds.push(position.ID);
          positionData.push({
            "ImplementationEndDate": position.ImplementationEndDate,
            "ImplementationEndDateString": position.ImplementationEndDateString,
            "ImplementationStartDate": position.ImplementationStartDate,
            "ImplementationStartDateString": position.ImplementationStartDateString,
          });
        }
      }
    } else {
      // if no position is found, preassign a single position
      atlasResponse = await axios({
        url: 'http://atlas.pilotiko.gr/Api/Offices/v1/PreAssignPositions',
        method: 'POST',
        data: { "GroupID": groupId, "NumberOfPositions": 1, "AcademicID": academicId },
        headers: {
          'Content-Type': 'application/json',
          'access_token': accessToken
        }
      });

      positionIds = atlasResponse.data.Result;
      if (positionIds.data.Success == true) {
        console.log('Προδέσμευση θέσης από φοιτητή GroupID:' + groupId + 'AcademiID:' + academicId + 'PositionID:' + positionIds[0]);
        positionData.push({
          "ImplementationEndDate": position.ImplementationEndDate,
          "ImplementationEndDateString": position.ImplementationEndDateString,
          "ImplementationStartDate": position.ImplementationStartDate,
          "ImplementationStartDateString": position.ImplementationStartDateString,
        });
      } else {
        console.log('Παρουσιάστηκε σφάλμα κατά την προδεσμευση θέσης στο ΑΤΛΑΣ');
        console.log('Aποτυχία προδέσμευσης θέσης από φορέα GroupID: ' + groupId + '  AcademiID: ' + academicId + ' PositionID: ' + positionIds[0]);
      }
    }

    return {
      positionIds,
      positionData
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

/**
* Returns preassigned positions of group, if none is found it preassigns a single position
*/
const assignStudent = async (positionsPreassignedData, studentId) => {
  try {
    let accessToken = await atlasLogin();

    let assignmentData =
    {
      "FundingType": null,
      "ImplementationEndDate": positionsPreassignedData.positionData[0].ImplementationEndDate,
      "ImplementationEndDateString": positionsPreassignedData.positionData[0].ImplementationEndDateString,
      // "ImplementationEndDateStringFormat": "String content",
      "ImplementationStartDate": positionsPreassignedData.positionData[0].ImplementationStartDate,
      "ImplementationStartDateString": positionsPreassignedData.positionData[0].ImplementationStartDateString,
      // "ImplementationStartDateStringFormat": "String content",
      "PositionID": positionsPreassignedData.positionIds[0],
      "StudentID": studentId
    };

    console.log(assignmentData);

    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/AssignStudent',
      method: 'POST',
      data: assignmentData,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    return {
      message: atlasResponse.data
    };
    // return response.status(200).json(positionsArray);
  } catch (error) {
    console.log("error while assigning student to Atlas: " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while assigning student to Atlas: " + error.message
    };
  }
};

const getFundingType = async (positionId) => {
  try {
    let accessToken = await atlasLogin();
    positionId = request.params.id;
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetFundingType?positionID=' + positionId,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionsArray = atlasResponse.data.Result == null ? null : atlasResponse.data.ResultFundingType;
    return {
      message: positionsArray,
      status: atlasResponse.status
    };
  } catch (error) {
    return {
      status: "400 bad request",
      message: "something went wrong while fetching funding types: " + error.message
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
  getPrefectures,
  getCountries,
  getPhysicalObjects,
  getGenericPositionSearch,
  getRegisteredStudent,
  getPositionPreassignment,
  getFundingType,
  registerNewStudent,
  assignStudent,
  insertTablesFromAtlas,
  insertPositionGroup
};
