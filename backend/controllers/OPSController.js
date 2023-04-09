const depManagerService = require("../services/depManagerService.js");
const jwt = require("jsonwebtoken");
const companyService = require("../services/companyService.js");
const studentService = require("../services/studentService.js");
const mainMailer = require('../mailers/mainMailers.js');
const MiscUtils = require("../MiscUtils.js");
const axios = require("axios");
require('dotenv').config();
const xml2js = require('xml2js');

const createMicrodata = (id, answer) => {
  const answerValue = answer === true ? 5321 : answer === false ? 5322 : 5323;

  return `<KPS5_DELTIO_MICRODATA>
               <ID_MICRODATA>${id}</ID_MICRODATA>
               <APANTHSH_VALUE>${answerValue}</APANTHSH_VALUE>
               <ST_FLAG>1</ST_FLAG>
            </KPS5_DELTIO_MICRODATA>\n\t  `;
};

const sendDeltioEisodouWS = async (req, res) => {
  let finalCode;
  try {
    const studentId = req.params.id;
    const results = await studentService.getStudentEntrySheets(studentId);
    const studentInfo = await studentService.getStudentById(studentId);
    console.log(studentInfo[0]);
    const assignmenInfo = await studentService.getApprovedAssignmentInfoByStudentId(studentId);
    // const field_oaed_karta = '';
    // console.log(results.rows);

    let microdata = '';

    const answers = [
      { id: 3, value: results.rows[0]?.A1 ?? null },
      { id: 4, value: results.rows[0]?.A1_1 ?? null },
      { id: 5, value: results.rows[0]?.A1_2 ?? null },
      // { id: 99, value: field_oaed_karta ?? null },
      { id: 6, value: results.rows[0]?.A2 ?? null },
      { id: 7, value: results.rows[0]?.A2_1 ?? null },
      { id: 8, value: results.rows[0]?.A2_1_1 ?? null },
      { id: 9, value: results.rows[0]?.A2_1_2 ?? null },
      { id: 10, value: results.rows[0]?.A2_1_3 ?? null },
      { id: 11, value: results.rows[0]?.A2_1_4 ?? null },
      { id: 12, value: results.rows[0]?.A2_1_5 ?? null },
      { id: 13, value: results.rows[0]?.A2_1_6 ?? null },
      { id: 14, value: results.rows[0]?.A2_2 ?? null },
      { id: 15, value: results.rows[0]?.A2_2_1 ?? null },
      { id: 16, value: results.rows[0]?.A2_2_2 ?? null },
      { id: 17, value: results.rows[0]?.A2_2_3 ?? null },
      { id: 18, value: results.rows[0]?.A2_3 ?? null },
      { id: 63, value: true },
      // { id: 19, value: results.rows[0]?.A2_4 ?? null },
      { id: 20, value: results.rows[0]?.A3 ?? null },
      { id: 21, value: results.rows[0]?.A3_1 ?? null },
      { id: 81, value: results.rows[0]?.A3_1_1 ?? null },
      { id: 82, value: results.rows[0]?.A3_1_2 ?? null },
      { id: 65, value: results.rows[0]?.A3_2 ?? null },
      { id: 57, value: false }, // set to OXI!
      { id: 27, value: results.rows[0]?.C1 ?? null },
      { id: 28, value: results.rows[0]?.C2 ?? null },
      { id: 29, value: results.rows[0]?.C3 ?? null },
      // { id: -1, value: results.rows[0].C4 ?? null },
      { id: 30, value: results.rows[0]?.C5 ?? null },
      { id: 31, value: results.rows[0]?.C6 ?? null },
      { id: 32, value: results.rows[0]?.C7 ?? null },
      { id: 33, value: results.rows[0]?.C8 ?? null },
      { id: 34, value: results.rows[0]?.C9 ?? null },
      { id: 46, value: results.rows[0]?.D12 ?? null },
      { id: 47, value: results.rows[0]?.D9 ?? null },
      { id: 48, value: results.rows[0]?.D10 ?? null },
      { id: 49, value: results.rows[0]?.D13 ?? null },
      { id: 50, value: results.rows[0]?.D14 ?? null },
      { id: 38, value: results.rows[0]?.D4 ?? null },
      { id: 39, value: results.rows[0]?.D5 ?? null },
      { id: 40, value: results.rows[0]?.D6 ?? null },
      { id: 41, value: results.rows[0]?.D7 ?? null },
      { id: 62, value: results.rows[0]?.D8 ?? null },
      { id: 45, value: results.rows[0]?.D11 ?? null }
      // { id: 64, value: node.D12 }
    ];

    if (results.rows[0]) {
      if (results.rows[0]?.C9 == true) {
        results.rows[0].C8 = false;
        results.rows[0].C7 = false;
        results.rows[0].C6 = false;
        results.rows[0].C5 = false;
      } else if (results.rows[0]?.C8 == true) {
        results.rows[0].C7 = false;
        results.rows[0].C6 = false;
        results.rows[0].C5 = false;
      } else if (results.rows[0]?.C7 == true) {
        results.rows[0].C6 = false;
        results.rows[0].C5 = false;
      } else if (results.rows[0]?.C6 == true) {
        results.rows[0].C5 = false;
      } else {
        results.rows[0].C5 = true;
      }

      if (results.rows[0]?.A2_1 === true ||
        results.rows[0].A2_2 === true ||
        results.rows[0].A2_3 === true) {
        answers.find(answer => answer.id === 6).value = true;
      }
    }

    answers.find(answer => answer.id == 63).value = false;

    answers.forEach(answer => {
      microdata += createMicrodata(answer.id, answer.value);
    });

    // console.log(microdata);
    let deltioCandidateInfo = await getDataOfeloumenou(studentInfo[0], assignmenInfo);
    console.log(deltioCandidateInfo);
    // Prepare XML
    finalCode = `
    <SYM xmlns="http://www.ops.gr/docs/ws/ret_ops/symmetex/details">
    <KPS5_OFELOYMENOI>
    <AFM>${deltioCandidateInfo.afm}</AFM>
    <AMKA>${deltioCandidateInfo.amka}</AMKA>
    <DATE_GENNHSHS>${deltioCandidateInfo.dobFormatted}</DATE_GENNHSHS>
    <FYLLO_VALUE>${deltioCandidateInfo.genderProcessed}</FYLLO_VALUE>
    <ID_ALLO>${deltioCandidateInfo.adt}</ID_ALLO>
    <OFEL_DIEYTHYNSH>${deltioCandidateInfo.street + deltioCandidateInfo.city}</OFEL_DIEYTHYNSH>
    <OFEL_TK>${deltioCandidateInfo.postal}</OFEL_TK>
    <OFEL_ONOMATEPONYMO>${deltioCandidateInfo.studentName}</OFEL_ONOMATEPONYMO>
    <OFEL_TEL>${deltioCandidateInfo.phone}</OFEL_TEL>
    <ST_FLAG>1</ST_FLAG>
    <KPS5_DELTIO_OFELOYMENOI>
    <EISODOS_FLAG>1</EISODOS_FLAG>
    <KODIKOS_MIS>${deltioCandidateInfo.kodikosMIS}</KODIKOS_MIS>
    <KODIKOS_YPOERGOY>5035</KODIKOS_YPOERGOY>
    <ID_GEO_DHMOS>48</ID_GEO_DHMOS>
    <DATE_DELTIOY>${deltioCandidateInfo.startTimeFormatted}</DATE_DELTIOY>
    <OLOKLHROSH_FLAG>1</OLOKLHROSH_FLAG>
    <OFEL_TK>${deltioCandidateInfo.postal}</OFEL_TK>
    <ST_FLAG>1</ST_FLAG>
    </KPS5_DELTIO_OFELOYMENOI>
    ${microdata}
    </KPS5_OFELOYMENOI>
    </SYM>`;

    // asmx URL of WSDL
    const soapUrl = "https://logon.ops.gr/soa-infra/services/default/SymWs/symwsbpel_client_ep?WSDL";

    // Whole XML string used for post
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

    console.log(xmlPostString);
    return res.status(200).send(xmlPostString);

    // SOAP Request
    const response = await axios.post(soapUrl, xmlPostString, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        // 'SOAPAction': 'http://your-web-service-namespace/eisagwghOfelWithDeltiaOfel',
      },
    });
    console.log(response.data);

    const parsedResponse = await parseXmlResponse(response.data);

    console.log('idOfel:', parsedResponse.idOfel);
    console.log('kodikosMis:', parsedResponse.kodikosMis);
    console.log('idDeltiou:', parsedResponse.idDeltiou);
    console.log('eidosDeltiou:', parsedResponse.eidosDeltiou);
    console.log('errorDescr:', parsedResponse.errorDescr);

    res.send(response.data);
  } catch (exc) {
    console.error(exc);
  }
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

// Parse the response data (XML) and extract the information needed
const parseXmlResponse = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  const parsedXml = await parser.parseStringPromise(xml);

  const response = parsedXml['env:Envelope']['env:Body']['eisagwghOfelWithDeltiaOfelResponse'];

  return {
    idOfel: response.idOfel,
    kodikosMis: response.kodikosMis,
    idDeltiou: response.idDeltiou,
    eidosDeltiou: response.eidosDeltiou,
    errorDescr: response.errorDescr
  };
};

const getDataOfeloumenou = async (studentInfo, position) => {
  const afm = studentInfo.ssn;
  const amka = studentInfo.user_ssn;
  const adt = studentInfo.id_card;
  const gender = studentInfo.schacgender;
  const street = studentInfo.address;
  const city = studentInfo.city;
  // const additional = studentInfo.additional;
  const postal = studentInfo.post_address;
  const phone = studentInfo.phone;
  const studentName = studentInfo.displayname;
  const genderProcessed = gender == 2 ? 5302 : 5301;
  const dob = studentInfo.schacdateofbirth;
  const dobFormatted = MiscUtils.formatDateToISO(dob);
  const stFlag = 1;
  const eisodosFlag = 1;
  const kodikosMIS = 5033384;
  const kodikosYpoergou = 5035;
  const idGeoDimos = 48;
  const startTime = position.pa_start_date;
  const endTime = position.pa_end_date;
  const startTimeFormatted = MiscUtils.formatDateString(startTime);
  const endTimeFormatted = MiscUtils.formatDateString(endTime);
  const oloklirosi = 1;

  return {
    afm,
    amka,
    adt,
    gender,
    street,
    city,
    // additional,
    postal,
    phone,
    studentName,
    genderProcessed,
    dob,
    dobFormatted,
    stFlag,
    eisodosFlag,
    kodikosMIS,
    kodikosYpoergou,
    idGeoDimos,
    startTime,
    endTime,
    startTimeFormatted,
    endTimeFormatted,
    oloklirosi
  };
};

module.exports = {
  sendDeltioEisodouWS,
  sendDeltioExodouWS
};
