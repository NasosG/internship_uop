const companyService = require("../services/companyService");

const insertCompanyUsers = async (request, response, next) => {
  try {
    const company = request.body;
    await companyService.insertCompanyUsers(company);
    await companyService.insertProviders(company);

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
    const providerAfm = await companyService.getProviderByAfm(afm);
    response
      .status(201)
      .json({
        message: providerAfm.rows
      });
  } catch (error) {
    console.error(error.message);
    response.status(404)
      .json({
        message: error.message
      });
  }
}

module.exports = {
  insertCompanyUsers,
  getProviderByAfm
};
