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

const getAtlasFilteredPositions = async (offset, limit, filters) => {
  console.log("array is : " + JSON.stringify(filters));
  let moreThanOneFilters = false;
  try {
    let queryStr = "SELECT * FROM atlas_position_group g "
      + " INNER JOIN atlas_provider p "
      + " ON g.provider_id = p.atlas_provider_id ";

    if (filters.location != null) {
      queryStr += ` WHERE g.city = '${filters.location}'`;
      moreThanOneFilters = true;
    }
    if (filters.monthsOfInternship != null) {
      queryStr += (moreThanOneFilters ? " AND" : " WHERE") + " g.duration <= ";
      queryStr += filters.monthsOfInternship == "months6" ? " 6"
        : filters.monthsOfInternship == "months12" ? " 12" : " 24";
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
      console.log(item.physicalObjects);
      await pool.query("INSERT INTO atlas_position_group" +
        '(description, city, title, position_type, available_positions, duration, physical_objects, provider_id, last_update_string, atlas_position_id)' +
        " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [item.description,
        item.city,
        item.title,
        item.positionType,
        item.availablePositions,
        item.duration,
        item.physicalObjects,
        item.providerId,
        item.lastUpdateString,
        item.atlasPositionId
        ]);
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

// const getProviders = (id) => {
//   try {
//     return pool.query("SELECT COUNT(*) FROM atlas_provider " +
//       "WHERE atlas_provider_id = $1", [id]);
//   } catch (error) {
//     console.log('Error inserting io group[s]' + error.message);
//     throw Error('Error inserting io group[s]');
//   }
// };


module.exports = {
  getCredentials,
  getAvailablePositionsUI,
  getAtlasOldestPositionGroups,
  getAtlasFilteredPositions,
  insertPositionGroup,
  insertProvider
};
