const mainMailer = require('../mailers/mainMailers.js');

describe('mainMailer function', () => {
  it('should be defined', () => {
    expect(mainMailer).toBeDefined();
  });

  it('should return a value', async () => {
    const password = '12345';
    const comment = "Δεν διαβάζεται το ΑΦΜ";
    const mailToSendList = 'user@example.com';
    //const result = await mainMailer.sendPasswordResetEmail(password, mailToSendList);
    const result = await mainMailer.sendCommentEmail(comment, mailToSendList);
    // expect(result).toBeDefined();
  });
});
