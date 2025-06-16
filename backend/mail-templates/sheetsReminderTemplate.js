const generateEmailBody = () => {
  return `<html>
  <head>
    <meta charset="utf-8">
    <title>Δελτία</title>
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
          <p>Αγαπητέ/ή φοιτητή/φοιτήτρια,</p>

          <p>Σας υπενθυμίζουμε ότι για την ολοκλήρωση της Πρακτικής σας Άσκησης, είναι απαραίτητη η συμπλήρωση των <strong>δελτίων εισόδου και εξόδου</strong>.</p>
          <p><strong>Δεν θα πραγματοποιηθεί καμία πληρωμή</strong> σε φοιτητές που δεν έχουν υποβάλει τα απαραίτητα δελτία.</p>

          <ul>
            <li>Το <strong>δελτίο εισόδου</strong> πρέπει να συμπληρωθεί <strong>κατά την έναρξη</strong> της πρακτικής.</li>
            <li>Το <strong>δελτίο εξόδου</strong> πρέπει να συμπληρωθεί <strong>με τη λήξη</strong> της πρακτικής.</li>
          </ul>
          
          <p>Η συμπλήρωση τους είναι απαραίτητη για την ορθή ολοκλήρωση της πρακτικής άσκησης.</p>

          <p>Παρακαλούμε φροντίστε να τα υποβάλλετε έγκαιρα μέσω της πλατφόρμας.</p>

          <p>Για οποιαδήποτε απορία, μπορείτε να επικοινωνήσετε με το γραφείο πρακτικής άσκησης.</p>

          <p>Με εκτίμηση,<br>
          Ομάδα Πρακτικής Άσκησης<br>
          Πανεπιστήμιο Πελοποννήσου</p>
          <br>
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