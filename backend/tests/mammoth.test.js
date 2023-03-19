const fs = require('fs');
const Docxtemplater = require('docxtemplater');

describe('mammoth function', () => {
  it('should return a value', async () => {
    const PizZip = require("pizzip");
    const Docxtemplater = require("docxtemplater");

    const fs = require("fs");
    const path = require("path");

    // const filePath = 'word-contract-templates';
    // // Load the docx file as binary content
    // const content = fs.readFileSync(
    //   path.resolve(filePath, "συμβασηΑει.docx"),
    //   "binary"
    // );

    const filePath = './word-contract-templates/συμβασηΑει.docx';

    // Load the docx file as binary content
    const content = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (Replace placeholders {first_name} by John etc.)
    doc.render({
      CONTRACT_DATE: "20/02/2023",
      COMP_START: "20/02/2023",
      COMPANY_NAME: "LOCOTECH SA",
      COMPANY_AFM: "0900823422",
      COMPANY_ADDRESS: "Καραϊσκάκη 123",
      COMPANY_LIAISON: "ΓΙΩΡΓΟΣ",
      COMPANY_LIAISON_POSITION: "ΠΑΠΑΓΕΩΡΓΙΟΥ",
      COMP_END: "20/02/2022",
      STUDENT_NAME: "ΙΩΑΝΝΗΣ",
      STUDENT_FATHER_NAME: "ΚΩΝΣΤΑΝΤΙΝΟΣ",
      DEPT_NAME: "ΠΛΗΡΟΦΟΡΙΚΗΣ Κ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ",
      ID_NUMBER: "ΑΑ34",
      AMIKA: "123456789",
      AMKA: "01010199999",
      AFM: "123456789",
      DOY_NAME: "ΑΘΗΝΩΝ",
      PA_SUBJECT: "IT",
      PA_SUBJECT_ATLAS: "Πληροφορική",
      PA_START_DATE: "01/04/2023",
      PA_END_DATE: "30/06/2023",
      TY_NAME: "Γ. ΓΕΩΡΓΙΟΥ"
    });

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
  });
});
