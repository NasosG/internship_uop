// All the accepted file types
const FILE_TYPES = [
  'png', 'jpg', 'gif', 'jpeg', 'pdf', 'webp', 'doc', 'docx'
];

const FILE_TYPES_WITH_DOT = [
  '.png', '.jpg', '.gif', '.jpeg', '.pdf', '.webp', '.doc', '.docx'
];

const ONE_HOUR = 3600000;
const THREE_HOURS = 10800000;
const THIRTY_HOURS = 108000000;

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

const splitStudentsAM = (splitString) => {
  const splitArray = splitString.split(':');
  return splitArray[splitArray.length - 1];
};

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

// Export list
module.exports = {
  FILE_TYPES,
  FILE_TYPES_WITH_DOT,
  ONE_HOUR,
  THREE_HOURS,
  THIRTY_HOURS,
  departmentsMap,
  formatDocExtension,
  splitStudentsAM,
  splitScholarsPersonalData,
  isArrayNotEmpty
};
