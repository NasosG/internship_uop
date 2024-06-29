/**
 * This module handles the XML parsing and service call logic for the MIS system.
 *
 * Note: Old MIS code was in the repository until commit dca1015a697ff3d16a967466931183645b71bbe7.
 * This commit reference is provided for historical context and for developers needing to
 * reference or restore previous implementations.
 */
const jwt = require("jsonwebtoken");
const studentService = require("../services/studentService.js");
const MiscUtils = require("../MiscUtils.js");
const axios = require("axios");
require('dotenv').config();
const xml2js = require('xml2js');

const createMicrodata = (id, answer) => {
  const answerValue = answer === true ? 5321 : answer === false ? 5322 : 5323;

  return `
        <urn:DeltioMicrodata>
                <urn:IDMicrodata>${id}</urn:IDMicrodata>
                <urn:Apantisi>${answerValue}</urn:Apantisi>
              </urn:DeltioMicrodata>\n\t `;
};

const sendDeltioEisodouWS = async (req, res) => {
  try {
    const studentId = req.params.id;
    const MODE = 'WS';
    const activeStatus = true;

    if (!activeStatus || process.env.ENV == 'DEV') {
      return res.status(200).json({ 'status': 200, 'message': 'deactivated' });
    }

    const sheetResults = await studentService.getStudentEntrySheets(studentId);

    // Old MIS - used getXmlPostStringEisodou(studentId, MODE, sheetResults);
    // New MIS XML string - New fields
    const xmlPostString = await getXmlPostStringEisodouMIS21_27(studentId, MODE, sheetResults);
    const soapActionCall1 = 'sentParticipants';
    console.log(xmlPostString);

    // asmx URL of WSDL
    //const soapUrl = "https://logon.ops.gr/soa-infra/services/default/SymWs/symwsbpel_client_ep?WSDL";
    const soapUrl = "https://logon.ops.gr/services/v6/participants?wsdl";

    // SOAP Request
    const responseCall1 = await axios.post(soapUrl, xmlPostString, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': soapActionCall1
      },
    });
    console.log(responseCall1.data);

    const parsedResponseCall1 = await parseXmlResponseCall1(responseCall1.data);

    if (parsedResponseCall1.status === 'failure' || !parsedResponseCall1?.RequestProgressMessage) {
      return res.status(400).json({ message: 'Something went wrong - Call 1 - Sheet was not added' });
    }

    const { RequestProgressMessage, RequestProgressMessageCode } = parsedResponseCall1;
    console.log('RequestProgressMessage: ', RequestProgressMessage);
    console.log('Extracted Code: ', RequestProgressMessageCode);

    const xmlPostStringCall2 = await getXmlPostStringMIS21_27_Call2Res(RequestProgressMessageCode);
    const soapActionCall2 = 'getResponse';
    // const responseCall2 = await axios.post(soapUrl, xmlPostStringCall2, {
    //   headers: {
    //     'Content-Type': 'text/xml;charset=UTF-8'
    //   },
    // });
    let responseCall2;
    try {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 4000; // 4 seconds

      responseCall2 = await callServiceWithRetry(soapUrl, xmlPostStringCall2, MAX_RETRIES, RETRY_DELAY, soapActionCall2);
      console.log('Response from Call 2:', responseCall2);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: 'Entry sheet - SOAP request Call 2 failed after retries' });
    }

    const parsedResponse = await parseXmlResponseCall2(responseCall2.data);
    console.log(parsedResponse);
    const errorCode = parsedResponse.errorCode;
    let idDeltiou;

    if (Number(errorCode) == 0) {
      console.log('idOfel:', parsedResponse.idOfel);
      console.log('kodikosMis:', parsedResponse.kodikosMis);
      console.log('idDeltiou:', parsedResponse.idDeltiou);
      console.log('eidosDeltiou:', parsedResponse.eidosDeltiou);
      console.log('errorDescr:', parsedResponse.errorDescr);

      idDeltiou = parsedResponse.idDeltiou;

      // Could also keep the idOfel in the database, but it's not necessary.
      if (parsedResponse.idOfel && !sheetResults.rows[0].ops_number_eisodou) {
        await studentService.updateSheetOpsNumberById(idDeltiou, sheetResults.rows[0].id, 'entry');
      }
      console.log(`all OK for sheet with OPS number: ${idDeltiou}`);
    } else if (Number(errorCode) == -11) {
      console.log('idOfel:', parsedResponse.idOfel);
      console.log('kodikosMis:', parsedResponse.kodikosMis);
      console.log('idDeltiou:', parsedResponse.idDeltiou);
      console.log('eidosDeltiou:', parsedResponse.eidosDeltiou);
      console.log('errorDescr:', parsedResponse.errorDescr);

      console.warn(`Sheet already exists for: ${parsedResponse.idOfel}`);
      return res.status(400).json({ message: 'Sheet already exists' });
    } else {
      console.warn('OPS entry sheet WS response: ', parsedResponse);
      return res.status(400).json({ message: 'Entry sheet - SOAP request failed' });
    }

    return res.status(200).json({ status: "DONE", opsNumber: idDeltiou });
  } catch (exc) {
    console.error(exc);
    return res.status(500).send({ message: 'Entry sheet - SOAP request failed' });
  }
};

const callServiceWithRetry = async (soapUrl, xmlPostString, maxRetries, retryDelay, soapAction) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(soapUrl, xmlPostString, {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': soapAction
        },
      });

      console.log(`Call attempt ${attempt}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

const sendDeltioExodouWS = async (req, res) => {
  try {
    const studentId = req.params.id;
    const MODE = 'WS';
    const activeStatus = true;

    if (!activeStatus || process.env.ENV == 'DEV') {
      return res.status(200).json({ 'status': 200, 'message': 'deactivated' });
    }

    const sheetResults = await studentService.getStudentExitSheets(studentId);

    // Old MIS - used getXmlPostStringExodou(studentId, MODE, sheetResults);
    // New MIS 2021 2027 - New Fields
    const xmlPostString = await getXmlPostStringExodouMIS21_27(studentId, MODE, sheetResults);

    console.log(xmlPostString);

    // asmx URL of WSDL
    //const soapUrl = "https://logon.ops.gr/soa-infra/services/default/SymWs/symwsbpel_client_ep?WSDL";
    const soapUrl = "https://logon.ops.gr/services/v6/participants?wsdl";

    const responseCall1 = await axios.post(soapUrl, xmlPostString, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8'
      },
    });
    console.log(responseCall1.data);

    const parsedResponseCall1 = await parseXmlResponseCall1(responseCall1.data);

    if (parsedResponseCall1.status === 'failure' || !parsedResponseCall1?.RequestProgressMessage) {
      return res.status(400).json({ message: 'Something went wrong - Call 1 - Sheet was not added' });
    }

    const { RequestProgressMessage, RequestProgressMessageCode } = parsedResponseCall1;
    console.log('RequestProgressMessage: ', RequestProgressMessage);
    console.log('Extracted Code: ', RequestProgressMessageCode);

    const xmlPostStringCall2 = await getXmlPostStringMIS21_27_Call2Res(RequestProgressMessageCode);

    let responseCall2;
    try {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 4000; // 4 seconds

      responseCall2 = await callServiceWithRetry(soapUrl, xmlPostStringCall2, MAX_RETRIES, RETRY_DELAY);
      console.log('Response from Call 2:', responseCall2);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: 'Entry sheet - SOAP request Call 2 failed after retries' });
    }

    const parsedResponse = await parseXmlResponseCall2(responseCall2.data);
    const errorCode = parsedResponse.errorCode;
    let idDeltiou;

    if (Number(errorCode) == 0) {
      console.log('idOfel:', parsedResponse.idOfel);
      console.log('kodikosMis:', parsedResponse.kodikosMis);
      console.log('idDeltiou:', parsedResponse.idDeltiou);
      console.log('eidosDeltiou:', parsedResponse.eidosDeltiou);
      console.log('errorDescr:', parsedResponse.errorDescr);

      idDeltiou = parsedResponse.idDeltiou;

      // Could also keep the idOfel in the database, but it's not necessary.
      if (parsedResponse.idOfel && !sheetResults[0].ops_number_exodou) {
        await studentService.updateSheetOpsNumberById(idDeltiou, sheetResults[0].exit_id, 'exit');
      }
      console.log(`all OK for sheet with OPS number: ${idDeltiou}`);
    } else if (Number(errorCode) == -11) {
      console.log('idOfel:', parsedResponse.idOfel);
      console.log('kodikosMis:', parsedResponse.kodikosMis);
      console.log('idDeltiou:', parsedResponse.idDeltiou);
      console.log('eidosDeltiou:', parsedResponse.eidosDeltiou);
      console.log('errorDescr:', parsedResponse.errorDescr);

      console.warn(`Sheet already exists for: ${parsedResponse.idOfel}`);
      return res.status(400).json({ message: 'Sheet already exists' });
    } else {
      console.warn('OPS exit sheet WS response: ', parsedResponse);
      return res.status(400).json({ message: 'Exit sheet - SOAP request failed' });
    }

    return res.status(200).json({ status: "DONE", opsNumber: idDeltiou });
  } catch (error) {
    console.error(error);
    res.status(500).send('SOAP request failed');
  }
};

const sendDeltioEisodouXML = async (req, res) => {
  try {
    const studentId = req.params.id;
    const MODE = 'XML';
    const sheetResults = await studentService.getStudentEntrySheets(studentId);
    // Old MIS
    // const xmlPostString = await getXmlPostStringEisodou(studentId, MODE, sheetResults);

    // New MIS XML string - New fields
    const xmlPostString = await getXmlPostStringEisodouMIS21_27(studentId, MODE, sheetResults);
    console.log(xmlPostString);

    const filename = `deltioEisodou${studentId}.xml`;
    res.set('Content-Type', 'text/xml; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    // res.write("\xEF\xBB\xBF"); // UTF-8 BOM
    // return res.end(xmlPostString);
    return res.send(xmlPostString);

  } catch (exc) {
    console.error(exc);
    return res.status(500).send({ message: 'Entry sheet - XML generation failed' });
  }
};

const sendDeltioExodouXML = async (req, res) => {
  try {
    const studentId = req.params.id;
    const MODE = 'XML';
    const sheetResults = await studentService.getStudentExitSheets(studentId);
    // Old MIS
    // const xmlPostString = await getXmlPostStringExodou(studentId, MODE, sheetResults);

    // New MIS 2021 2027 - New Fields
    const xmlPostString = await getXmlPostStringExodouMIS21_27(studentId, MODE, sheetResults);
    console.log(xmlPostString);

    const filename = `deltioExodou${studentId}.xml`;
    res.set('Content-Type', 'text/xml; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(xmlPostString);

  } catch (exc) {
    console.error(exc);
    return res.status(500).send({ message: 'Exit sheet - XML generation failed' });
  }
};

// Parse the response data (XML) and extract the information needed
// Old MIS  2014-2020
const parseXmlResponse = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  const parsedXml = await parser.parseStringPromise(xml);

  const response = parsedXml['env:Envelope']['env:Body']['eisagwghOfelWithDeltiaOfelResponse'];

  return {
    idOfel: response.idOfel,
    kodikosMis: response.kodikosMis,
    idDeltiou: response.idDeltiou,
    eidosDeltiou: response.eidosDeltiou,
    errorDescr: response.errorDescr,
    errorCode: response.errorCode
  };
};

const parseXmlResponseCall1 = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  try {
    const parsedXml = await parser.parseStringPromise(xml);

    // Access the RequestProgressMessage element in the XML structure
    const response = parsedXml['soapenv:Envelope']['env:Body']['urn:SymetexontesResponse']['urn:RequestProgressMessage'];

    if (!response?.RequestProgressMessage) {
      return {
        status: 'failure',
        errorMessage: 'RequestProgressMessage not found in the response.',
      };
    }

    const messageParts = response.RequestProgressMessage.split(" ");
    const RequestProgressMessageCode = messageParts[messageParts.length - 1];

    return {
      status: 'success',
      RequestProgressMessage: response,
      RequestProgressMessageCode: RequestProgressMessageCode
    };
  } catch (error) {
    console.error('Error parsing XML Call 1: ', error);
    return {
      status: 'failure',
      errorMessage: error.message,
    };
  }
};

const parseXmlResponseCall2 = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  const parsedXml = await parser.parseStringPromise(xml);

  const response = parsedXml['soapenv:Envelope']['env:Body']['ofel:SymetexontesResponse']['ofel:OfeloumenosOutput']['ofel:DeltioOfeloumenou'];
  const idOfel = parsedXml['soapenv:Envelope']['env:Body']['ofel:SymetexontesResponse']['ofel:OfeloumenosOutput']['urn:IDTaytopoihsis'];

  console.log(response);

  // Extract the error message
  const errorMessage = response['ofel:ErrorMessage'];

  return {
    idOfel: idOfel,
    kodikosMis: response['ofel:KodikosMis'],
    eidosDeltiou: response['ofel:EidosDeltiou'],
    errorCode: response['ofel:ErrorCode'],
    errorDescr: errorMessage,
    idDeltiou: getIdDeltiouFromErrorMessage(errorMessage)
  };
};

// Function to extract ID from error message
const getIdDeltiouFromErrorMessage = (errorMessage) => {
  const startIndex = errorMessage.indexOf('Α/Α: ') + 4; // Start after 'Α/Α: '
  const endIndex = errorMessage.indexOf(' ('); // End before ' ('
  // Get the ID from the error message, removing the spaces
  const extractedNumber = errorMessage.substring(startIndex, endIndex).replace(/\s/g, '');
  return extractedNumber;
};

const getDataOfeloumenou = async (studentInfo, position, sheetType) => {
  const afm = studentInfo.ssn;
  const amka = studentInfo.user_ssn;
  const adt = studentInfo.id_card.replace(/\s/g, "");
  const gender = studentInfo.schacgender;
  const street = studentInfo.address.replace(/&/g, '&amp;');
  const city = studentInfo.city;
  const location = studentInfo.location;
  const postal = studentInfo.post_address;
  const phone = studentInfo.phone;
  const studentName = studentInfo.displayname;
  const genderProcessed = gender == 2 ? 5302 : 5301;
  const dob = studentInfo.schacdateofbirth;
  const dobFormatted = MiscUtils.formatDateToISO(dob);
  const stFlag = 1;
  // 0: for exit sheets - 1: for entry sheets
  const eisodosFlag = sheetType == 'entry' ? 1 : 0;
  // const kodikosMIS = 5184863; // Old MIS till 2021 ESPA
  const kodikosMIS = 6004529;
  const kodikosYpoergou = MiscUtils.getTypeOfDepartmentOPS(studentInfo.department_id.toString());
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
    location,
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

/**
 * Get Post string to be used for XML download or API call for entry sheets
*/
const getXmlPostStringEisodou = async (studentId, mode, sheets) => {
  let finalCode;
  try {
    const studentInfo = await studentService.getStudentById(studentId);
    const assignmenInfo = await studentService.getApprovedAssignmentInfoByStudentId(studentId);

    let microdata = '';

    const answers = [
      { id: 3, value: sheets.rows[0]?.A1 ?? null },
      // { id: 4, value: sheets.rows[0]?.A1_1 ?? null },
      { id: 5, value: sheets.rows[0]?.A1_2 ?? null },
      // { id: 99, value: field_oaed_karta ?? null },
      { id: 6, value: sheets.rows[0]?.A2 ?? null },
      { id: 7, value: sheets.rows[0]?.A2_1 ?? null },
      { id: 8, value: sheets.rows[0]?.A2_1_1 ?? null },
      { id: 9, value: sheets.rows[0]?.A2_1_2 ?? null },
      { id: 10, value: sheets.rows[0]?.A2_1_3 ?? null },
      { id: 11, value: sheets.rows[0]?.A2_1_4 ?? null },
      { id: 12, value: sheets.rows[0]?.A2_1_5 ?? null },
      { id: 13, value: sheets.rows[0]?.A2_1_6 ?? null },
      { id: 14, value: sheets.rows[0]?.A2_2 ?? null },
      { id: 15, value: sheets.rows[0]?.A2_2_1 ?? null },
      { id: 16, value: sheets.rows[0]?.A2_2_2 ?? null },
      { id: 17, value: sheets.rows[0]?.A2_2_3 ?? null },
      { id: 18, value: sheets.rows[0]?.A2_3 ?? null },
      { id: 63, value: false },
      { id: 20, value: sheets.rows[0]?.A3 ?? null },
      { id: 21, value: sheets.rows[0]?.A3_1 ?? null },
      // { id: 81, value: sheets.rows[0]?.A3_1_1 ?? null },
      { id: 82, value: sheets.rows[0]?.A3_1_2 ?? null },
      { id: 65, value: sheets.rows[0]?.A3_2 ?? null },
      // { id: 57, value: false }, // set to OXI!
      { id: 27, value: sheets.rows[0]?.C1 ?? null },
      { id: 28, value: sheets.rows[0]?.C2 ?? null },
      { id: 29, value: sheets.rows[0]?.C3 ?? null },
      { id: 99, value: sheets.rows[0].C4 ?? null },
      { id: 100, value: sheets.rows[0]?.C5 ?? null },
      { id: 101, value: sheets.rows[0]?.C6 ?? null },
      { id: 32, value: sheets.rows[0]?.C7 ?? null },
      { id: 33, value: sheets.rows[0]?.C8 ?? null },
      { id: 34, value: sheets.rows[0]?.C9 ?? null },
      { id: 46, value: sheets.rows[0]?.D10 ?? null },
      { id: 47, value: sheets.rows[0]?.D11 ?? null },
      { id: 48, value: sheets.rows[0]?.D12 ?? null },
      { id: 49, value: sheets.rows[0]?.D13 ?? null },
      { id: 50, value: sheets.rows[0]?.D14 ?? null },
      { id: 38, value: sheets.rows[0]?.D4 ?? null },
      { id: 39, value: sheets.rows[0]?.D5 ?? null },
      { id: 40, value: sheets.rows[0]?.D6 ?? null },
      { id: 41, value: sheets.rows[0]?.D7 ?? null },
      { id: 62, value: sheets.rows[0]?.D8 ?? null },
      { id: 45, value: sheets.rows[0]?.D9 ?? null }
      // { id: 64, value: node.D12 }
    ];

    if (sheets.rows[0]) {
      if (sheets.rows[0]?.C9 == true) {
        sheets.rows[0].C8 = false;
        sheets.rows[0].C7 = false;
        sheets.rows[0].C6 = false;
        sheets.rows[0].C5 = false;
      } else if (sheets.rows[0]?.C8 == true) {
        sheets.rows[0].C7 = false;
        sheets.rows[0].C6 = false;
        sheets.rows[0].C5 = false;
      } else if (sheets.rows[0]?.C7 == true) {
        sheets.rows[0].C6 = false;
        sheets.rows[0].C5 = false;
      } else if (sheets.rows[0]?.C6 == true) {
        sheets.rows[0].C5 = false;
      } else {
        sheets.rows[0].C5 = true;
      }

      if (sheets.rows[0]?.A2_1 === true ||
        sheets.rows[0].A2_2 === true ||
        sheets.rows[0].A2_3 === true) {
        answers.find(answer => answer.id === 6).value = true;
      }

      if (sheets.rows[0]?.B4 === true) {
        answers.push({ id: 25, value: true });
        answers.push({ id: 57, value: true });
      } else {
        answers.push({ id: 57, value: false });
      }
    }

    answers.find(answer => answer.id == 63).value = false;

    answers.forEach(answer => {
      microdata += createMicrodata(answer.id, answer.value);
    });

    // console.log(microdata);
    let deltioCandidateInfo = await getDataOfeloumenou(studentInfo[0], assignmenInfo, 'entry');
    console.log(deltioCandidateInfo);

    // Prepare XML string
    if (mode == 'XML') {
      finalCode = `<?xml version="1.0" encoding="utf-8"?>`;
      return finalCode + returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 1, 'entry');
    }

    finalCode = returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 1, 'entry');

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

    return xmlPostString;
  } catch (error) {
    console.error(error.message);
    throw Error('Error producing xml post string');
  }
};

const getXmlPostStringEisodouMIS21_27 = async (studentId, mode, sheets) => {
  let finalCode;
  try {
    const studentInfo = await studentService.getStudentById(studentId);
    const assignmenInfo = await studentService.getApprovedAssignmentInfoByStudentId(studentId);

    let microdata = '';

    const answers = [
      // New fields for 2021-2027 ESPA

      // A Answers
      // MICRO_1_19 Εφοσον  ο  υπολογισμός της εργασιακής κατάστασης να γίνεται από τις διοικητικές Πηγές
      // ΔΙΠΑ , ΕΡΓΑΝΗ, ΓΓΠΣ , Μητρώο Δημοσίων υπαλλήλων τα ερωτηματα Α1, Α3, Α1.1, Α2.Π1, Α2.Π2, Α2.Π3, Α2.Π1.6Μ, Α2.Π2.6Μ, Α2.Π3.6Μ, Α1.6M
      // δεν απαντωνται από τον συμμετέχοντα

      // { id: 3, value: sheets.rows[0]?.A1 ?? null },
      // { id: 96, value: sheets.rows[0]?.A1_1 ?? null },
      // { id: 104, value: sheets.rows[0]?.A2P1 ?? null },
      // { id: 105, value: sheets.rows[0]?.A2P2 ?? null },
      // { id: 106, value: sheets.rows[0]?.A2P3 ?? null },
      // { id: 20, value: sheets.rows[0]?.A3 ?? null },

      // C Answers
      { id: 27, value: sheets.rows[0]?.C1 ?? null },
      { id: 28, value: sheets.rows[0]?.C2 ?? null },
      { id: 29, value: sheets.rows[0]?.C3 ?? null },
      { id: 99, value: sheets.rows[0].C4 ?? null },
      { id: 100, value: sheets.rows[0]?.C5 ?? null },
      { id: 101, value: sheets.rows[0]?.C6 ?? null },
      { id: 32, value: sheets.rows[0]?.C7 ?? null },
      { id: 33, value: sheets.rows[0]?.C8 ?? null },
      { id: 34, value: sheets.rows[0]?.C9 ?? null },
      // D Answers
      { id: 102, value: sheets.rows[0]?.D1P ?? null },
      { id: 117, value: sheets.rows[0]?.D1 ?? null },
      { id: 112, value: sheets.rows[0]?.D2 ?? null },
      { id: 113, value: sheets.rows[0]?.D2A ?? null },
      { id: 114, value: sheets.rows[0]?.D2B ?? null },
      { id: 115, value: sheets.rows[0]?.D2C ?? null },
      { id: 38, value: sheets.rows[0]?.D3 ?? null },
      { id: 39, value: sheets.rows[0]?.D4 ?? null },
      { id: 40, value: sheets.rows[0]?.D5 ?? null },
      { id: 49, value: sheets.rows[0]?.D6 ?? null }
    ];

    if (sheets.rows[0]) {
      if (sheets.rows[0]?.C9 == true) {
        sheets.rows[0].C8 = false;
        sheets.rows[0].C7 = false;
        sheets.rows[0].C6 = false;
        sheets.rows[0].C5 = false;
      } else if (sheets.rows[0]?.C8 == true) {
        sheets.rows[0].C7 = false;
        sheets.rows[0].C6 = false;
        sheets.rows[0].C5 = false;
      } else if (sheets.rows[0]?.C7 == true) {
        sheets.rows[0].C6 = false;
        sheets.rows[0].C5 = false;
      } else if (sheets.rows[0]?.C6 == true) {
        sheets.rows[0].C5 = false;
      } else {
        sheets.rows[0].C5 = true;
      }

      // if (sheets.rows[0]?.A2_1 === true ||
      //   sheets.rows[0].A2_2 === true ||
      //   sheets.rows[0].A2_3 === true) {
      //   answers.find(answer => answer.id === 6).value = true;
      // }

      // Manually set B, depending on B and B3 values
      if (sheets.rows[0]?.B3 === true) {
        answers.push({ id: 25, value: true });
        answers.push({ id: 57, value: true });
      } else {
        answers.push({ id: 57, value: false });
      }
    }

    // answers.find(answer => answer.id == 63).value = false;

    answers.forEach(answer => {
      microdata += createMicrodata(answer.id, answer.value);
    });

    // console.log(microdata);
    let deltioCandidateInfo = await getDataOfeloumenou(studentInfo[0], assignmenInfo, 'entry');
    console.log(deltioCandidateInfo);

    // Prepare XML string
    if (mode == 'XML') {
      finalCode = `<?xml version="1.0" encoding="utf-8"?>`;
      return finalCode + returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 1, 'entry');
    }

    finalCode = returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 1, 'entry');

    // Whole XML string used for post
    const xmlPostString = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:espa:v6:services:participants">
      <soapenv:Header>
        <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
          <wsse:UsernameToken wsu:Id="UsernameToken-21A5D01AD68A43292616831141895866">
            <wsse:Username>${process.env.OPS_USERNAME}</wsse:Username>
            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${process.env.OPS_PASSWORD}</wsse:Password>
            <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">wZzUvqTKk2M8LzR8LzatmA==</wsse:Nonce>
            <wsu:Created>2023-05-03T11:43:09.586Z</wsu:Created>
          </wsse:UsernameToken>
        </wsse:Security>
      </soapenv:Header>
      <soapenv:Body>
          ${finalCode}
      </soapenv:Body>
    </soapenv:Envelope>`;

    return xmlPostString;
  } catch (error) {
    console.error(error.message);
    throw Error('Error producing xml post string');
  }
};

const getXmlPostStringMIS21_27_Call2Res = async (codeOfReq1) => {
  try {
    // Whole XML string used for post
    const xmlPostString = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:espa:v6:services:participants">
      <soapenv:Header>
          <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <wsse:UsernameToken wsu:Id="UsernameToken-BBB4A981CA41D9C18F17182210228332">
                <wsse:Username>${process.env.OPS_USERNAME}</wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${process.env.OPS_PASSWORD}</wsse:Password>
                <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">Mk+KP4zkYPIGBEHaji6uTw==</wsse:Nonce>
                <wsu:Created>2024-06-12T19:37:02.830Z</wsu:Created>
            </wsse:UsernameToken>
          </wsse:Security>
      </soapenv:Header>
      <soapenv:Body>
          <urn:SymmetexontesRequest>
            <urn:RequestProgressID>${codeOfReq1}</urn:RequestProgressID>
          </urn:SymmetexontesRequest>
      </soapenv:Body>
    </soapenv:Envelope>`;

    return xmlPostString;
  } catch (error) {
    console.error(error.message);
    throw Error('Error producing xml post string - Req2 result: ' + error.message);
  }
};

/**
 * Get Post string to be used for XML download or API call for exit sheets
*/
const getXmlPostStringExodou = async (studentId, mode, sheets) => {
  let finalCode;

  try {
    const studentInfo = await studentService.getStudentById(studentId);
    const assignmenInfo = await studentService.getApprovedAssignmentInfoByStudentId(studentId);

    let microdata = '';

    const answers = [
      { id: 3, value: sheets[0]?.A1 ?? null },
      { id: 6, value: sheets[0]?.A2 ?? null },
      // { id: 64, value: sheets[0]?.A2_0 ?? null },
      { id: 7, value: sheets[0]?.A2_1 ?? null },
      { id: 8, value: sheets[0]?.A2_1_1 ?? null },
      { id: 9, value: sheets[0]?.A2_1_2 ?? null },
      { id: 10, value: sheets[0]?.A2_1_3 ?? null },
      { id: 11, value: sheets[0]?.A2_1_4 ?? null },
      { id: 12, value: sheets[0]?.A2_1_5 ?? null },
      { id: 13, value: sheets[0]?.A2_1_6 ?? null },
      { id: 14, value: sheets[0]?.A2_2 ?? null },
      { id: 15, value: sheets[0]?.A2_2_1 ?? null },
      { id: 16, value: sheets[0]?.A2_2_2 ?? null },
      { id: 17, value: sheets[0]?.A2_2_3 ?? null },
      { id: 18, value: sheets[0]?.A2_3 ?? null },
      { id: 63, value: sheets[0]?.A2_4 ?? null },
      { id: 20, value: sheets[0]?.A3 ?? null },
      { id: 21, value: sheets[0]?.A3_1 ?? null },
      { id: 65, value: sheets[0]?.A3_2 ?? null },
      { id: 51, value: sheets[0]?.E1 ?? null },
      // { id: 58, value: sheets[0]?.E2 ?? null },
      // { id: 67, value: sheets[0]?.E2_1 ?? null },
      // { id: 68, value: sheets[0]?.E2_2 ?? null },
      // { id: 69, value: sheets[0]?.E2_3 ?? null },
      // { id: 59, value: sheets[0]?.E3 ?? null },
      // { id: 70, value: sheets[0]?.E3_1 ?? null },
      // { id: 71, value: sheets[0]?.E3_2 ?? null },
      // { id: 72, value: sheets[0]?.E3_3 ?? null },
      // { id: 61, value: sheets[0]?.E4 ?? null },
      // { id: 73, value: sheets[0]?.E4_1 ?? null },
      // { id: 74, value: sheets[0]?.E4_2 ?? null },
      // { id: 75, value: sheets[0]?.E4_3 ?? null },
      // { id: 60, value: sheets[0]?.E5 ?? null },
      // { id: 76, value: sheets[0]?.E5_1 ?? null },
      // { id: 77, value: sheets[0]?.E5_2 ?? null },
      // { id: 78, value: sheets[0]?.E5_3 ?? null }
    ];

    if (sheets[0]) {
      if (sheets[0]?.A2_1 === true ||
        sheets[0].A2_2 === true ||
        sheets[0].A2_3 === true) {
        answers.find(answer => answer.id === 6).value = true;
      }

      if (sheets[0]?.B4 === true) {
        answers.push({ id: 25, value: true });
        answers.push({ id: 57, value: true });
      } else {
        // Set to OXI
        answers.push({ id: 57, value: false });
      }
    }

    // answers.find(answer => answer.id == 63).value = false;

    answers.forEach(answer => {
      microdata += createMicrodata(answer.id, answer.value);
    });

    let deltioCandidateInfo = await getDataOfeloumenou(studentInfo[0], assignmenInfo, 'exit');
    console.log(deltioCandidateInfo);

    if (mode == 'XML') {
      finalCode = `<?xml version="1.0" encoding="utf-8"?>`;
      return finalCode + returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 0, 'exit');
    }

    finalCode = returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 0, 'exit');

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

    return xmlPostString;
  } catch (error) {
    console.error(error.message);
    throw Error('Error producing xml post string');
  }
};

/**
 * Get Post string to be used for XML download or API call for exit sheets
*/
const getXmlPostStringExodouMIS21_27 = async (studentId, mode, sheets) => {
  let finalCode;

  try {
    const studentInfo = await studentService.getStudentById(studentId);
    const assignmenInfo = await studentService.getApprovedAssignmentInfoByStudentId(studentId);

    let microdata = '';

    const answers = [
      // A Answers
      { id: 3, value: sheets[0]?.A1 ?? null },
      { id: 110, value: sheets[0]?.A16M ?? null },
      { id: 104, value: sheets[0]?.A2P1 ?? null },
      { id: 105, value: sheets[0]?.A2P2 ?? null },
      { id: 106, value: sheets[0]?.A2P3 ?? null },
      { id: 107, value: sheets[0]?.A2P16M ?? null },
      { id: 108, value: sheets[0]?.A2P26M ?? null },
      { id: 109, value: sheets[0]?.A2P36M ?? null },
      { id: 20, value: sheets[0]?.A3 ?? null },
      { id: 21, value: sheets[0]?.A3_1 ?? null },
      { id: 65, value: sheets[0]?.A3_2 ?? null },
      // E Answers
      { id: 51, value: sheets[0]?.E1 ?? null }
    ];

    if (sheets[0]) {
      if (sheets[0]?.B3 === true) {
        answers.push({ id: 25, value: true });
        answers.push({ id: 111, value: true });
      } else {
        // Set to OXI
        answers.push({ id: 111, value: false });
      }
    }

    answers.forEach(answer => {
      microdata += createMicrodata(answer.id, answer.value);
    });

    let deltioCandidateInfo = await getDataOfeloumenou(studentInfo[0], assignmenInfo, 'exit');
    console.log(deltioCandidateInfo);

    if (mode == 'XML') {
      finalCode = `<?xml version="1.0" encoding="utf-8"?>`;
      return finalCode + returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 0, 'exit');
    }

    finalCode = returnSYMValuesForDeltio(deltioCandidateInfo, microdata, 0, 'exit');

    // Whole XML string used for post
    const xmlPostString = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:espa:v6:services:participants">
      <soapenv:Header>
        <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
          <wsse:UsernameToken wsu:Id="UsernameToken-21A5D01AD68A43292616831141895866">
            <wsse:Username>${process.env.OPS_USERNAME}</wsse:Username>
            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${process.env.OPS_PASSWORD}</wsse:Password>
            <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">wZzUvqTKk2M8LzR8LzatmA==</wsse:Nonce>
            <wsu:Created>2023-05-03T11:43:09.586Z</wsu:Created>
          </wsse:UsernameToken>
        </wsse:Security>
      </soapenv:Header>
      <soapenv:Body>
          ${finalCode}
      </soapenv:Body>
    </soapenv:Envelope>`;

    return xmlPostString;
  } catch (error) {
    console.error(error.message);
    throw Error('Error producing xml post string');
  }
};

const returnSYMValuesForDeltio = (deltioCandidateInfo, microdata, deltioType, sheetType) => {
  let sheetDate;

  if (sheetType === 'entry') {
    sheetDate = deltioCandidateInfo.startTimeFormatted;
  } else {
    sheetDate = deltioCandidateInfo.endTimeFormatted;
  }

  // Prepare XML

  return `
  <urn:SymmetexontesRequest>
    <urn:OfeloumenosInput>
      <urn:KatigTaytopoihsis>1</urn:KatigTaytopoihsis>
      <urn:IDTaytopoihsis>${deltioCandidateInfo.afm}</urn:IDTaytopoihsis>
      <urn:DeltioOfeloumenou>
          <urn:EidosDeltiou>${deltioType}</urn:EidosDeltiou>
          <urn:HmniaDeltiou>${sheetDate}</urn:HmniaDeltiou>
          <urn:KodikosMis>${deltioCandidateInfo.kodikosMIS}</urn:KodikosMis>
          <urn:IDOfelDikaiouxou>${deltioCandidateInfo.adt}</urn:IDOfelDikaiouxou>
          <urn:IDPeriferias>48</urn:IDPeriferias>
          <urn:PliresFlag>1</urn:PliresFlag>
          <urn:DioikitikesPigesFlag>1</urn:DioikitikesPigesFlag>
          <urn:FlagOloklirosis>1</urn:FlagOloklirosis>
          <!-- <urn:Onomateponimo>${deltioCandidateInfo.studentName}</urn:Onomateponimo> -->
          <!-- <urn:HmniaGenesis>${deltioCandidateInfo.dobFormatted}</urn:HmniaGenesis> -->
          <!-- <urn:Gender>${deltioCandidateInfo.genderProcessed}</urn:Gender> -->
      ${microdata}
      </urn:DeltioOfeloumenou>
    </urn:OfeloumenosInput>
  </urn:SymmetexontesRequest>`;
  //   <SYM xmlns="http://www.ops.gr/docs/ws/ret_ops/symmetex/details">
  //     <KPS5_OFELOYMENOI>
  //         <AFM>${deltioCandidateInfo.afm}</AFM>
  //         <AMKA>${deltioCandidateInfo.amka}</AMKA>
  //         <DATE_GENNHSHS>${deltioCandidateInfo.dobFormatted}</DATE_GENNHSHS>
  //         <FYLLO_VALUE>${deltioCandidateInfo.genderProcessed}</FYLLO_VALUE>
  //         <ID_ALLO>${deltioCandidateInfo.adt}</ID_ALLO>
  //         <OFEL_DIEYTHYNSH>${deltioCandidateInfo.street + ' ' + deltioCandidateInfo.location + ' ' + deltioCandidateInfo.city}</OFEL_DIEYTHYNSH>
  //         <OFEL_TK>${deltioCandidateInfo.postal}</OFEL_TK>
  //         <OFEL_ONOMATEPONYMO>${deltioCandidateInfo.studentName}</OFEL_ONOMATEPONYMO>
  //         <OFEL_TEL>${deltioCandidateInfo.phone}</OFEL_TEL>
  //         <ST_FLAG>1</ST_FLAG>
  //         <KPS5_DELTIO_OFELOYMENOI>
  //             <EISODOS_FLAG>${deltioType}</EISODOS_FLAG>
  //             <KODIKOS_MIS>${deltioCandidateInfo.kodikosMIS}</KODIKOS_MIS>
  //             <KODIKOS_YPOERGOY>${deltioCandidateInfo.kodikosYpoergou}</KODIKOS_YPOERGOY>
  //             <ID_GEO_DHMOS>48</ID_GEO_DHMOS>
  //             <DATE_DELTIOY>${sheetDate}</DATE_DELTIOY>
  //             <OLOKLHROSH_FLAG>1</OLOKLHROSH_FLAG>
  //             <OFEL_TK>${deltioCandidateInfo.postal}</OFEL_TK>
  //             <ST_FLAG>1</ST_FLAG>
  //         </KPS5_DELTIO_OFELOYMENOI>
  //         ${microdata}
  //     </KPS5_OFELOYMENOI>
  // </SYM>`;
};

const testParsersWS = async () => {
  try {
    // Simulated response from the first SOAP call
    const simulatedResponseData1 = `
      <soapenv:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><env:Header xmlns:urn="urn:espa:v6:services:participants" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"/><env:Body xmlns:urn="urn:espa:v6:services:participants" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"><urn:SymetexontesResponse xmlns:urn="urn:espa:v6;services:participants"><urn:RequestProgressMessage>Το δελτίο σας υποβλήθηκε για επεξεργασία.
  Για την ανάκτηση των αποτελεσμάτων χρησιμοποιείστε το aaaaaaaa-9999-1234-1234-abcdef123456</urn:RequestProgressMessage></urn:SymetexontesResponse></env:Body></soapenv:Envelope> `;
    const errorResponseCall1 = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><soapenv:Fault><faultcode>soapenv:Server</faultcode><faultstring>OSB-382000: unexpected XML tag. expected: {http://schemas.xmlsoap.org/soap/envelope/}Body but found: {urn:espa:v6:services:participants}SymmetexontesRequvest</faultstring><detail><con:stack-trace xmlns:con="http://www.bea.com/wli/sb/context">com.bea.wli.sb.service.handlerchain.HandlerException: unexpected XML tag. expected: {http://schemas.xmlsoap.org/soap/envelope/}Body but found: {urn:espa:v6:services:participants}SymmetexontesRequvest
	    at com.bea.wli.sb.service.disi.handlerchain.handlers.InboundDISIHandler.dispatch(InboundDISIHandler.java:142)
	    at com.bea.wli.sb.service.handlerchain.handlers.AbstractHandler.dispatch(AbstractHandler.java:129)
	    ... 53 more
      </con:stack-trace></detail></soapenv:Fault></soapenv:Body></soapenv:Envelope>`;

    // Simulated response from the second SOAP call
    const simulatedResponseData2 = `
      <soapenv:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><env:Header xmlns:urn="urn:espa:v6:services:participants" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"/><env:Body xmlns:urn="urn:espa:v6:services:participants" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"><ofel:SymetexontesResponse xmlns:ofel="urn:espa:v6:services:participants"><ofel:OfeloumenosOutput><urn:IDTaytopoihsis>123456789</urn:IDTaytopoihsis><ofel:DeltioOfeloumenou><ofel:KodikosMis>6004529</ofel:KodikosMis><ofel:EidosDeltiou>1</ofel:EidosDeltiou><ofel:ErrorCode>0</ofel:ErrorCode><ofel:ErrorMessage>Δημιουργήθηκε νέο Δελτίο με Α/Α: 12345 (6004529)</ofel:ErrorMessage></ofel:DeltioOfeloumenou></ofel:OfeloumenosOutput></ofel:SymetexontesResponse></env:Body></soapenv:Envelope>
    `;

    const parsedResponseCall1 = await parseXmlResponseCall1(simulatedResponseData1);

    let codeOfReq1;

    console.log('parsedResponseCall1: ', parsedResponseCall1.status);
    if (parsedResponseCall1.status === 'failure' || !parsedResponseCall1?.RequestProgressMessage) {
      return 0;
    }
    console.log('ReqsProgressMessage: ', parsedResponseCall1.RequestProgressMessage);

    const message = parsedResponseCall1.RequestProgressMessage;
    const parts = message.split(" ");
    codeOfReq1 = parts[parts.length - 1];

    console.log('Extracted Code: ', codeOfReq1);

    const parsedResponseCall2 = await parseXmlResponseCall2(simulatedResponseData2);
    console.log(parsedResponseCall2);
    return;
  } catch (error) {
    console.error('Error: ', error);
  }
};

module.exports = {
  sendDeltioEisodouWS,
  sendDeltioExodouWS,
  sendDeltioEisodouXML,
  sendDeltioExodouXML,
  testParsersWS
};
