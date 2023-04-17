const jwt = require("jsonwebtoken");
const companyService = require("../services/companyService");
const atlasController = require("./atlasController");
const mainMailer = require('../mailers/mainMailers.js');
const MiscUtils = require("../MiscUtils.js");

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
      let academicId = item.department_id;
      // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
      if (academicId.toString().length == 6) {
        academicId = MiscUtils.getAEICodeFromDepartmentId(academicId);
      }

      console.log(academicId);
      // TO BE TESTED
      const preassignResult = await companyService.getPreassignModeByDepartmentId(academicId);
      console.log(preassignResult.preassign);
      console.log(item.position_id);

      // Get preassigned position or make a new preassignment
      let positionPreassignment;
      try {
        positionPreassignment = await atlasController.getPositionPreassignment(item.position_id, academicId);

        // If preassignment fails, throw an error displaying the message
        if (positionPreassignment.status == "Error occurred") {
          throw new Error(positionPreassignment.message);
        }

        console.log(positionPreassignment);
      } catch (error) {
        console.log(error);
        response.status(500)
          .json({
            message: error.message
          });
        return;
      }

      // insert assignment details to the local db
      await companyService.insertAssignment(companyData);
    }

    response.status(201)
      .json({
        message: "company pre-assignment was inserted successfully"
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

    // console.log(companyName + " " + companyAFM);
    const activeApps = await companyService.getStudentActiveApplications(companyName, companyAFM);

    response.status(200).json(activeApps);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getProviderByAfmAndName = async (request, response) => {
  try {
    const companyName = request.query.companyName;
    const companyAFM = request.query.companyAFM;

    const providers = await companyService.getProviderByAfmAndName(companyAFM, companyName);

    response.status(200).json(providers);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const login = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(400).json({
      message: "Something went wrong logging in: " + error.message
    });
  }
};

const resetPassword = async (request, response) => {
  try {
    const passwordLength = 12;
    const userMail = request.body.providerMail;
    let emailExists = await companyService.checkIfEmailExists(userMail);

    if (!emailExists) {
      response.status(400).json({
        message: "Email not found"
      });
      return;
    }

    let newPassword = companyService.generatePassword(passwordLength);
    await companyService.updateUserPassword(newPassword, userMail);

    mainMailer.sendPasswordResetEmail(newPassword, userMail).catch(console.error);

    response.status(200).json({
      message: "Your password has been reset successfully"
    });
  } catch (error) {
    response.status(400).json({
      message: "Your password has not been reset successfully: " + error.message
    });
  }

};

const getProviderByPositionId = async (request, response) => {
  try {
    const positionId = request.params.id;
    const providers = await companyService.getProviderByPositionId(positionId);
    response.status(200).json(providers);

  } catch (error) {
    console.error(error.message);
    response.status(404)
      .json({
        message: error.message
      });
  }
};

const insertOrUpdateEvaluationSheet = async (request, response) => {
  try {
    const { providerId, studentId, positionId } = request.query;
    const { evaluationFormData } = request.body;
    console.log(request.body);

    const evaluationExists = await companyService.checkIfEvaluationExists(studentId, positionId);

    if (evaluationExists) {
      await companyService.updateStudentEvaluationSheet(studentId, positionId, evaluationFormData);
      response.status(200).json({
        message: 'Company Evaluation successfully updated'
      });
    } else {
      await companyService.insertStudentEvaluationSheet(studentId, positionId, evaluationFormData);
      response.status(201).json({
        message: 'Company Evaluation successfully created'
      });
    }
  } catch (error) {
    response.status(400).json({
      message: error.message
    });
  }
};

const getCompanysEvaluationForm = async (request, response) => {
  try {
    const { studentId, positionId } = request.query;

    const evaluationFormRow = await companyService.getCompanysEvaluationForm(studentId, positionId);

    if (evaluationFormRow) {
      console.log(evaluationFormRow);
      return response.status(200).json(evaluationFormRow);
    }

    return response.status(204).json({
      message: 'Company Evaluation does not exist'
    });
  } catch (error) {
    response.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  insertCompanyUsers,
  getProviderByAfm,
  getProviderByAfmAndName,
  getProviderById,
  getInternalPositionsByProviderId,
  getStudentAssignedApplications,
  getProviderByPositionId,
  getCompanysEvaluationForm,
  insertInternalPositionGroup,
  insertAssignment,
  insertOrUpdateEvaluationSheet,
  getStudentActiveApplications,
  login,
  resetPassword
};
