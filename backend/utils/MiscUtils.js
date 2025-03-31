const moment = require('moment');

// All the accepted file types
const FILE_TYPES = [
  'png', 'jpg', 'gif', 'jpeg', 'pdf', 'webp', 'doc', 'docx'
];

const FILE_TYPES_WITH_DOT = [
  '.png', '.jpg', '.gif', '.jpeg', '.pdf', '.webp', '.doc', '.docx'
];

const TEN_MINUTES = 600000;
const ONE_HOUR = 3600000;
const ONE_N_HALF_HOUR = 5400000;
const THREE_HOURS = 10800000;
const SIX_HOURS = 21600000;
const SEVEN_HOURS = 25200000;
const EIGHT_HOURS = 28800000;
const THIRTY_HOURS = 108000000;

// salt rounds for bcrypt algorithm
const SALT_ROUNDS = 10;

const departmentsMap = {
  '104': 555,   //ΙΣΤΟΡΙΑΣ, ΑΡΧΑΙΟΛΟΓΙΑΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΠΟΛΙΤΙΣΜΙΚΩΝ ΑΓΑΘΩΝ
  '1511': 1511, //ΓΕΩΠΟΝΙΑΣ
  '1512': 1512, //ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ ΤΡΟΦΙΜΩΝ
  '1513': 465,  //ΛΟΓΙΣΤΙΚΗΣ ΚΑΙ ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΗΣ
  '1514': 1514, //ΔΙΟΙΚΗΣΗΣ ΕΠΙΧΕΙΡΗΣΕΩΝ ΚΑΙ ΟΡΓΑΝΙΣΜΩΝ
  '1515': 466,  //ΛΟΓΟΘΕΡΑΠΕΙΑΣ
  '1516': 1516, //ΕΠΙΣΤΗΜΗΣ ΔΙΑΤΡΟΦΗΣ ΚΑΙ ΔΙΑΙΤΟΛΟΓΙΑΣ
  '1517': 1517, //ΠΑΡΑΣΤΑΤΙΚΩΝ ΚΑΙ ΨΗΦΙΑΚΩΝ ΤΕΧΝΩΝ
  '1518': 1518, //ΔΙΟΙΚΗΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ
  '1519': 1519, //ΨΗΦΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ
  '1520': 1520, //ΦΥΣΙΚΟΘΕΡΑΠΕΙΑΣ
  '1522': 31,   //ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1522': 11,   //ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ   - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1522': 61,   //ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ   - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1523': 32,   //ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1523': 12,   //ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1524': 33,   //ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '1524': 13,   //ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ  - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ
  '187': 556,   //ΚΟΙΝΩΝΙΚΗΣ ΚΑΙ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ
  '189': 551,   //ΦΙΛΟΛΟΓΙΑΣ
  '190': 550,   //ΝΟΣΗΛΕΥΤΙΚΗΣ
  '361': 554,   //ΟΙΚΟΝΟΜΙΚΩΝ ΕΠΙΣΤΗΜΩΝ
  '362': 557,   //ΘΕΑΤΡΙΚΩΝ ΣΠΟΥΔΩΝ
  '400': 558,   //ΟΡΓΑΝΩΣΗΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΑΘΛΗΤΙΣΜΟΥ
  '411': 559,   //ΠΟΛΙΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ
  '98': 560     //ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ
};

/**
 * Format file extensions such as doc and docx, if needed
 *
 * @param {*} ext - The file extension of the uploaded file
 * @returns ext - A string which refers to the extension of the file after formatting.
 * e.g. msword needs to be changed to doc format
 */
function formatDocExtension(ext) {
  if (ext == 'msword') {
    ext = 'doc';
  } else if (ext == 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
    ext = 'docx';
  }
  return ext;
}

/**
 * Extract the student Registry ID after the last colon (:) and after the optional slash (/) in the given string.
 * Mostly for students of technological departments. e.g for AM: 1513/1234567 the function will return 1234567.
 *
 * @param {string} splitString - The input string to be split and processed.
 * @returns {string} The extracted student ID.
 */
const splitStudentsAM = (splitString) => {
  const splitArray = splitString.split(':');
  const lastArrayPart = splitArray[splitArray.length - 1];

  if (lastArrayPart.includes("/")) {
    return lastArrayPart.split("/")[1];
  }

  return lastArrayPart;
};

/**
 * Extract the last part of the string after the last colon (:) and take the whole Registry ID.
 *
 * @param {string} splitString - The input string to be split and processed.
 * @returns {string} The extracted last part of the string.
 */
const splitStudentsAMForAtlas = (splitString) => {
  const splitArray = splitString.split(':');
  const lastArrayPart = splitArray[splitArray.length - 1];

  return lastArrayPart;
};

/**
 * Extract the second to last part of the string after splitting by colon (:), which is the department ID.
 *
 * @param {string} splitString - The input string to be split and processed.
 * @returns {string} The extracted second to last part of the string.
 */
const splitScholarsPersonalData = (splitString) => {
  const splitArray = splitString.split(':');
  return splitArray[splitArray.length - 2];
};

/**
 * This functions determines whether the passed value is an Array
 * and whether the array is empty.
 * @param {*} arrayParam
 * @returns true if the value is an Array and it is not empty; otherwise, false.
 */
const isArrayNotEmpty = (arrayParam) => {
  return Array.isArray(arrayParam) && arrayParam.length > 0;
};

const mergedDepartments = [1522, 1523, 1524, 1513, 1514, 1515, 1511, 1512, 1519];

const isMergedDepartment = (departmentId) => {
  if (departmentId == null) return false;

  const departmentIdStr = departmentId.toString();
  // All TEI merged departments have 6 digits. AlL other departments have max 4 digits.
  if (departmentIdStr.length == 6)
    departmentId = parseInt(departmentIdStr.substring(0, 4));

  return {
    'isMerged': mergedDepartments.includes(departmentId),
    'departmentId': departmentId
  };
};

const getAEICodeFromDepartmentId = (departmentId) => {
  return parseInt(departmentId.toString().substring(0, 4));
};

const convertStartEndDateToTimestamp = (dateParam) => {
  let timestamp;

  if (dateParam == null || dateParam == undefined || dateParam == '')
    return null;

  const milliseconds = dateParam.match(/\d+/)[0];
  const offset = dateParam.match(/\+\d+/)[0];
  const date = new Date(parseInt(milliseconds));
  date.setMinutes(date.getMinutes() + parseInt(offset));
  timestamp = date.toISOString();

  return timestamp;
};

const getWeeksFromMonths = (weeksStr) => {
  let weeksNum = weeksStr.substring(6, weeksStr.length);
  let weeks2months = (Number.parseInt(weeksNum) * 4).toString();
  return weeks2months;
};

function calculateDates(isTEIDepartment) {
  const today = moment();
  const currentYear = today.year();

  let startDate;
  let endDate;

  if (today.month() >= 0 && today.month() <= 4) {
    startDate = moment(`01/04/${currentYear}`, 'DD/MM/YYYY');
  } else if (today.month() >= 5 && today.month() <= 6) {
    startDate = moment(`01/06/${currentYear}`, 'DD/MM/YYYY');
  } else if (today.month() >= 7 && today.month() < 8) {
    startDate = moment(`01/08/${currentYear}`, 'DD/MM/YYYY');
  } else if (today.month() >= 8 && today.month() < 10) {
    startDate = moment(`01/10/${currentYear}`, 'DD/MM/YYYY');
  } else if (today.month() == 10) {
    startDate = moment(`01/11/${currentYear}`, 'DD/MM/YYYY');
  } else {
    startDate = moment(`01/12/${currentYear}`, 'DD/MM/YYYY');
  }

  if (isTEIDepartment) {
    endDate = startDate.clone().add(5, 'months').endOf('month');
  } else {
    endDate = startDate.clone().add(2, 'months').endOf('month');
  }

  return { startDate, endDate };
}

/**
 * Convert date from 'YYYY-MM-DD' format to 'D/M/YY' format.
 * If the input date is not in 'YYYY-MM-DD' format, the original date is returned.
 *
 * @param {string} date - The input date string.
 * @returns {string} The converted date string in 'D/M/YY' format or the original date string.
 */
const convertDateFromYearMonthDayToDayMonthYear = (date) => {
  if (moment(date, 'YYYY-MM-DD', true).isValid()) {
    return moment(date, 'YYYY-MM-DD').format('D/M/YY');
  }
  return date;
};

/**
 * Formats a date string in 'yyyymmdd' format to 'Y-m-d' format.
 *
 * @param {string} dateString - The date string in 'yyyymmdd' format.
 * @returns {string} The formatted date string in 'Y-m-d' format.
 */
const formatDateToISO = (dateString) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  return `${year}-${month}-${day}`;
};

/**
 * Formats a date string or timestamp to 'Y-m-d' format.
 *
 * @param {string | number} inputDate - The date string or timestamp to be formatted.
 * @returns {string} The formatted date string in 'Y-m-d' format.
 */
const formatDateString = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const AssignedPositionStatus = {
  NOT_FOUND: 0,
  FOUND: 1,
  NO_MORE_DATA: -1
};

/**
 * Gets the TEI (Technological Educational Institute) code based on the department code.
 *
 * @param {string | number} departmentCode - The department code to determine the TEI code for
 * (depending on whether the department is situated in Patras or Peloponnese).
 * @returns {string} TEI code corresponding to the given department code.
 *                   Returns 'Unknown TEI' if the department code does not match any known TEI.
 *
 * @example
 * const departmentCode = '152201';
 * const teiCode = getTypeOfTEI(departmentCode);
 * // teiCode will be '349776' as departmentCode is included in TEI Patras array.
 */
const getTypeOfTEI = (departmentCode) => {
  const departmentCodeNum = Number(departmentCode);
  // Kodikoi upoergon for TEI Dutikhs Elladas and TEI Peloponnisou
  // const codeTeiPatras = '349776';
  // const codeTeiPeloponnisou = '349775';
  const codeTeiPatras = '6016548';
  const codeTeiPeloponnisou = '6016547';
  const teiPatras = [152201, 152202, 152301, 152401];
  const teiPeloponnisou = [151301, 151401, 151501, 151101, 151201, 151901];

  if (teiPatras.includes(departmentCodeNum)) return codeTeiPatras;
  if (teiPeloponnisou.includes(departmentCodeNum)) return codeTeiPeloponnisou;

  return 'Unknown TEI';
};

const getTypeOfDepartmentOPS = (departmentCode) => {
  const codeAEI = '6016549';
  return (departmentCode.length <= 4) ? codeAEI : getTypeOfTEI(departmentCode);
};

/**
 * Pauses execution for a specified amount of time.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the given duration.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Export list
module.exports = {
  FILE_TYPES,
  FILE_TYPES_WITH_DOT,
  TEN_MINUTES,
  ONE_HOUR,
  ONE_N_HALF_HOUR,
  THREE_HOURS,
  THIRTY_HOURS,
  SIX_HOURS,
  SEVEN_HOURS,
  EIGHT_HOURS,
  SALT_ROUNDS,
  departmentsMap,
  AssignedPositionStatus,
  formatDocExtension,
  splitStudentsAM,
  splitScholarsPersonalData,
  isMergedDepartment,
  getAEICodeFromDepartmentId,
  isArrayNotEmpty,
  convertStartEndDateToTimestamp,
  getWeeksFromMonths,
  calculateDates,
  splitStudentsAMForAtlas,
  convertDateFromYearMonthDayToDayMonthYear,
  formatDateToISO,
  formatDateString,
  getTypeOfTEI,
  getTypeOfDepartmentOPS,
  sleep
};
