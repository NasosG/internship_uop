const axios = require("axios");
const atlasService = require("../services/atlasService");
const MiscUtils = require("../utils/MiscUtils.js");
require('dotenv').config();
const moment = require('moment');
// Logging
const logger = require('../config/logger');

// Global variables
const ATLAS_URL = (process.env.ATLAS_ENV !== 'PROD') ? process.env.ATLAS_PILOT_NEW : process.env.ATLAS_PROD;

// Atlas login - if token is valid, it is returned; else a new one is acquired
const atlasLogin = async (uid = false, username = null, password = null) => {
  let credentials;
  try {
    // credentials retrieved by the db
    credentials = await atlasService.getCredentials();
    const accessToken = credentials.access_token;
    const tokenIsValid = await testIfTokenIsValid(accessToken);

    if (/*accessToken != null &&*/ tokenIsValid) {
      logger.info("access token is valid");
      return accessToken;
    }
  } catch (error) {
    logger.info("Error while fetching credentials:", error.message);
    return null;
  }
  try {
    if (credentials.username == null || credentials.password == null) return null;
    const loginData = {
      'Username': credentials.username,
      'Password': credentials.password
    };
    // const loginData = {
    //   'Username': username || credentials.username,
    //   'Password': password || credentials.password
    // };

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
    logger.info('Error', error.message);
    return null;
  }
};

const getInstitutions = async (request, response) => {
  try {
    const institutions = await atlasService.getInstitutions();
    response.status(200).json(institutions);
  } catch (error) {
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getAEIInstitutions = async (request, response) => {
  try {
    const institutions = await atlasService.getAEIInstitutions();
    response.status(200).json(institutions);
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
      logger.info("error in populating department array: " + error.message);
    }

    await atlasService.insertDepartmentIds(departments, UOP_INSITUTION_ID);

    return {
      message: departments,
      status: atlasResponse.status
    };
  } catch (error) {
    logger.info("An error occured while fetching academics");
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
    logger.info("something went wrong while fetching provider's details" + error.message);
    // return { message: "something went wrong while fetching provider's details" };
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
  logger.info("prefectures");
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
  logger.info("countries");
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
    const results = await atlasService.getAvailablePositionsUI(offset, limit);
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
    logger.info("error while fetching available positions from db: " + error.message);
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
    logger.info("error while fetching available positions from db: " + error.message);
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
    logger.info("error while fetching available positions from db: " + error.message);
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
    logger.error(error.message);
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
    lastElement = Number.parseInt(lastElement);

    const batchSize = 500;

    do {
      availablePositionGroups = await getAvailablePositionGroups(skip, batchSize, accessToken);
      // logger.info("\nGetting skip/res->NumberOfItems");
      // logger.info(availablePositionGroups.message.NumberOfItems);
      // logger.info("Scanning for updated items...\n");
      for (const atlasItem of availablePositionGroups.message.Pairs) {
        let localPositionGroups = await atlasService.getPositionGroupRelations(atlasItem);

        if (localPositionGroups) {
          if (localPositionGroups.position_group_id == atlasItem.PositionGroupID) {
            // logger.info("position found in local position groups\n");
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
            // logger.info("Failed to fetch provider: " + ex.message);
          }

          // Insert position group to the local db
          try {
            let positionGroupResults = await getPositionGroupDetails(atlasItem.PositionGroupID, accessToken);
            let academics = getAcademicsByPosition(positionGroupResults.message.Academics);
            let positionsInsertArray = [];
            positionsInsertArray.push(getPosition(atlasItem, positionGroupResults.message, academics));
            await atlasService.insertPositionGroup(positionsInsertArray);
          } catch (ex) {
            // logger.info("Failed to fetch position group: " + ex.message);
          }

          positionInsertList.push(atlasItem.PositionGroupID);
          providerInsertList.push(atlasItem.ProviderID);
          // logger.info("finished the inserts they are");
        }
      }

      // logger.info("positionInsertList: " + positionInsertList + " | " +
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
          //logger.info(" to be tested " + positionPairUpdates[count].PositionGroupLastUpdateString);
          positionsArray.push(getPosition(positionPairUpdates[count], positionGroupResults.message, [...academics]));
          logger.info(positionGroupResults.message);
          positionPushed = true;
          // reset the academics array
          academics = [];
        } catch (ex) {
          logger.info("Failed to fetch position group: " + ex.message);
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
        logger.info(providersArray);
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
    logger.info("insertOrUpdateWholeAtlasTables - ERROR -> " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while updating position group relations"
    };
  }
};

const insertOrUpdateAtlasTables = async (/*emergency = 0*/) => {
  try {
    // accessToken = emergency == 1 ? await atlasLogin(false, 'pa_user', 'pa_pass') : await atlasLogin();
    accessToken = await atlasLogin();
    // Lists to keep elements for update or insert and Sync local DB with Atlas
    let positionInsertList = [];
    let positionUpdateList = [];
    let positionPairUpdates = [];
    let providerInsertList = [];
    let providerUpdateList = [];
    let providerPairUpdates = [];
    let availablePositionGroups;

    // Get the count of position group pairs of the previous job run (the previous hour)
    let skip = 0;//await atlasService.getCountOfPositionPairs();
    // skip = Number.parseInt(skip);
    const batchSize = 200;

    let SKIP_VALUES = [400, 600, 800];
    let selectedSkipValue = 800;

    let itemsAtlas = await getAvailablePositionGroups(0, 1, accessToken);
    let numberOfItems = itemsAtlas.message.NumberOfItems;
    logger.info(numberOfItems);
    do {
      availablePositionGroups = [];

      logger.info('Processing batch ' + skip + ' to ' + (skip + batchSize) + ' of ' + numberOfItems + ' items');

      availablePositionGroups = await getAvailablePositionGroups(skip, batchSize, accessToken);
      if (availablePositionGroups?.status == "400 bad request") {
        logger.error(`Fetching position groups error: ${availablePositionGroups.message}`);

        if (availablePositionGroups?.message.includes('Request failed with status code 403')) {
          await MiscUtils.sleep(1200000); // Sleep for 20 minutes
        }
        // Change 23/03/24 just skip the batch - it's not correct
        // TODO change it 25/03 - 30/03
        // skip += (batchSize / 2);
        continue;
      }

      for (const atlasItem of availablePositionGroups.message.Pairs) {
        let localPositionGroups = await atlasService.getPositionGroupRelations(atlasItem);

        if (localPositionGroups) {
          if (localPositionGroups.position_group_id == atlasItem.PositionGroupID) {
            // logger.info("position found in local position groups\n");
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
          // logger.info("position not found in local position groups\n");
          // Insert atlasItem into atlas_position_group in local db
          await atlasService.insertPositionGroupRelation([atlasItem]);

          // Insert provider to the local db
          try {
            let providerResults = await getProviderDetails(atlasItem.ProviderID, accessToken);
            let providersInsertArray = [];
            providersInsertArray.push(getProviderJson(providerResults.message));
            await atlasService.insertProvider(providersInsertArray);
          } catch (ex) {
            // logger.info("Failed to fetch provider: " + ex.message);
          }

          // Insert position group to the local db
          try {
            let positionGroupResults = await getPositionGroupDetails(atlasItem.PositionGroupID, accessToken);
            let academics = getAcademicsByPosition(positionGroupResults.message.Academics);
            let positionsInsertArray = [];
            positionsInsertArray.push(getPosition(atlasItem, positionGroupResults.message, academics));
            await atlasService.insertPositionGroup(positionsInsertArray);
          } catch (ex) {
            // logger.info("Failed to fetch position group: " + ex.message);
          }

          positionInsertList.push(atlasItem.PositionGroupID);
          providerInsertList.push(atlasItem.ProviderID);
          // logger.info("finished the inserts they are");
        }
      }

      // logger.info("positionInsertList: " + positionInsertList + " | " +
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
          if (!positionGroupResults.message?.ID) {
            logger.error(`Insert - Missing ID in position group message. Skipping position ${itemId} ...`);
            continue;
          }
          //logger.info(" to be tested " + positionPairUpdates[count].PositionGroupLastUpdateString);
          positionsArray.push(getPosition(positionPairUpdates[count], positionGroupResults.message, academics));
          // logger.info(positionGroupResults.message);
          positionPushed = true;
          // reset the academics array
          academics = [];
        } catch (ex) {
          logger.info("Failed to fetch position group: " + ex.message);
          if (positionPushed) positionsArray.pop();
          continue;
        }

        count++;
      }
      count = 0;

      // Update the position if providerUpdateList is not empty
      for (const providerId of providerUpdateList) {
        let providerPushed = false;
        try {
          let providerResults = await getProviderDetails(providerId, accessToken);

          if (!providerResults.message?.ID) {
            logger.error(`Insert - Missing ID for provider. Skipping provider ${providerId ?? -1} ...`);
            continue;
          }

          providersArray.push(getProviderJson(providerResults?.message));
          providerPushed = true;
        } catch (ex) {
          logger.info(`Exception in provider fetching - providerId: ${providerId}. Error: ${ex.message}`);
          if (providerPushed) providersArray.pop();
          continue;
        }
      }

      // Update the positions list in the local db
      await atlasService.updatePositionsList(positionsArray);
      // Update the providers list in the local db
      await atlasService.updateProvidersList(providersArray);
      // Update the relations list in the local db
      await atlasService.updatePositionGroupRelationsList(providerPairUpdates);

      skip += batchSize;

      // Sleep to prevent API rate limit issues - added 28/03/2025
      // if (skip % selectedSkipValue == 0) {
      //   SKIP_VALUES = [skip + 400, skip + 600, skip + 800];
      //   selectedSkipValue = SKIP_VALUES[Math.floor(Math.random() * SKIP_VALUES.length)];

      //   const MIN_SLEEP_MS = parseInt(process.env.MIN_SLEEP_MS, 10) || 480_000; // Default: 8 minutes
      //   const MAX_SLEEP_MS = parseInt(process.env.MAX_SLEEP_MS, 10) || 600_000; // Default: 10 minutes

      //   // Have a random number so that requests appear less automated to AWS, also 8-10 minutes seem to work
      //   let randomMilliseconds = Math.floor(Math.random() * (MIN_SLEEP_MS - MAX_SLEEP_MS + 1)) + MIN_SLEEP_MS;
      //   let randomMinutes = (randomMilliseconds / 1000 / 60).toFixed(2);
        
      //   logger.info(`Sleeping for ${randomMinutes} minutes to avoid rate limiting...`);
        
      //   await MiscUtils.sleep(randomMilliseconds);
      // }

      logger.info(`Checking skip=${skip}, condition: ${skip % 1000 == 0}`);
      if (skip % 1000 == 0) {
        const MIN_SLEEP_MS = 2600000; 
        const MAX_SLEEP_MS = 3000000;

        // Have a random number so that requests appear less automated to AWS, also 8-10 minutes seem to work
        let randomMilliseconds = Math.floor(Math.random() * (MAX_SLEEP_MS - MIN_SLEEP_MS + 1)) + MIN_SLEEP_MS;
        let randomMinutes = (randomMilliseconds / 1000 / 60).toFixed(2);

        logger.info(`Sleeping for ${randomMinutes} minutes to avoid rate limiting...`);

        await MiscUtils.sleep(randomMilliseconds);
      }

    } while (skip < numberOfItems);
    return {
      message: 'done'
    };
  } catch (error) {
    logger.info("insertOrUpdateAtlasTables - ERROR -> " + error.message);
    logger.info("Stack Trace: " + error.stack);
    return {
      status: "400 bad request",
      message: "something went wrong while updating position group relations"
    };
  }
};

const syncAtlasPositionGroup = async (request, response) => {
  try {
    const positionGroupID = Number(request.params.id);
    const accessToken = await atlasLogin();

    logger.info('insertAtlasPositionGroup for position ' + positionGroupID);

    // Insert position group to the local DB
    let positionGroupResults = await getPositionGroupDetails(positionGroupID, accessToken);
    let academics = getAcademicsByPosition(positionGroupResults.message.Academics);
    let providerResults = await getProviderDetails(positionGroupResults.message.ProviderID, accessToken);

    let dateString = '2025-01-01 18:03:40.713';
    // let availablePositionGroups;

    // let skip = 0;
    // const batchSize = 200;
    
    // let itemsAtlas = await getAvailablePositionGroups(0, 1, accessToken);
    // let numberOfItems = itemsAtlas.message.NumberOfItems;
    // logger.info(numberOfItems);

    // let lastElement = await atlasService.getCountOfPositionPairs();
    // lastElement = Number.parseInt(lastElement);
    // do {
    //   availablePositionGroups = [];
    //   availablePositionGroups = await getAvailablePositionGroups(skip, batchSize, accessToken);
    //   if (availablePositionGroups?.status == "400 bad request") {
    //     logger.error(`Fetching position groups error: ${availablePositionGroups.message}`);
    //     skip++;
    //     continue;
    //   }

    //   for (const atlasItem of availablePositionGroups.message.Pairs) {
    //     if (positionGroupID == atlasItem.PositionGroupID)
    //       dateString = atlasItem.PositionGroupLastUpdateString;
    //   }

    //   skip += batchSize;
    // } while (skip < lastElement);

    // const dateString = "2010-01-01T00:00:00.000Z";
    const pair = { PositionGroupLastUpdate: dateString };
    const positionsInsertArray = [getPosition(pair, positionGroupResults.message, academics)];
    const providersInsertArray = [getProviderJson(providerResults.message)];

    positionsInsertArray.lastUpdateString = dateString;
    const defaultUpdateDate = '01/01/2025 18:03:40';

    const positionData = [
      {
        PositionGroupID: positionGroupResults.message.ID,
        PositionGroupLastUpdateString: defaultUpdateDate,
        ProviderID: positionGroupResults.message.ProviderID,
        ProviderLastUpdateString: defaultUpdateDate
      }
    ];

    // Insert position group and provider details
    await Promise.all([
      atlasService.insertProvider(providersInsertArray),
      atlasService.insertPositionGroup(positionsInsertArray),
      atlasService.insertPositionGroupRelation([positionData])
    ]);

    response.status(201).json({ message: 'done', status: 'success' });
  } catch (error) {
    logger.info("insertAtlasPositionGroup - ERROR -> " + error.message);
    logger.info("Stack Trace: " + error.stack);
    response.status(400).json({
      status: "400 bad request",
      message: "An error occurred while synchronizing positions - insertAtlasPositionGroup failed"
    });
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

const insertOrUpdateImmutableAtlasTables = async () => {
  try {
    // Get Atlas token
    let accessToken = await atlasLogin();
    // Make Atlas Requests
    let atlasCities = (await getFromAtlas(accessToken, "Cities")).result;
    let atlasCountries = (await getFromAtlas(accessToken, "Countries")).result;
    let atlasPhysicalObjects = (await getFromAtlas(accessToken, "PhysicalObjects")).result;
    let atlasPrefectures = (await getFromAtlas(accessToken, "Prefectures")).result;

    // logger.info(atlasCities);

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
    logger.info("Error: " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while inserting or updating immutable Atlas tables"
    };
  }
};

const getPosition = (pair, atlasItem, academics) => {
  try {
    if (!atlasItem.ID) logger.error("getPosition ID IS NULL ");
    let positionGroupLastUpdate = new Date(parseInt(pair.PositionGroupLastUpdate.substr(6)));

    return ({
      'lastUpdateString': positionGroupLastUpdate,
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
      'EndDate': MiscUtils.convertStartEndDateToTimestamp(atlasItem.EndDate),
      'EndDateString': atlasItem.EndDateString,
      'StartDate': MiscUtils.convertStartEndDateToTimestamp(atlasItem.StartDate),
      'StartDateString': atlasItem.StartDateString,
      'academics': academics
    });
  } catch (error) {
    logger.error("getPosition " + error.message);
    throw Error(error.message);
  }
};

const getProviderJson = (item) => {
  if (!item?.ID) logger.error("atlasProvider ID IS NULL ");
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
          // logger.info(atlasAcademics[key]);
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
          //logger.info(positionGroupResults.message);
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
          logger.info(`Failed to fetch provider or position group for posId: ${positionsArray[positionsArray.length - 1].atlasPositionId} exc: ${ex.message}`);
          if (positionPushed) positionsArray.pop();
          continue;
        }
      }

      endTime = startStopTimer();
      logger.info("Time to fetch all position groups: " + calculateDurationInMinutes(startTime, endTime) + " mins");

      startTime = startStopTimer();

      // remove duplicates from provider's array
      let cleanedProviderArray = providersArray.filter((providersArray, index, self) =>
        index === self.findIndex((t) => t.atlasProviderId === providersArray.atlasProviderId));

      // logger.info(cleanedProviderArray);
      await atlasService.insertProvider(cleanedProviderArray);
      await atlasService.insertPositionGroup(positionsArray);
      await atlasService.insertPositionGroupRelations(relationsArray);

      endTime = startStopTimer();
      logger.info("Time to insert all position groups: " + calculateDurationInMinutes(startTime, endTime) + " mins");

      //logger.info(atlasResponse.data.Result);

      begin += batchSize;
    } while (begin < availablePositionGroups.message.NumberOfItems);

    return {
      message: 'done'
    };
  } catch (error) {
    logger.info("insertPositionGroup - ERROR -> " + error.message);
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

    // logger.info(atlasResponse.data.Result);
    let positionsArray = atlasResponse.data.Result;
    return {
      message: positionsArray,
      status: atlasResponse.status
    };
  } catch (error) {
    logger.info("error while fetching registered student: " + error.message);
    return {
      status: "400 bad request",
      message: "something went wrong while fetching registered student: " + error.message
    };
  }
};

// For testing purposes only
const getStudentAcademicId = async (request, response) => {
  try {
    let studentTestAcIdNumber = await findAcademicIdNumber(98, '2022201400155');

    // logger.info(atlasResponse.data.Result);
    let mes = studentTestAcIdNumber.message.AcademicIDNumber;
    return response.status(200).json({
      message: mes
    });
    // return response.status(200).json(positionsArray);
  } catch (error) {
    logger.info("error while fetching student academic ID: " + error.message);
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
    logger.info(atlasResponse.data.Message);
    return {
      message: positionsArray,
      status: atlasResponse.status
    };
  } catch (error) {
    logger.info("error while finding academic id number: " + error.message);
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
    logger.info(atlasResponse.data.Message);
    return {
      message: positionsArray,
      status: atlasResponse.status
    };
    // return response.status(200).json(positionsArray);
  } catch (error) {
    logger.info("error while registering new student: " + error.message);
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
  logger.info(atlasResponse.data.Message);
  logger.info(atlasResponse.data.Result);
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
    const preassigned = atlasResponse.data.Result;

    if (preassigned && preassigned.length > 0) {
      logger.info("preassigned positions exist");
      preassigned.forEach((position) => {
        if (parseInt(position.GroupID) === parseInt(groupId) && position.PreAssignedForAcademic.ID == academicId) {
          positionIds.push(position.ID);
          positionData.push({
            "ImplementationEndDate": position.ImplementationEndDate,
            "ImplementationEndDateString": position.ImplementationEndDateString,
            "ImplementationStartDate": position.ImplementationStartDate,
            "ImplementationStartDateString": position.ImplementationStartDateString,
          });
        }
      });
    }

    // If no position is found, preassign a single position
    if (positionIds.length === 0) {
      const args = {
        "GroupID": groupId, "NumberOfPositions": 1, "AcademicID": academicId,
      };

      atlasResponse = await axios({
        url: ATLAS_URL + '/PreAssignPositions',
        method: 'POST',
        data: args,
        headers: {
          'Content-Type': 'application/json',
          'access_token': accessToken
        }
      });

      positionIds = atlasResponse.data.Result;
      if (atlasResponse.data.Success == true) {
        logger.info('Προδέσμευση θέσης από φοιτητή GroupID: ' + groupId + ' AcademiID: ' + academicId + ' PositionID: ' + positionIds[0]);
        // TODO: change this to get implementation dates correctly from atlas
        positionData.push({
          "ImplementationEndDate": null,
          "ImplementationEndDateString": '',
          "ImplementationStartDate": null,
          "ImplementationStartDateString": '',
        });
      } else {
        logger.info('Παρουσιάστηκε σφάλμα κατά την προδέσμευση θέσης στο ΑΤΛΑΣ ' + atlasResponse.data.Message);
        logger.info('Aποτυχία προδέσμευσης θέσης από φορέα GroupID: ' + groupId + '  AcademicID: ' + academicId /*+ ' PositionID: ' + positionIds[0]*/);
        throw new Error('Παρουσιάστηκε σφάλμα κατά την προδέσμευση θέσης στο ΑΤΛΑΣ ' + atlasResponse.data.Message);
      }
    }

    return {
      positionIds,
      positionData
    };
  } catch (error) {
    logger.info("error while fetching preassigned positions: " + error.message);
    logger.info(error.stack);
    return {
      status: "Error occurred",
      message: error.message
    };
  }
};

/**
* Returns preassigned positions of group, if none is found it preassigns a single position
*/
const assignStudent = async (positionsPreassignedData, studentId, isTei = false, implementationDates = null) => {
  try {
    let accessToken = await atlasLogin();

    let assignmentData;
    logger.info('atlas_before_dates');
    const { implementation_start_date, implementation_end_date } = implementationDates;

    logger.info(implementation_start_date);
    logger.info(implementation_end_date);
    // TODO: refactor it / extract to functions
    let implementationStartDate = positionsPreassignedData.positionData[0].ImplementationStartDateString || implementation_start_date;
    let implementationEndDate = positionsPreassignedData.positionData[0].ImplementationEndDateString || implementation_end_date;

    const isWrongFormatStart = moment(implementationStartDate, 'DD/MM/YYYY', true).isValid();
    const isWrongFormatEnd = moment(implementationEndDate, 'DD/MM/YYYY', true).isValid();

    if (isWrongFormatStart) {
      implementationStartDate = moment(implementationStartDate, 'DD/MM/YYYY').format('D/M/YY');
    }
    if (isWrongFormatEnd) {
      implementationEndDate = moment(implementationEndDate, 'DD/MM/YYYY').format('D/M/YY');
    }

    assignmentData =
    {
      // "FundingType": null,
      "ImplementationStartDateString": implementationStartDate,
      "ImplementationStartDateStringFormat": "d/M/yy",
      "ImplementationEndDateString": implementationEndDate,
      "ImplementationEndDateStringFormat": "d/M/yy",
      "PositionID": positionsPreassignedData.positionIds[0],
      "StudentID": studentId
    };

    logger.info(assignmentData);

    const atlasResponse = await axios({
      url: ATLAS_URL + '/AssignStudent',
      method: 'POST',
      data: assignmentData,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    logger.info('atlas reponse ');
    logger.info(atlasResponse.data);

    return {
      message: atlasResponse.data
    };
  } catch (error) {
    logger.error("error while assigning student to Atlas: " + error.message);
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
    logger.info("error while fetching available position groups: " + error.message);
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

    // return result depending whether /GetFundingTypes succeeded
    if (atlasResponse.data.success) {
      return true;
    }

    return false;

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

const getAssignedPositions = async () => {
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

    return atlasResponse.data.Result;
  } catch (error) {
    return { "message": "error retrieving assigned positions" };
  }
};

const getAssignedPositionsPerBatch = async (nextBatchItemsNo) => {
  try {
    let requestData = {
      'Skip': nextBatchItemsNo,
      'Take': 200
    };

    let accessToken = await atlasLogin();
    const atlasResponse = await axios({
      url: ATLAS_URL + '/GetAssignedPositions',
      method: 'POST',
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      }
    });

    return atlasResponse.data.Result;
  } catch (error) {
    return { "message": "error retrieving assigned positions" };
  }
};

const getAssignedPositionByIdHandler = async (request, response) => {
  try {
    const atlasPositionId = parseInt(request.params.id);

    const batchSize = 200;
    let nextBatchItemsNo = 0;
    let positionFound = {};

    while (positionFound.status != MiscUtils.AssignedPositionStatus.NO_MORE_DATA &&
      positionFound.status != MiscUtils.AssignedPositionStatus.FOUND
    ) {
      positionFound = await getAssignedPositionById(atlasPositionId, nextBatchItemsNo);
      nextBatchItemsNo += batchSize;
    }

    if (positionFound.status != MiscUtils.AssignedPositionStatus.NO_MORE_DATA &&
      positionFound.status != MiscUtils.AssignedPositionStatus.FOUND
    ) {
      return response.status(404).json({ "message": "Assigned position not found" });
    }

    return response.status(200).json({
      "ImplementationEndDateString": positionFound.ImplementationEndDateString,
      "ImplementationStartDateString": positionFound.ImplementationStartDateString,
    });
  } catch (error) {
    logger.error(error.message);
    return response.status(400).json({ "message": "error retrieving assigned positions" });
  }
};

const getAssignedPositionById = async (atlasPositionId, nextBatchItemsNo) => {
  try {
    const assignedPositions = await getAssignedPositionsPerBatch(nextBatchItemsNo);

    if (!assignedPositions || assignedPositions.length == 0) {
      return {
        "status": MiscUtils.AssignedPositionStatus.NO_MORE_DATA,
        "ImplementationEndDateString": null,
        "ImplementationStartDateString": null
      };
    }

    const position = assignedPositions.find(position => position.ID == atlasPositionId);

    if (!position) {
      return {
        status: MiscUtils.AssignedPositionStatus.NOT_FOUND,
        ImplementationEndDateString: null,
        ImplementationStartDateString: null
      };
    }

    return {
      "status": MiscUtils.AssignedPositionStatus.FOUND,
      "ImplementationEndDateString": position.ImplementationEndDateString,
      "ImplementationStartDateString": position.ImplementationStartDateString
    };

  } catch (error) {
    logger.error(error.message);
    throw error("getAssignedPositionById: error retrieving assigned positions");
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

const getStudentPositionMatchesAcademic = async (request, response) => {
  try {
    const positionId = request.query.positionId;
    const academicId = request.query.academicId;

    // logger.info(companyName + " " + companyAFM);
    const doesStudentPositionMatchDepartment = await atlasService.checkAtlasPositionAcademicsMatchStudents(positionId, academicId);

    response.status(200).json(doesStudentPositionMatchDepartment);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const completePosition = async (request, response) => {
  try {
    const positionData = new PositionAssignedModel(request.body);

    let accessToken = await atlasLogin();
    const completePositionResponse = await axios({
      url: ATLAS_URL + '/api/offices/v1/CompletePosition',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: positionData
    });

    return response.status(200).json(completePositionResponse.data);
  } catch (error) {
    return response.status(400).json({ "message": "error completing position" });
  }
};

const changeImplementationData = async (positionData) => {
  try {
    let accessToken = await atlasLogin();
    const changeImplementationDataResponse = await axios({
      url: ATLAS_URL + '/ChangeImplementationData',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: positionData
    });

    return { result: changeImplementationDataResponse.data, "status": "success" };
  } catch (error) {
    logger.error(error.message);
    return { "message": "error changing implementation data" };
  }
};

const completePositionRequest = async (positionData) => {
  try {
    let accessToken = await atlasLogin();
    const completePositionResponse = await axios({
      url: ATLAS_URL + '/CompletePosition',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: positionData
    });

    return { result: completePositionResponse.data, "status": "success" };
  } catch (error) {
    logger.error(error.message);
    return { "message": "error changing implementation data" };
  }
};

const changeImplementationDatesAtlas = async (request, response) => {
  try {
    const { id: assignedPositionId } = request.params;
    const { implementationDates } = request.body;
    const { implementation_start_date, implementation_end_date } = implementationDates;

    logger.info("changeImplementationDatesAtlas assigned_position: " + assignedPositionId);

    const implementationStartDate = MiscUtils.convertDateFromYearMonthDayToDayMonthYear(implementation_start_date);
    const implementationEndDate = MiscUtils.convertDateFromYearMonthDayToDayMonthYear(implementation_end_date);

    logger.info("changeImplementationDatesAtlas start_date: " + implementationStartDate);
    logger.info("changeImplementationDatesAtlas end_date: " + implementationEndDate);

    const assignmentData = {
      "PositionID": assignedPositionId,
      "ImplementationStartDateString": implementationStartDate,
      "ImplementationStartDateStringFormat": "d/M/yy",
      "ImplementationEndDateString": implementationEndDate,
      "ImplementationEndDateStringFormat": "d/M/yy"
    };

    await changeImplementationData(assignmentData);
    return response.status(200).json({ "message": "success changing implementation data" });

  } catch (error) {
    logger.error(error.message);
    return response.status(400).json({ "message": "error changing implementation data" });
  }
};

const completeAtlasPosition = async (request, response) => {
  try {
    const { id: assignedPositionId } = request.params;
    const { implementationDates, completionComments } = request.body;
    const { implementation_start_date, implementation_end_date } = implementationDates;

    logger.info("completeAtlasPosition assigned_position: " + assignedPositionId);

    const implementationStartDate = MiscUtils.convertDateFromYearMonthDayToDayMonthYear(implementation_start_date);
    const implementationEndDate = MiscUtils.convertDateFromYearMonthDayToDayMonthYear(implementation_end_date);

    logger.info("completeAtlasPosition start_date: " + implementationStartDate);
    logger.info("completeAtlasPosition end_date: " + implementationEndDate);
    logger.info("completeAtlasPosition completionComments: " + completionComments);

    const positionData = {
      "PositionID": assignedPositionId,
      "CompletionComments": completionComments,
      "ImplementationStartDateString": implementationStartDate,
      "ImplementationStartDateStringFormat": "d/M/yy",
      "ImplementationEndDateString": implementationEndDate,
      "ImplementationEndDateStringFormat": "d/M/yy"
    };

    const completePositionResponse = await completePositionRequest(positionData);
    if (!completePositionResponse?.result?.Success) {
      return response.status(500).json({ "message": "error completing position" });
    }
    return response.status(200).json(completePositionResponse.result);
  } catch (error) {
    return response.status(400).json({ "message": "error completing position" });
  }
};

module.exports = {
  getRegisteredStudents,
  getAvailablePositionGroupsUI,
  getAvailablePositionGroups,
  getAtlasFilteredPositions,
  getInstitutions,
  getAEIInstitutions,
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
  getAssignedPositionById,
  registerNewStudent,
  assignStudent,
  insertTablesFromAtlas,
  insertPositionGroup,
  insertOrUpdateAtlasTables,
  insertOrUpdateWholeAtlasTables,
  insertOrUpdateImmutableAtlasTables,
  syncAtlasPositionGroup,
  findAcademicIdNumber,
  testDeletePosition,
  getStudentPositionMatchesAcademic,
  getPositionGroupDetails,
  atlasLogin,
  changeImplementationDatesAtlas,
  getAssignedPositionByIdHandler,
  completeAtlasPosition
};
