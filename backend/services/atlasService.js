// database connection configuration
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");

const getCredentials = async () => {
  try {
    const results = await pool.query("SELECT * FROM atlas_access LIMIT 1");
    return results.rows[0];
  } catch (error) {
    throw Error('Error while fetching credentials' + error.message);
  }
};

const updateToken = async (accessToken) => {
  try {
    await pool.query("UPDATE atlas_access SET access_token = $1", [accessToken]);
  } catch (error) {
    throw Error('Error while updating token in postgres' + error.message);
  }
};

const getAvailablePositionsUI = async (offset, limit) => {
  try {
    const results = await pool.query("SELECT *, g.id as g_position_id FROM atlas_position_group g "
      + " INNER JOIN atlas_provider p "
      + " ON g.provider_id = p.atlas_provider_id ORDER BY last_update_string DESC"
      + " OFFSET $1 LIMIT $2", [offset, limit]);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching positions/providers from postgres');
  }
};

const getAvailablePositionsUIUnion = async (offset, limit) => {
  try {
    const results = await pool.query("SELECT *, g.id as g_position_id FROM (SELECT * FROM atlas_position_group UNION SELECT * FROM internal_position_group) g"
      + " INNER JOIN atlas_provider p "
      + " ON g.provider_id = p.atlas_provider_id OR (g.atlas_position_id IS NULL AND g.provider_id = p.id) "
      + " OFFSET $1 LIMIT $2", [offset, limit]);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching positions/providers from postgres');
  }
};

const getPositionGroupFromDBById = async (atlasPositionId) => {
  try {

    const internalPositionGroups = await pool.query("SELECT *, to_char(\"last_update_string\", 'DD/MM/YYYY') as publication_date "
      + " FROM atlas_position_group g"
      + " WHERE g.atlas_position_id = $1", [atlasPositionId]);
    return internalPositionGroups.rows[0];
  } catch (error) {
    throw Error('Error while fetching atlas position groups for position ' + atlasPositionId);
  }
};

const getCountOfPositionPairs = async () => {
  try {
    const positionPairs = await pool.query("SELECT COUNT(position_group_id) as count_pairs "
      + " FROM atlas_position_group_relations");
    return positionPairs.rows[0].count_pairs;
  } catch (error) {
    throw Error('Error while fetching count for position pairs');
  }
};

const getInstitutions = async () => {
  try {
    const results = await pool.query("SELECT * FROM atlas_academics");
    return results.rows;
  } catch (error) {
    throw Error("Error while fetching atlas_academics from postgres");
  }
};

const getCities = async () => {
  try {
    const results = await pool.query("SELECT atlas_id, name FROM atlas_cities order by name");
    return results.rows;
  } catch (error) {
    throw Error("Error while fetching atlas_cities from postgres");
  }
};

const getPrefectures = async () => {
  try {
    const results = await pool.query("SELECT atlas_id, name FROM atlas_prefectures order by name");
    return results.rows;
  } catch (error) {
    throw Error("Error while fetching atlas_prefectures from postgres");
  }
};

const getCountries = async () => {
  try {
    const results = await pool.query("SELECT atlas_id, name FROM atlas_countries order by name");
    return results.rows;
  } catch (error) {
    throw Error("Error while fetching atlas_countries from postgres");
  }
};

const getPhysicalObjects = async () => {
  try {
    const results = await pool.query("SELECT atlas_id, name FROM atlas_physical_objects");
    return results.rows;
  } catch (error) {
    throw Error("Error while fetching atlas_countries from postgres");
  }
};

const checkAtlasPositionAcademicsMatchStudents = (positionId, academicId) => {
  try {
    const isPosition4AllAcademics = checkPositionHasAcademics(positionId);
    if (isPosition4AllAcademics) {
      return true;
    }
    const isPosition4StudentAcademic = checkAcademicPosition(positionId, academicId);
    if (isPosition4StudentAcademic) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error.message);
  }
};

const checkPositionHasAcademics = async (positionId) => {
  const result = await pool.query('SELECT EXISTS (SELECT 1 FROM position_has_academics WHERE position_id = $1)', [positionId]);
  return result.rows[0].exists;
};

const checkAcademicPosition = async (positionId, academicId) => {
  const result = await pool.query(`SELECT pa.* FROM atlas_position_group g
                                  INNER JOIN position_has_academics pa
                                  ON pa.position_id = g.atlas_position_id
                                  WHERE pa.academic_id = $1 AND pa.position_id = $2`, [academicId, positionId]);
  return result.rows.length > 0;
};

const getAtlasFilteredPositions = async (offset, limit, filters) => {
  console.log("array is : " + JSON.stringify(filters));
  let moreThanOneFilters = false;
  try {
    //let queryStr = "SELECT * FROM atlas_position_group g "
    let queryStr = "SELECT *, g.id as g_position_id FROM"
      + " (SELECT * FROM atlas_position_group UNION SELECT * FROM internal_position_group) g"
      + " INNER JOIN atlas_provider p "
      //old working before union added
      //+ " ON g.provider_id = p.atlas_provider_id ";
      + " ON g.provider_id = p.atlas_provider_id OR (g.atlas_position_id IS NULL AND g.provider_id = p.id)";
    // TODO: make query run faster maybe maybe filter the result more before joining
    if (filters.institution) {
      queryStr += "INNER JOIN position_has_academics pa ON pa.position_id = g.atlas_position_id ";
      queryStr += "INNER JOIN atlas_academics ac ON ac.atlas_id = pa.academic_id ";
      queryStr += ` WHERE pa.academic_id = '${filters.institution}'`;
      // MAYBE USE THIS VERSION
      // queryStr += ` AND pa.academic_id = '${filters.institution}'`;
      moreThanOneFilters = true;
    }

    if (filters.location != null) {
      queryStr += (moreThanOneFilters ? " AND" : " WHERE") + ` g.city = '${filters.location}'`;
      moreThanOneFilters = true;
    }
    // if (filters.location != null) {
    //   queryStr += ` WHERE g.city = '${filters.location}'`;
    //   moreThanOneFilters = true;
    // }
    if (filters.monthsOfInternship != null) {
      queryStr += (moreThanOneFilters ? " AND" : " WHERE") + " g.duration <= ";
      queryStr += MiscUtils.getWeeksFromMonths(filters.monthsOfInternship);
      moreThanOneFilters = true;
    }
    // Working hours removed
    // if (filters.workingHours) {
    //   queryStr += (moreThanOneFilters ? " AND" : " WHERE") + " g.position_type = ";
    //   queryStr += filters.workingHours == "fulltime" ? "'Πλήρες ωράριο'" : "'Μερικό ωράριο'";
    //   moreThanOneFilters = true;
    // }
    if (filters.physicalObject) {
      queryStr += (moreThanOneFilters ? " AND" : " WHERE");
      queryStr += " '" + filters.physicalObject + "'";
      queryStr += " = ANY(physical_objects)";
      moreThanOneFilters = true;
    }
    if (filters.provider) {
      queryStr += (moreThanOneFilters ? " AND" : " WHERE") + " p.name ILIKE '%" + filters.provider + "%'";
    }
    if (filters.publicationDate) {
      queryStr += " ORDER BY last_update_string ";
      queryStr += filters.publicationDate == "newest" ? " DESC" : " ASC";
    }
    // TODO NEXT FILTERS...

    // fetch newest first by default
    //queryStr += (!filters.publicationDate) ? " ORDER BY last_update_string DESC" : " ";
    queryStr += " OFFSET " + offset + " LIMIT " + limit;

    // console.log("\n" + queryStr + "  " + "\n");

    const results = await pool.query(queryStr);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching filtered positions from postgres');
  }
};

const getGenericPositionSearch = async (text, offset, limit) => {
  try {
    let queryText;

    if (text == null || text == '') return [];

    if (Number.isInteger(parseInt(text))) {
      queryText = "SELECT *, g.id as g_position_id FROM atlas_position_group g"
        + " INNER JOIN atlas_provider p "
        + " ON g.provider_id = p.atlas_provider_id"
        + " WHERE g.atlas_position_id = $1"
        + " OFFSET $2 LIMIT $3";
    } else {
      if (text.length < 3) return [];
      queryText = "SELECT *, g.id as g_position_id FROM (SELECT * FROM atlas_position_group UNION SELECT * FROM internal_position_group) g"
        + " INNER JOIN atlas_provider p "
        + " ON g.provider_id = p.atlas_provider_id OR (g.atlas_position_id IS NULL AND g.provider_id = p.id) "
        + " WHERE g.description ILIKE $1 "
        + " OFFSET $2 LIMIT $3";
      text = '%' + text + '%';
    }

    const results = await pool.query(queryText, [text, offset, limit]);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching positions from generic search');
  }
};

const getAtlasOldestPositionGroups = async (offset, limit) => {
  try {
    const results = await pool.query("SELECT * FROM atlas_position_group g "
      + " INNER JOIN atlas_provider p "
      + " ON g.provider_id = p.atlas_provider_id "
      + " ORDER BY last_update_string ASC OFFSET 0 LIMIT 6");
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching positions/providers from postgres');
  }
};

const getPositionGroupRelations = async (relationsArray) => {
  // console.log(relationsArray.PositionGroupID);
  try {
    sql = await pool.query("SELECT * FROM atlas_position_group_relations WHERE position_group_id=$1 AND provider_id=$2",
      [relationsArray.PositionGroupID,
      relationsArray.ProviderID]);
    return sql.rows[0];
  } catch (error) {
    throw Exception('Error while fetching position groups from postgres');
  }
};

const insertPositionGroupRelations = async (relationsArray) => {
  try {
    for (const item of relationsArray) {
      await pool.query("INSERT INTO atlas_position_group_relations" +
        '(position_group_id, position_group_last_update, provider_id, provider_last_update)' +
        " VALUES ($1, $2, $3, $4)",
        [item.PositionGroupID,
        item.PositionGroupLastUpdateString,
        item.ProviderID,
        item.ProviderLastUpdateString
        ]);
    }
  } catch (error) {
    throw Error('Error while inserting position group relations');
  }
};

const insertPositionGroup = async (data) => {
  try {
    for (const item of data) {
      //console.log(item);
      await pool.query("INSERT INTO atlas_position_group" +
        '(description, city, title, position_type, available_positions, duration, physical_objects, provider_id, last_update_string, atlas_position_id, city_id, country_id, prefecture_id, start_date, start_date_string, end_date, end_date_string)' +
        " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
        [item.description,
        item.city,
        item.title,
        item.positionType,
        item.availablePositions,
        item.duration,
        item.physicalObjects,
        item.providerId,
        item.lastUpdateString,
        item.atlasPositionId,
        item.atlasCityId,
        item.atlasCountryId,
        item.atlasPrefectureId,
        item.StartDate,
        item.StartDateString,
        item.EndDate,
        item.EndDateString
        ]);

      // Insert academics into academics table
      for (let academic of item.academics) {
        await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
          " VALUES ($1, $2)", [item.atlasPositionId, academic.academicsId]);
      }

    }
    // return insertResults;
  } catch (error) {
    console.log('Error while inserting position group[s] ' + error.message);
    throw Error('Error while inserting position group[s]');
  }
};

const updatePositionsList = async (data) => {
  try {
    for (const item of data) {
      await pool.query("UPDATE atlas_position_group \
         SET description = $1, city = $2, title = $3, position_type = $4, available_positions = $5, duration = $6, physical_objects = $7, \
         provider_id = $8, last_update_string = $9, city_id = $10, country_id = $11, prefecture_id = $12, start_date = $13, \
         start_date_string = $14, end_date = $15, end_date_string = $16 WHERE atlas_position_id = $17",
        [item.description,
        item.city,
        item.title,
        item.positionType,
        item.availablePositions,
        item.duration,
        item.physicalObjects,
        item.providerId,
        item.lastUpdateString,
        item.atlasCityId,
        item.atlasCountryId,
        item.atlasPrefectureId,
        item.StartDate,
        item.StartDateString,
        item.EndDate,
        item.EndDateString,
        item.atlasPositionId
        ]);

      // // Insert academics into academics table
      // for (let academic of item.academics) {
      //   await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
      //     " VALUES ($1, $2)", [item.atlasPositionId, academic.academicsId]);
      // }

    }
    // return updateResults;
  } catch (error) {
    console.log('Error while updating group[s] ' + error.message);
    throw Error('Error while updating group[s]');
  }
};

const updateProvidersList = async (data) => {
  try {
    for (const item of data) {
      await pool.query("UPDATE atlas_provider \
       SET name = $1, contact_email = $2, contact_name = $3, contact_phone = $4, afm = $5 \
        WHERE atlas_provider_id = $6",
        [item.name,
        item.providerContactEmail,
        item.providerContactName,
        item.providerContactPhone,
        item.afm,
        item.atlasProviderId
        ]);
    }
  } catch (error) {
    console.log('Error while updating provider[s] ' + error.message);
    throw Error('Error while updating provider[s]');
  }
};

const updatePositionGroupRelationsList = async (data) => {
  try {
    for (const item of data) {
      await pool.query("UPDATE atlas_position_group_relations \
       SET position_group_last_update = $1, provider_last_update = $2 \
        WHERE position_group_id = $3",
        [item.PositionGroupLastUpdateString,
        item.ProviderLastUpdateString,
        item.PositionGroupID]);
    }
  } catch (error) {
    console.log('Error while updating position group relation[s] ' + error.message);
    throw Error('Error while updating position group relation[s]');
  }
};

const insertPositionGroupRelation = async (data) => {
  try {
    for (const item of data) {
      await pool.query("INSERT INTO atlas_position_group_relations \
      (position_group_id, position_group_last_update, provider_id, provider_last_update) \
       VALUES ($1, $2, $3, $4)",
        [item.PositionGroupID,
        item.PositionGroupLastUpdateString,
        item.ProviderID,
        item.ProviderLastUpdateString]);
    }
  } catch (error) {
    console.log('Error while inserting position group relation[s] ' + error.message);
    throw Error('Error while inserting position group relation[s]');
  }
};


const insertProvider = async (data) => {
  try {
    // Select all atlas_provider_id's that already exist in the database
    const existingIDs = await pool.query(`SELECT atlas_provider_id FROM atlas_provider`);
    // Create an array of existing atlas_provider_id's
    const existingIDArray = existingIDs.rows;
    // This creates a new array "existingIds" with all the "atlas_provider_id" from the existingIDArray
    const existingIds = existingIDArray.map(item => item.atlas_provider_id);
    // Filter data array to only include items with atlas_provider_id's that do not already exist in the database
    const uniqueData = data.filter(item => !existingIds.includes(item.atlasProviderId.toString()));

    for (const item of uniqueData) {
      await pool.query("INSERT INTO atlas_provider" +
        '(name, contact_email, contact_name, contact_phone, atlas_provider_id, afm)' +
        " VALUES " + "($1, $2, $3, $4, $5, $6)",
        [item.name,
        item.providerContactEmail,
        item.providerContactName,
        item.providerContactPhone,
        item.atlasProviderId,
        item.afm
        ]);
    }
  } catch (error) {
    // console.log('Error while inserting provider group[s] ' + error.message);
    throw Error('Error while inserting provider[s] ' + error.message);
  }
};

const insertCities = async (data) => {
  try {
    for (const item of data) {
      await pool.query("INSERT INTO atlas_cities" +
        '(atlas_id, name, prefecture_id)' +
        " VALUES " + "($1, $2, $3)",
        [item.ID, item.Name, item.PrefectureID]);
    }
  } catch (error) {
    throw Error('Error while inserting cities');
  }
};

const insertPrefectures = async (data) => {
  try {
    for (const item of data) {
      await pool.query("INSERT INTO atlas_prefectures" +
        '(atlas_id, name)' +
        " VALUES " + "($1, $2)",
        [item.ID, item.Name]);
    }
  } catch (error) {
    throw Error('Error while inserting prefectures');
  }
};

const insertCountries = async (data) => {
  try {
    for (const item of data) {
      await pool.query("INSERT INTO atlas_countries" +
        '(atlas_id, name)' +
        " VALUES " + "($1, $2)",
        [item.ID, item.Name]);
    }
  } catch (error) {
    throw Error('Error while inserting countries');
  }
};

const insertPhysicalObjects = async (data) => {
  try {
    for (const item of data) {
      await pool.query("INSERT INTO atlas_physical_objects" +
        '(atlas_id, name)' +
        " VALUES " + "($1, $2)",
        [item.ID, item.Name]);
    }
  } catch (error) {
    throw Error('Error while inserting physical objects');
  }
};

const updateCities = async (data) => {
  try {
    for (const item of data) {
      await pool.query("UPDATE atlas_cities" +
        " SET name = $1, prefecture_id = $2" +
        " WHERE atlas_id = $3",
        [item.Name, item.PrefectureID, item.ID]);
    }
  } catch (error) {
    throw Error('Error while updating cities');
  }
};

const updatePrefectures = async (data) => {
  try {
    for (const item of data) {
      await pool.query("UPDATE atlas_prefectures" +
        " SET name = $1 " +
        " WHERE atlas_id = $2",
        [item.Name, item.ID]);
    }
  } catch (error) {
    throw Error('Error while updating prefectures');
  }
};

const updateCountries = async (data) => {
  try {
    for (const item of data) {
      await pool.query("UPDATE atlas_countries" +
        " SET name = $1" +
        " WHERE atlas_id = $2",
        [item.Name, item.ID]);
    }
  } catch (error) {
    throw Error('Error while updating countries');
  }
};

const updatePhysicalObjects = async (data) => {
  try {
    for (const item of data) {
      await pool.query("UPDATE atlas_physical_objects" +
        " SET name = $1" +
        " WHERE atlas_id = $2",
        [item.Name, item.ID]);
    }
  } catch (error) {
    throw Error('Error while updating physical objects');
  }
};

const insertOrUpdateAtlasTable = async (tableToUpdate, atlasArray) => {
  switch (tableToUpdate) {

    case "cities":
      const atlasCitiesLocalDB = await getCities();
      for (const item of atlasArray) {
        let itemFoundDetails = atlasCitiesLocalDB.find(element => element.atlas_id == item.ID);
        // console.log(itemFoundDetails);
        if (!itemFoundDetails)
          await insertCities([item]);
        else
          await updateCities([item]);
      }
      break;

    case "countries":
      const atlasCountriesLocalDB = await getCountries();
      for (const item of atlasArray) {
        let itemFoundDetails = atlasCountriesLocalDB.find(element => element.atlas_id == item.ID);
        // console.log(itemFoundDetails);
        if (!itemFoundDetails)
          await insertCountries([item]);
        else
          await updateCountries([item]);
      }
      break;

    case "physicalObjects":
      const atlasPhysicalObjectsLocalDB = await getPhysicalObjects();
      for (const item of atlasArray) {
        let itemFoundDetails = atlasPhysicalObjectsLocalDB.find(element => element.atlas_id == item.ID);
        // console.log(itemFoundDetails);
        if (!itemFoundDetails)
          await insertPhysicalObjects([item]);
        else
          await updatePhysicalObjects([item]);
      }
      break;

    case "prefectures":
      const atlasPrefecturesLocalDB = await getPrefectures();
      for (const item of atlasArray) {
        let itemFoundDetails = atlasPrefecturesLocalDB.find(element => element.atlas_id == item.ID);
        // console.log(itemFoundDetails);
        if (!itemFoundDetails)
          await insertPrefectures([item]);
        else
          await updatePrefectures([item]);
      }
      break;

    default:
      break;
  }
};

const insertDepartmentIds = async (departmentArray, uopId) => {
  try {
    for (let item of departmentArray) {
      await pool.query("INSERT INTO atlas_academics" +
        '(atlas_id, institution_id, department)' +
        " VALUES " + "($1, $2, $3)",
        [item.id, uopId, item.department]);
    }
  } catch (error) {
    throw Error('Error while inserting departments');
  }
};



module.exports = {
  getCredentials,
  getAvailablePositionsUI,
  getAvailablePositionsUIUnion,
  getPositionGroupFromDBById,
  getAtlasOldestPositionGroups,
  getAtlasFilteredPositions,
  getInstitutions,
  getCities,
  getPrefectures,
  getCountries,
  getPhysicalObjects,
  getGenericPositionSearch,
  getPositionGroupRelations,
  getCountOfPositionPairs,
  insertPositionGroupRelations,
  insertPositionGroup,
  insertCities,
  insertPrefectures,
  insertCountries,
  insertPhysicalObjects,
  insertProvider,
  insertDepartmentIds,
  insertPositionGroupRelation,
  updatePositionsList,
  updateProvidersList,
  updatePositionGroupRelationsList,
  updateToken,
  insertOrUpdateAtlasTable
};
