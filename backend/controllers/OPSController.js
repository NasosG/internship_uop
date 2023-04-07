const express = require('express');
const soap = require('soap');
const depManagerService = require("../services/depManagerService.js");
const jwt = require("jsonwebtoken");
const atlasController = require("./atlasController");
const companyService = require("../services/companyService.js");
const studentService = require("../services/studentService.js");
const mainMailer = require('../mailers/mainMailers.js');
const MiscUtils = require("../MiscUtils.js");
require('dotenv').config();

const createMicrodata = (id, answer) => {
  const apantshValue = answer === 1 ? 5321 : answer === 0 ? 5322 : 5323;

  return {
    ID_MICRODATA: id,
    APANTHSH_VALUE: apantshValue,
    ST_FLAG: 1
  };
};


const sendDeltioEisodouWS = async (req, res) => {
  const studentId = 8;
  const results = studentService.getStudentEntrySheets(studentId);

  const kps5OfeloumenoiArray = results.map(node => {
    const kps5Ofeloumenoi = new builder.Element("KPS5_OFELOYMENOI");

    const answers = [
      { id: 3, value: node.A1 },
      { id: 4, value: node.A1_1 },
      { id: 5, value: node.A1_2 },
      { id: 99, value: node.field_oaed_karta },
      { id: 6, value: node.A2 },
      { id: 7, value: node.A2_1 },
      { id: 8, value: node.A2_1_1 },
      { id: 9, value: node.A2_1_2 },
      { id: 10, value: node.A2_1_3 },
      { id: 11, value: node.A2_1_4 },
      { id: 12, value: node.A2_1_5 },
      { id: 13, value: node.A2_1_6 },
      { id: 14, value: node.A2_2 },
      { id: 15, value: node.A2_2_1 },
      { id: 16, value: node.A2_2_2 },
      { id: 17, value: node.A2_2_3 },
      { id: 18, value: node.A2_3 },
      { id: 19, value: node.A2_4 },
      { id: 20, value: node.A3 },
      { id: 21, value: node.A3_1 },
      { id: 81, value: node.A3_1_1 },
      { id: 82, value: node.A3_1_2 },
      { id: 65, value: node.A3_2 },
      { id: 57, value: 0 }, // set to OXI!
      { id: 27, value: node.C1 },
      { id: 28, value: node.C2 },
      { id: 29, value: node.C3 },
      { id: -1, value: node.C4 },
      { id: 30, value: node.C5 },
      { id: 31, value: node.C6 },
      { id: 32, value: node.C7 },
      { id: 33, value: node.C8 },
      { id: 38, value: node.C9 },
      { id: 39, value: node.D1 },
      { id: 40, value: node.D2 },
      { id: 41, value: node.D3 },
      { id: 62, value: node.D4 },
      { id: 47, value: node.D5 },
      { id: 48, value: node.D6 },
      { id: 45, value: node.D7 },
      { id: 46, value: node.D8 },
      { id: 49, value: node.D9 },
      { id: 50, value: node.D10 },
      { id: 63, value: node.D11 },
      { id: 64, value: node.D12 }
    ];

    if (node.field_ergasia_idiotikos === 1 ||
      node.field_ergasia_dimosios === 1 ||
      node.field_ergasia_aftoapasxoloumenos === 1) {
      answers.find(answer => answer.id === 6).value = 1;
    }

    $answer_63 = 0;
    $answer_64 = 2;
    if ($answer_6 == 1) {
      $answer_64 = 0;
    }

    answers.forEach(answer => {
      const microdata = createMicrodata(answer.id, answer.value);
      kps5Ofeloumenoi.importDocument(microdata);
    });

    return kps5Ofeloumenoi;
  });

  kps5OfeloumenoiArray.forEach(kps5Ofeloumenoi => {
    xml.importDocument(kps5Ofeloumenoi);
  });

  // Prepare XML
  const xml = new XMLSerializer().serializeToString(microdata45); // You'll need to convert 'microdata45' to an XML object
  const startposition = xml.indexOf("<SYM");
  const finalCode = xml.substring(startposition);

  // SOAP Request
  const soapUrl = "https://logon.ops.gr/soa-infra/services/default/SymWs/symwsbpel_client_ep?WSDL"; // asmx URL of WSDL

  const xmlPostString = `
  <soapenv:Envelope xmlns:det="http://www.ops.gr/docs/ws/ret_ops/symmetex/details" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
          <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
              <wsse:UsernameToken wsu:Id="UsernameToken-1">
                  <wsse:Username>${process.env.OPS_USERNAME}</wsse:Username>
                  <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${process.env.OPS_PASSWORD}</wsse:Password>
              </wsse:UsernameToken>
          </wsse:Security>
      </soapenv:Header>
      <soapenv:Body>
          <det:eisagwghOfelWithDeltiaOfel>
              <det:XmlRequest xmlns="http://www.ops.gr/docs/ws/ret_ops/symmetex/details">
                  <![CDATA[
                      ${finalCode}
                  ]]>
              </det:XmlRequest>
          </det:eisagwghOfelWithDeltiaOfel>
      </soapenv:Body>
  </soapenv:Envelope>`;

  // (async () => {
  //   const client = await soap.createClientAsync(soapUrl);
  //   const args = {
  //     XmlRequest: xmlPostString
  //   };

  //   const result = await client.eisagwghOfelWithDeltiaOfelAsync(args);
  //   console.log(result);
  // })().catch((error) => {
  //   console.error(error);
  // });

  const client = await soap.createClientAsync(soapUrl);
  const args = {
    XmlRequest: xmlPostString
  };

  client.eisagwghOfelWithDeltiaOfel(args, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('SOAP request failed');
      return;
    }
    const response = result.XmlResponse;
    const start = response.indexOf("<env:Body>");
    const response1 = response.substring(start);

    // Do something with the response1
    res.send(response1);
  });
};

const sendDeltioExodouWS = async (request, response) => {
  try {
    response.status(200).send('SOAP request not implemented yet');
  }
  catch (error) {
    console.error(error);
    response.status(500).send('SOAP request failed');
  }
};

module.exports = {
  sendDeltioEisodouWS,
  sendDeltioExodouWS
};
