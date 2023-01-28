const axios = require("axios");
const atlasService = require("../services/atlasService");
const MiscUtils = require("../MiscUtils.js");
require('dotenv').config();
const moment = require('moment');

// Global variables
const ATLAS_URL = (process.env.ATLAS_ENV !== 'PROD') ? process.env.ATLAS_PILOT_NEW : process.env.ATLAS_PROD;

// test pilot atlas login
const atlasLogin = async (uid = false, username = null, password = null) => {
  // credentials retrieved by the db
  const credentials = await atlasService.getCredentials();
  const accessToken = process.env.TOKEN;//credentials.access_token;
  const tokenIsValid = await testIfTokenIsValid(accessToken);

  if (accessToken != null && tokenIsValid) {
    console.log("access token is valid");
    return accessToken;
  }

  try {
    if (credentials.username == null || credentials.password == null) return null;
    const loginData = {
      'Username': credentials.username,
      'Password': credentials.password
    };

    const atlasResponse = await axios({
      url: ATLAS_URL + '/Login',
      method: 'POST',
      data: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    let newToken = atlasResponse.data.Result.AuthToken;
    await atlasService.updateToken(newToken);

    return newToken;
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
      url: ATLAS_URL + '/GetAcademics',
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

const getProviderDetails = async (providerId, accessToken) => {
  try {
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetProviderDetails?ID=' + providerId,
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


const getFromAtlas = async (accessToken, objectToGet) => {
  try {
    const atlasResponse = await axios({
      url: ATLAS_URL + '/Get' + objectToGet,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    return {
      "result": atlasResponse.data.Result,
      "message": "Success. Fetched " + objectToGet + " data."
    };
  } catch (error) {
    return {
      "result": [],
      "message": "Failed to fetch " + objectToGet + " data."
    };
  }
};

const insertCitiesFromAtlas = async (accessToken) => {
  try {
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetCities',
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
      url: ATLAS_URL + '/GetPrefectures',
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
      url: ATLAS_URL + '/GetCountries',
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
      url: ATLAS_URL + '/GetPhysicalObjects',
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

const insertOrUpdateWholeAtlasTables = async () => {
  try {
    accessToken = await atlasLogin();

    // Lists to keep elements for update or insert and Sync local DB with Atlas
    let positionInsertList = [];
    let positionUpdateList = [];
    let positionPairUpdates = [];
    let providerInsertList = [];
    let providerUpdateList = [];
    let providerPairUpdates = [];
    let availablePositionGroups = [];

    let skip = 0;
    let lastElement = await atlasService.getCountOfPositionPairs();
    const batchSize = 500;

    do {
      availablePositionGroups = await getAvailablePositionGroups(skip, batchSize, accessToken);
      // console.log("\nGetting skip/res->NumberOfItems");
      // console.log(availablePositionGroups.message.NumberOfItems);
      // console.log("Scanning for updated items...\n");
      for (const atlasItem of availablePositionGroups.message.Pairs) {
        let localPositionGroups = await atlasService.getPositionGroupRelations(atlasItem);

        if (localPositionGroups) {
          if (localPositionGroups.position_group_id == atlasItem.PositionGroupID) {
            // console.log("position found in local position groups\n");
          }
          if (localPositionGroups.position_group_last_update != atlasItem.PositionGroupLastUpdateString) {
            positionUpdateList.push(atlasItem.PositionGroupID);
            positionPairUpdates.push(atlasItem);
          }
          if (localPositionGroups.provider_last_update != atlasItem.ProviderLastUpdateString) {
            providerUpdateList.push(atlasItem.ProviderID);
            providerPairUpdates.push(atlasItem);
          }
        } else {
          await atlasService.insertPositionGroupRelation([atlasItem]);
          // Insert provider to the local db
          try {
            let providerResults = await getProviderDetails(atlasItem.ProviderID, accessToken);
            let providersInsertArray = [];
            providersInsertArray.push(getProviderJson(providerResults.message));
            await atlasService.insertProvider(providersInsertArray);
          } catch (ex) {
            // console.log("Failed to fetch provider: " + ex.message);
          }

          // Insert position group to the local db
          try {
            let positionGroupResults = await getPositionGroupDetails(atlasItem.PositionGroupID, accessToken);
            let academics = getAcademicsByPosition(positionGroupResults.message.Academics);
            let positionsInsertArray = [];
            positionsInsertArray.push(getPosition(atlasItem, positionGroupResults.message, academics));
            await atlasService.insertPositionGroup(positionsInsertArray);
          } catch (ex) {
            // console.log("Failed to fetch position group: " + ex.message);
          }

          positionInsertList.push(atlasItem.PositionGroupID);
          providerInsertList.push(atlasItem.ProviderID);
          // console.log("finished the inserts they are");
        }
      }

      // console.log("positionInsertList: " + positionInsertList + " | " +
      //   "\n\npositionUpdateList: " + positionUpdateList + " | " +
      //   "\n\npositionPairUpdates: " + positionPairUpdates + " | " +
      //   "\n\nproviderInsertList: " + providerInsertList + " | " +
      //   "\n\nproviderUpdateList: " + providerUpdateList + " | " +
      //   "\n\nproviderPairUpdates: " + providerPairUpdates);

      let positionsArray = [];
      let providersArray = [];
      let count = 0;
      // Insert or update the records according to the lists above

      // Update the position if positionUpdateList is not empty
      for (const itemId of positionUpdateList) {
        // Find the details of the positions which are to be updated and update them locally
        let positionGroupResults = await getPositionGroupDetails(itemId, accessToken);
        let academics = [];

        academics.push(getAcademicsByPosition(positionGroupResults.message.Academics));

        try {
          let positionPushed = false;
          //console.log(" to be tested " + positionPairUpdates[count].PositionGroupLastUpdateString);
          positionsArray.push(getPosition(positionPairUpdates[count], positionGroupResults.message, academics));
          console.log(positionGroupResults.message);
          positionPushed = true;
          // reset the academics array
          academics = [];
        } catch (ex) {
          console.log("Failed to fetch position group: " + ex.message);
          if (positionPushed) positionsArray.pop();
          continue;
        }

        count++;
      }
      count = 0;

      // Update the position if providerUpdateList is not empty
      for (const providerId of providerUpdateList) {
        let providerResults = await getProviderDetails(providerId, accessToken);
        providersArray.push(getProviderJson(providerResults.message));
        console.log(providersArray);
      }

      // Update the positions list in the local db
      await atlasService.updatePositionsList(positionsArray);
      // Update the providers list in the local db
      await atlasService.updateProvidersList(providersArray);
      // Update the relations list in the local db
      await atlasService.updatePositionGroupRelationsList(providerPairUpdates);

      skip += batchSize;
    } while (skip < lastElement);
    return {
      message: 'done'
    };
  } catch (error) {
    console.log("ERROR -> " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while updating position group relations"
    };
  }
};

const insertOrUpdateAtlasTables = async () => {
  try {
    accessToken = await atlasLogin();

    // Lists to keep elements for update or insert and Sync local DB with Atlas
    let positionInsertList = [];
    let positionUpdateList = [];
    let positionPairUpdates = [];
    let providerInsertList = [];
    let providerUpdateList = [];
    let providerPairUpdates = [];
    let availablePositionGroups = [];

    // Get the count of position group pairs of the previous job run (the previous hour)
    let skip = await atlasService.getCountOfPositionPairs();
    const batchSize = 200;

    do {
      availablePositionGroups = await getAvailablePositionGroups(skip, batchSize, accessToken);
      // console.log("\nGetting skip/res->NumberOfItems");
      // console.log(availablePositionGroups.message.NumberOfItems);
      // console.log("Scanning for updated items...\n");

      for (const atlasItem of availablePositionGroups.message.Pairs) {
        let localPositionGroups = await atlasService.getPositionGroupRelations(atlasItem);

        if (localPositionGroups) {
          if (localPositionGroups.position_group_id == atlasItem.PositionGroupID) {
            // console.log("position found in local position groups\n");
          }
          if (localPositionGroups.position_group_last_update != atlasItem.PositionGroupLastUpdateString) {
            positionUpdateList.push(atlasItem.PositionGroupID);
            positionPairUpdates.push(atlasItem);
          }
          if (localPositionGroups.provider_last_update != atlasItem.ProviderLastUpdateString) {
            providerUpdateList.push(atlasItem.ProviderID);
            providerPairUpdates.push(atlasItem);
          }
        } else {
          // console.log("position not found in local position groups\n");
          // Insert atlasItem into atlas_position_group in local db
          await atlasService.insertPositionGroupRelation([atlasItem]);

          // Insert provider to the local db
          try {
            let providerResults = await getProviderDetails(atlasItem.ProviderID, accessToken);
            let providersInsertArray = [];
            providersInsertArray.push(getProviderJson(providerResults.message));
            await atlasService.insertProvider(providersInsertArray);
          } catch (ex) {
            // console.log("Failed to fetch provider: " + ex.message);
          }

          // Insert position group to the local db
          try {
            let positionGroupResults = await getPositionGroupDetails(atlasItem.PositionGroupID, accessToken);
            let academics = getAcademicsByPosition(positionGroupResults.message.Academics);
            let positionsInsertArray = [];
            positionsInsertArray.push(getPosition(atlasItem, positionGroupResults.message, academics));
            await atlasService.insertPositionGroup(positionsInsertArray);
          } catch (ex) {
            // console.log("Failed to fetch position group: " + ex.message);
          }

          positionInsertList.push(atlasItem.PositionGroupID);
          providerInsertList.push(atlasItem.ProviderID);
          // console.log("finished the inserts they are");
        }
      }

      // console.log("positionInsertList: " + positionInsertList + " | " +
      //   "\n\npositionUpdateList: " + positionUpdateList + " | " +
      //   "\n\npositionPairUpdates: " + positionPairUpdates + " | " +
      //   "\n\nproviderInsertList: " + providerInsertList + " | " +
      //   "\n\nproviderUpdateList: " + providerUpdateList + " | " +
      //   "\n\nproviderPairUpdates: " + providerPairUpdates);

      let positionsArray = [];
      let providersArray = [];
      let count = 0;
      // Insert or update the records according to the lists above

      // Update the position if positionUpdateList is not empty
      for (const itemId of positionUpdateList) {
        // Find the details of the positions which are to be updated and update them locally
        let positionGroupResults = await getPositionGroupDetails(itemId, accessToken);
        let academics = [];

        academics.push(getAcademicsByPosition(positionGroupResults.message.Academics));

        try {
          let positionPushed = false;
          //console.log(" to be tested " + positionPairUpdates[count].PositionGroupLastUpdateString);
          positionsArray.push(getPosition(positionPairUpdates[count], positionGroupResults.message, academics));
          console.log(positionGroupResults.message);
          positionPushed = true;
          // reset the academics array
          academics = [];
        } catch (ex) {
          console.log("Failed to fetch position group: " + ex.message);
          if (positionPushed) positionsArray.pop();
          continue;
        }

        count++;
      }
      count = 0;

      // Update the position if providerUpdateList is not empty
      for (const providerId of providerUpdateList) {
        let providerResults = await getProviderDetails(providerId, accessToken);
        providersArray.push(getProviderJson(providerResults.message));
        console.log(providersArray);
      }

      // Update the positions list in the local db
      await atlasService.updatePositionsList(positionsArray);
      // Update the providers list in the local db
      await atlasService.updateProvidersList(providersArray);
      // Update the relations list in the local db
      await atlasService.updatePositionGroupRelationsList(providerPairUpdates);

      skip += batchSize;
    } while (skip < availablePositionGroups.message.NumberOfItems);
    return {
      message: 'done'
    };
  } catch (error) {
    console.log("ERROR -> " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while updating position group relations"
    };
  }
};

const getAcademicsByPosition = (atlasAcademics) => {
  try {
    let academics = [];
    for (const key in atlasAcademics) {
      // console.log(atlasAcademics[key]);
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

const insertOrUpdateImmutableAtlasTables = async () => {
  try {
    // Get Atlas token
    let accessToken = await atlasLogin();
    // Make Atlas Requests
    let atlasCities = (await getFromAtlas(accessToken, "Cities")).result;
    let atlasCountries = (await getFromAtlas(accessToken, "Countries")).result;
    let atlasPhysicalObjects = (await getFromAtlas(accessToken, "PhysicalObjects")).result;
    let atlasPrefectures = (await getFromAtlas(accessToken, "Prefectures")).result;

    // console.log(atlasCities);

    // Insert or Update local DB
    if (Array.isArray(atlasCities) && atlasCities.length > 0)
      await atlasService.insertOrUpdateAtlasTable('cities', atlasCities);
    if (Array.isArray(atlasCountries) && atlasCountries.length > 0)
      await atlasService.insertOrUpdateAtlasTable('countries', atlasCountries);
    if (Array.isArray(atlasPhysicalObjects) && atlasPhysicalObjects.length > 0)
      await atlasService.insertOrUpdateAtlasTable('physicalObjects', atlasPhysicalObjects);
    if (Array.isArray(atlasPrefectures) && atlasPrefectures.length > 0)
      await atlasService.insertOrUpdateAtlasTable('prefectures', atlasPrefectures);

  } catch (error) {
    console.log("Error: " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while inserting or updating immutable Atlas tables"
    };
  }
};

const getPosition = (pair, atlasItem, academics) => {
  try {
    return ({
      'lastUpdateString': pair.PositionGroupLastUpdateString.replace("μμ", "pm").replace("πμ", "am"),
      'city': atlasItem.City,
      'title': atlasItem.Title,
      'description': atlasItem.Description,
      'positionType': atlasItem.PositionType,
      'availablePositions': atlasItem.AvailablePositions,
      'duration': atlasItem.Duration,
      'physicalObjects': atlasItem.PhysicalObjects,
      'providerId': atlasItem.ProviderID,
      'atlasPositionId': atlasItem.ID,
      'atlasCityId': atlasItem.CityID,
      'atlasCountryId': atlasItem.CountryID,
      'atlasPrefectureId': atlasItem.PrefectureID,
      'EndDate': atlasItem.EndDate,
      'EndDateString': atlasItem.EndDateString,
      'StartDate': atlasItem.StartDate,
      'StartDateString': atlasItem.StartDateString,
      'academics': academics
    });
  } catch (error) {
    throw Error(error.message);
  }
};

const getProviderJson = (item) => {
  return ({
    'atlasProviderId': item.ID,
    'afm': item.AFM,
    'name': item.Name,
    'providerContactEmail': item.ContactEmail,
    'providerContactName': item.ContactName,
    'providerContactPhone': item.ContactPhone
  });
};

const insertPositionGroup = async (accessToken) => {
  try {
    let begin = 0;
    let availablePositionGroups;

    do {
      const batchSize = 500; //100;

      // to know how much time it takes to complete each process
      let startTime, endTime;

      startTime = startStopTimer();

      availablePositionGroups = [];
      availablePositionGroups = await getAvailablePositionGroups(begin, batchSize, accessToken);

      let positionsArray = [];
      let providersArray = [];
      let relationsArray = [];

      for (const item of availablePositionGroups.message.Pairs) {
        let positionGroupId = item.PositionGroupID;
        let providerId = item.ProviderID;

        relationsArray.push({
          "PositionGroupID": item.PositionGroupID,
          "PositionGroupLastUpdateString": item.PositionGroupLastUpdateString,
          "ProviderID": item.ProviderID,
          "ProviderLastUpdateString": item.ProviderLastUpdateString
        });

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

        let positionPushed;
        try {
          positionPushed = false;

          let positionGroupLastUpdate = new Date(parseInt(item.PositionGroupLastUpdate.substr(6)));

          positionsArray.push({
            'lastUpdateString': positionGroupLastUpdate,
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
            'EndDate': MiscUtils.convertStartEndDateToTimestamp(positionGroupResults.message.EndDate),
            'EndDateString': positionGroupResults.message.EndDateString,
            'StartDate': MiscUtils.convertStartEndDateToTimestamp(positionGroupResults.message.StartDate),
            'StartDateString': positionGroupResults.message.StartDateString,
            'academics': academics
          });
          //console.log(positionGroupResults.message);
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
          console.log(`Failed to fetch provider or position group for posId: ${positionsArray[positionsArray.length - 1].atlasPositionId} exc: ${ex.message}`);
          if (positionPushed) positionsArray.pop();
          continue;
        }
      }

      endTime = startStopTimer();
      console.log("Time to fetch all position groups: " + calculateDurationInMinutes(startTime, endTime) + " mins");

      startTime = startStopTimer();

      // remove duplicates from provider's array
      let cleanedProviderArray = providersArray.filter((providersArray, index, self) =>
        index === self.findIndex((t) => t.atlasProviderId === providersArray.atlasProviderId));

      // console.log(cleanedProviderArray);
      await atlasService.insertProvider(cleanedProviderArray);
      await atlasService.insertPositionGroup(positionsArray);
      await atlasService.insertPositionGroupRelations(relationsArray);

      endTime = startStopTimer();
      console.log("Time to insert all position groups: " + calculateDurationInMinutes(startTime, endTime) + " mins");

      //console.log(atlasResponse.data.Result);

      begin += batchSize;
    } while (begin < availablePositionGroups.message.NumberOfItems);

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
      // url: ATLAS_URL + '/GetStudentDetails?StudentID=212468',
      url: ATLAS_URL + '/GetStudentDetails?AcademicIDNumber=' + academicIDNumber,
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
  } catch (error) {
    console.log("error while fetching registered student: " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while fetching registered student: " + error.message
    };
  }
};

const getStudentAcademicId = async (request, response) => {
  try {
    let studentTestAcIdNumber = await findAcademicIdNumber(98, '2022201400155');

    // console.log(atlasResponse.data.Result);
    let mes = studentTestAcIdNumber.message.AcademicIDNumber;
    return response.status(200).json({
      message: mes
    });
    // return response.status(200).json(positionsArray);
  } catch (error) {
    console.log("error while fetching available positions: " + error.message);
    return response.status(400).json({
      status: "400 bad request",
      message: "something went wrong while fetching available positions: " + error.message
    });
  }
};

const findAcademicIdNumber = async (academicId, studentNumber) => {
  try {
    let accessToken = await atlasLogin();
    const atlasResponse = await axios({
      url: ATLAS_URL + '/FindAcademicIdNumber',
      method: 'POST',
      data: { "AcademicID": academicId, "StudentNumber": studentNumber },
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionsArray = atlasResponse.data.Result;
    console.log(atlasResponse.data.Message);
    return {
      message: positionsArray,
      status: atlasResponse.status
    };
  } catch (error) {
    console.log("error while finding academic id number: " + error.message);
    return {
      status: "400 bad request",
      message: "error while finding academic id number: " + error.message
    };
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
      url: ATLAS_URL + '/RegisterNewStudent',
      method: 'POST',
      data: { "AcademicIDNumber": AcademicIDNumber },
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionsArray = atlasResponse.data.Result;
    console.log(atlasResponse.data.Message);
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

const testDeletePosition = async (request, response) => {
  try {
    let deleteResult = await deletePosition('assigned', 38);

    return response.status(200).json(deleteResult);
  } catch (error) {
    return response.status(400).json({ "message": "error deleting position" });
  }
};

const deletePosition = async (type, positionId) => {
  let accessToken = await atlasLogin();
  let atlasResponse;
  let path;

  switch (type) {
    case 'preassigned':
      path = 'RollbackPreAssignment';
      break;
    case 'assigned':
      path = 'DeleteAssignment';
      break;
    case 'finished':
      path = 'DeleteFinishedPosition';
      break;
  }

  atlasResponse = await axios({
    url: ATLAS_URL + '/' + path,
    method: 'POST',
    data: { "PositionID": positionId },
    headers: {
      'Content-Type': 'application/json',
      'access_token': accessToken
    }
  });
  console.log(atlasResponse.data.Message);
  console.log(atlasResponse.data.Result);
  let requestResult = atlasResponse.data.Success;

  return requestResult;
};

/**
* Returns preassigned positions of group, if none is found it preassigns a single position
*/
const getPositionPreassignment = async (groupId, academicId) => {
  try {
    let accessToken = await atlasLogin();
    let atlasResponse;

    atlasResponse = await axios({
      url: ATLAS_URL + '/GetPreAssignedPositions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionIds = [];
    let positionData = [];

    if (atlasResponse.data.Result != null && atlasResponse.data.Result.length != 0) {
      console.log("preassigned positions exist");
      for (position of atlasResponse.data.Result) {
        if (position.GroupID == groupId /*&& position.PreAssignedForAcademic.ID == academicId*/) {
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
        url: ATLAS_URL + '/PreAssignPositions',
        method: 'POST',
        data: { "GroupID": groupId, "NumberOfPositions": 1, "AcademicID": academicId },
        headers: {
          'Content-Type': 'application/json',
          'access_token': accessToken
        }
      });

      positionIds = atlasResponse.data.Result;
      if (atlasResponse.data.Success == true) {
        console.log('Προδέσμευση θέσης από φοιτητή GroupID:' + groupId + 'AcademiID:' + academicId + 'PositionID:' + positionIds[0]);
        positionData.push({
          "ImplementationEndDate": position.ImplementationEndDate,
          "ImplementationEndDateString": position.ImplementationEndDateString,
          "ImplementationStartDate": position.ImplementationStartDate,
          "ImplementationStartDateString": position.ImplementationStartDateString,
        });
      } else {
        console.log('Παρουσιάστηκε σφάλμα κατά την προδεσμευση θέσης στο ΑΤΛΑΣ');
        console.log('Aποτυχία προδέσμευσης θέσης από φορέα GroupID: ' + groupId + '  AcademicID: ' + academicId /*+ ' PositionID: ' + positionIds[0]*/);
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

    // FOR TESTING PURPOSES
    let startDateStr = "2014-01-09 10:12:11";
    const startDate = new Date((startDateStr == null) ? 0000 : startDateStr + "Z");
    const endDate = new Date("2014-01-09T10:12:12.000Z");
    let startDateValue = startDate.valueOf();
    let endDateValue = endDate.valueOf();

    console.log(startDate.valueOf());
    console.log(endDate.valueOf());

    let representation = `\\/Date(${startDateValue}000)\\/`;
    let representation2 = `\\/Date(${endDateValue}000)\\/`;
    console.log(representation);
    console.log(representation2);

    positionsPreassignedData.positionData[0].ImplementationStartDate = representation;
    positionsPreassignedData.positionData[0].ImplementationEndDate = representation2;
    // END TESTING

    let assignmentData =
    {
      // "FundingType": null,
      //"ImplementationStartDate": positionsPreassignedData.positionData[0].ImplementationStartDate,
      "ImplementationStartDateString": "3/6/13",
      "ImplementationStartDateStringFormat": "d/M/yy",
      //"ImplementationEndDate": positionsPreassignedData.positionData[0].ImplementationEndDate,
      "ImplementationEndDateString": "3/9/13",
      "ImplementationEndDateStringFormat": "d/M/yy",
      "PositionID": positionsPreassignedData.positionIds[0],
      "StudentID": studentId
    };

    console.log(assignmentData);

    const atlasResponse = await axios({
      url: ATLAS_URL + '/AssignStudent',
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

    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetFundingType?positionID=' + positionId,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    let positionFundingType = atlasResponse.data.Result == null ? null : atlasResponse.data.Result.FundingType;
    return {
      message: positionFundingType,
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
      url: ATLAS_URL + '/GetAvailablePositionGroups',
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

const getFundingTypes = async (request, response) => {
  try {
    let accessToken = await atlasLogin();
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetFundingTypes',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    return response.status(200).json(atlasResponse.data.Result);
  } catch (error) {
    return response.status(400).json({ "message": "error retrieving funding types" });
  }
};

const testIfTokenIsValid = async (accessToken) => {
  try {
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetFundingTypes',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    return true;
  } catch (error) {
    return false;
  }
};


const getRegisteredStudents = async (request, response) => {
  try {
    let accessToken = await atlasLogin();
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetRegisteredStudents',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    return response.status(200).json(atlasResponse.data.Result);
  } catch (error) {
    return response.status(400).json({ "message": "error retrieving funding types" });
  }
};

const getAssignedPositions = async (request, response) => {
  try {
    let accessToken = await atlasLogin();
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetAssignedPositions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    return response.status(200).json(atlasResponse.data.Result);
  } catch (error) {
    return response.status(400).json({ "message": "error retrieving assigned positions" });
  }
};

// Start the timer
const startStopTimer = () => {
  return moment();
};

// Stop the timer and return the duration in minutes
const calculateDurationInMinutes = (startTime, endTime) => {
  const durationInMinutes = moment.duration(endTime.diff(startTime)).asMinutes();
  return durationInMinutes;
};

module.exports = {
  getRegisteredStudents,
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
  getStudentAcademicId,
  getFundingType,
  getFundingTypes,
  getAssignedPositions,
  registerNewStudent,
  assignStudent,
  insertTablesFromAtlas,
  insertPositionGroup,
  insertOrUpdateAtlasTables,
  insertOrUpdateWholeAtlasTables,
  insertOrUpdateImmutableAtlasTables,
  findAcademicIdNumber,
  testDeletePosition
};
