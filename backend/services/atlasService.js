// database connection configuration
const pool = require("../db_config.js");

const getCredentials = async () => {
  try {
    const results = await pool.query("SELECT * FROM atlas_access LIMIT 1");
    return results.rows[0];
  } catch (error) {
    throw Error('Error while fetching credentials');
  }
};

const getAvailablePositionsUI = async (offset, limit) => {
  try {
    const results = await pool.query("SELECT * FROM atlas_position_group g "
      + " INNER JOIN atlas_provider p "
      + " ON g.provider_id = p.atlas_provider_id "
      + " OFFSET $1 LIMIT $2", [offset, limit]);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching positions/providers from postgres');
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
    throw Error("Error while fetching atlas_prefectures from postgres");
  }
};

const getAtlasFilteredPositions = async (offset, limit, filters) => {
  console.log("array is : " + JSON.stringify(filters));
  let moreThanOneFilters = false;
  try {
    let queryStr = "SELECT * FROM atlas_position_group g "
      + " INNER JOIN atlas_provider p "
      + " ON g.provider_id = p.atlas_provider_id ";

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
      queryStr += filters.monthsOfInternship == "months6" ? " 6"
        : filters.monthsOfInternship == "months12" ? " 12" : " 24";
    }
    if (filters.workingHours) {
      queryStr += (moreThanOneFilters ? " AND" : " WHERE") + " g.position_type = ";
      queryStr += filters.workingHours == "fulltime" ? "'Πλήρες ωράριο'" : "'Μερικό ωράριο'";
    }
    if (filters.publicationDate) {
      queryStr += " ORDER BY last_update_string ";
      queryStr += filters.publicationDate == "newest" ? " DESC" : " ASC";
    }
    // TODO NEXT FILTERS...

    queryStr += " OFFSET " + offset + " LIMIT " + limit;

    // console.log("\n" + queryStr + "  " + "\n");

    const results = await pool.query(queryStr);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching filtered positions from postgres');
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

const insertPositionGroup = async (data) => {
  try {
    for (const item of data) {
      await pool.query("INSERT INTO atlas_position_group" +
        '(description, city, title, position_type, available_positions, duration, physical_objects, provider_id, last_update_string, atlas_position_id, city_id, country_id, prefecture_id)' +
        " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
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
        item.atlasPrefectureId
        ]);

      // Insert academics into academics table
      for (let academic of item.academics) {
        await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
          " VALUES ($1, $2)", [item.atlasPositionId, academic.academicsId]);
      }

    }
    // return insertResults;
  } catch (error) {
    console.log('Error while inserting position group[s]' + error.message);
    throw Error('Error while inserting position group[s]');
  }
};

const insertProvider = async (data) => {
  try {
    // console.log(data[0].name + " | " + data[1].name + " | " + data[2].name);
    for (const item of data) {
      // if (getProviders(item.atlasProviderId) > 0) { }
      // else
      await pool.query("INSERT INTO atlas_provider" +
        '(name, contact_email, contact_name, contact_phone, atlas_provider_id)' +
        " VALUES " + "($1, $2, $3, $4, $5)",
        [item.name,
        item.providerContactEmail,
        item.providerContactName,
        item.providerContactPhone,
        item.atlasProviderId
        ]);
    }
  } catch (error) {
    console.log('Error while inserting provider group[s] ' + error.message);
    throw Error('Error while inserting provider group[s]');
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
  getAtlasOldestPositionGroups,
  getAtlasFilteredPositions,
  getInstitutions,
  getCities,
  insertPositionGroup,
  insertCities,
  insertPrefectures,
  insertCountries,
  insertPhysicalObjects,
  insertProvider,
  insertDepartmentIds
};
