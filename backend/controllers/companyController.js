const jwt = require("jsonwebtoken");
const companyService = require("../services/companyService");

const insertCompanyUsers = async (request, response, next) => {
  try {
    const company = request.body;
    const accountCreated = await companyService.insertCompanyUsers(company);
    if (accountCreated) {
      if (company.id == null || company.id == "") {
        await companyService.insertProviders(company);

        // TODO: in this situation either
        // 1. remove insert query from above and put in underneath - if id exists insert hat one or else make a new provider and insert that id.
        // 2. update previous inserted provided and insert the right id of the newly created provider.
      }
    } else {
      console.error('not created');
      response.status(409)
        .json({
          message: 'not created'
        });
      return;
    }

    response
      .status(201)
      .json({
        message: 'Company details inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const getProviderByAfm = async (request, response) => {
  try {
    const afm = request.params.afm;
    const providers = await companyService.getProviderByAfm(afm);
    response.status(200).json(providers);

  } catch (error) {
    console.error(error.message);
    response.status(404)
      .json({
        message: error.message
      });
  }
};

const getProviderById = async (request, response) => {
  try {
    const companyId = request.params.id;
    const providers = await companyService.getProviderById(companyId);
    response.status(200).json(providers);

  } catch (error) {
    console.error(error.message);
    response.status(404)
      .json({
        message: error.message
      });
  }
};

const getStudentActiveApplications = async (request, response) => {
  try {
    const companyName = request.query.companyName;
    const companyAFM = request.query.companyAFM;
    //console.log(companyName + " " + companyAFM);
    const users = await companyService.getStudentActiveApplications(companyName, companyAFM);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const login = async (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  const userId = await companyService.loginCompany(username, password);

  if (userId == null)
    response.status(401).json({
      message: 'Unauthorized'
    });
  else {
    const token = jwt.sign({
      userId: userId
    },
      "secret_this_should_be_longer", {
      expiresIn: "1h"
    });

    response.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: userId
    });
  }
};

module.exports = {
  insertCompanyUsers,
  getProviderByAfm,
  getProviderById,
  getStudentActiveApplications,
  login
};
