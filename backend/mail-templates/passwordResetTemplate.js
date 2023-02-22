const generateEmailBody = (password) => {
  return `<html>
  <head>
    <meta charset="utf-8">
    <title>Νέο Σχόλιο</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content" style="padding-top:0px;">
    <h4>Αυτοματοποιημένο μήνυμα</h4>
      <span>Γεια σας, Λαμβάνετε αυτό το email επειδή ζητήσατε επαναφορά κωδικού πρόσβασης για τον λογαριασμό σας.</span><br><br>
      <span>Ο νέος σας κωδικός πρόσβασης είναι: <strong>${password}</strong></span><br><br>
      <span>Κάντε κλικ στο παρακάτω κουμπί για να συνδεθείτε με τον νέο σας κωδικό πρόσβασης</span><br><br>
      <a href='https://praktiki-new.uop.gr/' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Login</a>
      <br><hr style="margin-top: 16px;">
          <span style="font-style: italic;">Το παρόν μήνυμα είναι αυτοματοποιημένο και δεν επιδέχεται απάντησης. </span>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = { generateEmailBody };
