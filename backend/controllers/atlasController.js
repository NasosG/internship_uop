const axios = require("axios");

// test pilot atlas login
const atlasLogin = async (request, response) => {
  const myData = JSON.stringify(request.body);
  console.log(myData);
  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/Login',
      method: 'POST',
      data: myData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.status(200).json({
      message: atlasResponse.data,
      status: atlasResponse.status
    });
  } catch (error) {
    if (error.response.status !== 200) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);

      return response.status(400).json({
        type: error.response.data,
        status: error.response.status
      });

    } else if (error.request.status !== 200) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  }
};


const getDepartmentIds = async (request, response) => {
  const UOPInstitutionID = 25;
  let departments = new Map();

  try {
    const atlasResponse = await axios({
      url: 'http://atlas.pilotiko.gr/Api/Offices/v1/GetAcademics',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ''
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


module.exports = {
  atlasLogin,
  getDepartmentIds
};
