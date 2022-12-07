const axios = require("axios");
const adminService = require("../services/adminService.js");

const insertRoles = async (request, response) => {
  try {
    const username = request.body.username;
    const role = request.body.role;
    const isAdmin = request.body.isAdmin;
    const academics = request.body.academics;

    const userRole = await adminService.insertRoles(username, role, isAdmin, academics);

    response.status(201).json(userRole);
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};
