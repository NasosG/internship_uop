const generateEmailBody = (comment) => {
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
      <span>Λαμβάνετε αυτό το email </span>
          <span>γιατί προστέθηκε ένα νέο σχόλιο για την αίτησή σας στο σύστημα της Πρακτικής Άσκησης. Το σχόλιο είναι το παρακάτω:<br><strong> ${comment} </strong></span><br><br>
          <span><strong>Σημείωση:</strong> Όσο διαρκεί η φάση αιτήσεων εκδήλωσης ενδιαφέροντος, μπορείτε να κάνετε εκ νέου αίτηση, αν η αίτησή σας δεν είναι σωστή. Δεν υπάρχει περιορισμός στις αιτήσεις που μπορούν να γίνουν. Το σύστημα κρατάει την πιο πρόσφατη αίτηση.</span>
          <br><br>
          <span> Πατήστε στον παρακάτω σύνδεσμο για να συνδεθείτε στο σύστημα.</span><br>
          <a href='https://praktiki-new.uop.gr/' style='margin-top: 7px; border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Σύνδεση</a>
      <br><hr style="margin-top: 16px;">
          <span style="font-style: italic;">Το παρόν μήνυμα είναι αυτοματοποιημένο και δεν επιδέχεται απάντησης. </span>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = { generateEmailBody };
