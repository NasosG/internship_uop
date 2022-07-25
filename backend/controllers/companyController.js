const jwt = require("jsonwebtoken");
const companyService = require("../services/companyService");
const atlasController = require("./atlasController");

const insertCompanyUsers = async (request, response, next) => {
  try {
    const company = request.body;
    let newlyCreatedProviderId = null;
    // If id doesn't exist first make a new provider and then make an account
    if (company.id == null || company.id == "") {
      console.error('not created');
      response.status(409)
        .json({
          message: 'not created. Company does not exist in Atlas.'
        });
      return;
      //newlyCreatedProviderId = await companyService.insertProviders(company);
    }
    const accountCreated = await companyService.insertCompanyUsers(company, newlyCreatedProviderId);

    if (accountCreated) {
      if (company.id == null || company.id == "") {
        console.log('company id is still null ERROR');
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

const insertInternalPositionGroup = async (request, response, next) => {
  try {
    const companyData = request.body;
    const userId = request.params.id;

    const provider = await companyService.getProviderIdByUserId(userId);
    const internalPosition = await companyService.insertInternalPositionGroup(companyData, provider.company_id);

    response.status(201).json(internalPosition);
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const insertAssignment = async (request, response, next) => {
  try {
    const companyData = request.body;
    // const userId = request.params.id;

    const potentialAssignments = Object.assign(companyData);

    for (let item of potentialAssignments) {
      // Get student's AM by id
      // let academicIDNumber = await companyService.getStudentAMById(item.student_id);

      let academicIDNumber = 243761386827;
      let registeredStudent = await atlasController.getRegisteredStudent(academicIDNumber);

      if (registeredStudent.message != null) {
        console.log('user is registered');
      } else {
        console.log('not a registered user');
        // Student SHOULD sign up on this occassion
        let registerResult = await atlasController.registerNewStudent(academicIDNumber);
        console.log(registerResult);
      }
      // console.log(registeredStudent);

      // TO BE TESTED
      // const preassignResult = await companyService.getPreassignModeByDepartmentId(98);
      // console.log(preassignResult.preassign);
      console.log(item.position_id);
      let positionPreassignment = await atlasController.getPositionPreassignment(item.position_id, 98);
      console.log(positionPreassignment);


      //const fundingType = await getFundingType(item.position_id);

      // assign student to Atlas position
      let assignResults = await atlasController.assignStudent(positionPreassignment, academicIDNumber);
      console.log(assignResults);
      // insert assignment details to the local db
      await companyService.insertAssignment(companyData);
    }

    response.status(201)
      .json({
        message: "assignment was inserted successfully"
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

const getInternalPositionsByProviderId = async (request, response) => {
  try {
    const companyId = request.params.id;
    const providers = await companyService.getInternalPositionsByProviderId(companyId);

    response.status(200).json(providers);

  } catch (error) {
    console.error(error.message);
    response.status(404)
      .json({
        message: error.message
      });
  }
};

const getStudentAssignedApplications = async (request, response) => {
  try {
    const companyName = request.query.companyName;
    const companyAFM = request.query.companyAFM;

    const users = await companyService.getStudentAssignedApplications(companyName, companyAFM);

    let positionsArray = [];
    let i = 0;
    for (const user of users) {
      let found = false;

      for (const position of user.positions) {
        if (position.afm == companyAFM && position.company == companyName) {
          found = true;
          positionsArray.push(position);
        }
      }

      if (!found)
        users.splice(i, 1);
      else
        user.positions = positionsArray;

      i++;
    }
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
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

    let positionsArray = [];
    let i = 0;
    for (const user of users) {
      let found = false;

      for (const position of user.positions) {
        if (position.afm == companyAFM && position.company == companyName) {
          found = true;
          positionsArray.push(position);
        }
      }

      if (!found)
        users.splice(i, 1);
      else
        user.positions = positionsArray;

      i++;
    }
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
  getInternalPositionsByProviderId,
  getStudentAssignedApplications,
  insertInternalPositionGroup,
  insertAssignment,
  getStudentActiveApplications,
  login
};
