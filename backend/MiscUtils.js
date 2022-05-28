// All the accepted file types
const FILE_TYPES = [
  'png', 'jpg', 'gif', 'jpeg', 'pdf', 'webp', 'doc', 'docx'
];

const FILE_TYPES_WITH_DOT = [
  '.png', '.jpg', '.gif', '.jpeg', '.pdf', '.webp', '.doc', '.docx'
];

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

// Export list
module.exports = {
  FILE_TYPES,
  FILE_TYPES_WITH_DOT,
  formatDocExtension
};
