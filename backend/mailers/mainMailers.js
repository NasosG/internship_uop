const gmailTransporter = require('../mailer_config.js');

const mainMailer = async (password, mailToSendList) => {
  try {
    const info = await gmailTransporter.sendMail({
      from: 'no-reply@pa.uop.gr', // sender address
      to: mailToSendList, // list of receivers
      subject: 'Password Reset', // Subject line
      // send the email to the user to let him know that password has been changed
      html: "<span>Hello, You're receiving this email because you requested a password reset for your account.</span><br><br>" +
        "<span>Your new password is: <strong>" + password + '</strong></span><br><br>' +
        "<span>Click on the button below to login with your new password</span><br><br>" +
        "<a href='http://localhost:4200/credentials-generic' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Login</a>",
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error(error);
  }
};

const commentMailer = async (comment, mailToSendList) => {
  try {
    const info = await gmailTransporter.sendMail({
      from: 'no-reply@pa.uop.gr', // sender address
      to: mailToSendList, // list of receivers
      subject: 'Νέο Σχόλιο', // Subject line
      // send the email to the user to let him know that password has been changed
      html: "<span>Γειά σας. Λαμβάνετε αυτό το email</span><br><br>" +
        "<span>γιατί λάβατε το παρακάτω σχόλιο <strong>" + comment + '</strong></span><br><br>' +
        "<span>στο σύστημα της Πρακτικής Άσκησης. Πατήστε στον παρακάτω σύνδεσμο για να συνδεθείτε στο σύστημα</span><br><br>" +
        "<a href='http://localhost:4200/credentials-generic' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Σύνδεση</a>",
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error(error);
  }
};

const sendPasswordResetEmail = async (newPassword = null, userEmail = null) => {
  const password = 'new-password';
  const mailToSendList = 'thanasara@windowslive.com';
  // const mailToSendList = userEmail;
  await mainMailer(newPassword, mailToSendList);
};
commentMailer;

const sendCommentEmail = async (comment = null, userEmail = null) => {
  const password = 'new-password';
  const mailToSendList = 'thanasara@windowslive.com';
  // const mailToSendList = userEmail;
  await commentMailer(comment, mailToSendList);
};

module.exports = {
  sendPasswordResetEmail,
  sendCommentEmail
};



