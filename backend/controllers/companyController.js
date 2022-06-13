const jwt = require("jsonwebtoken");
const companyService = require("../services/companyService");

const insertCompanyUsers = async (request, response, next) => {
  try {
    console.log("!" + request.body);
    const company = request.body;
    const accountCreated = await companyService.insertCompanyUsers(company);
    if (accountCreated) {
      await companyService.insertProviders(company);
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
  login
};
