const gmailTransporter = require('../config/mailer_config.js');
const commentsTemplate = require('../mail-templates/commentsTemplate.js');
const pswResetTemplate = require('../mail-templates/passwordResetTemplate.js');
const sheetsReminderTemplate = require('../mail-templates/sheetsReminderTemplate.js');

/**
 * Send the email to the user to let him know that password has been changed
 *
 * @param {string} password The new password
 * @param {string} mailToSendList The email address to send the email to
 */
const sendPasswordResetEmail = async (password, mailToSendList) => {
  try {
    const info = await gmailTransporter.sendMail({
      from: 'pa@go.uop.gr', // sender address
      to: mailToSendList, // list of receivers
      subject: 'Password Reset', // Subject line
      html: pswResetTemplate.generateEmailBody(password) // mail body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Send an email with a new comment
 *
 * @param {string} comment The comment to send
 * @param {string} mailToSendList The email address to send the email to
 */
const sendCommentEmail = async (comment, mailToSendList) => {
  try {
    const info = await gmailTransporter.sendMail({
      from: 'pa@go.uop.gr', // sender address
      to: mailToSendList, // list of receivers
      subject: 'Νέο Σχόλιο από το σύστημα Πρακτικής Άσκησης', // Subject line
      html: commentsTemplate.generateEmailBody(comment) // mail body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Send an email reminder to students about entrance/exit sheets
 *
 * @param {string|string[]} mailToSendList The email address(es) to send the reminder to
 */
const sendSheetsReminderEmail = async (mailToSendList) => {
  try {
    const info = await gmailTransporter.sendMail({
      from: 'pa@go.uop.gr',
      to: 'pa@go.uop.gr',   // required, use own address here
      bcc: mailToSendList,
      subject: 'Υπενθύμιση για Δελτία Εισόδου-Εξόδου Πρακτικής Άσκησης',
      html: sheetsReminderTemplate.generateEmailBody()
    });

    console.log('Sheets reminder sent: %s', info.messageId);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendCommentEmail,
  sendSheetsReminderEmail
};



