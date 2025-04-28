export abstract class BankUtils {
  public static bankNames = {
    'ΕΘΝΙΚΗ ΤΡΑΠΕΖΑ ΤΗΣ ΕΛΛΑΔΟΣ Α.Ε.': '011',
    'ALPHA BANK': '014',
    'ATTICA BANK ΑΝΩΝΥΜΗ ΤΡΑΠΕΖΙΚΗ ΕΤΑΙΡΕΙΑ': '016',
    'ΤΡΑΠΕΖΑ ΠΕΙΡΑΙΩΣ Α.Ε.': '017',
    'ΤΡΑΠΕΖΑ EUROBANK Α.Ε.': '026',
    'ΤΡΑΠΕΖΑ OPTIMA BANK Α.Ε': '034',
    'ΤΡΑΠΕΖΑ BNP PARIBAS SECURITIES SERVICES': '039',
    'FCA BANK GmbH': '040',
    'ΤΡΑΠΕΖΑ ΣΑΝΤΕΡΑΤ ΙΡΑΝ': '050',
    'AEGEAN BALTIC BANK Α.Τ.Ε.': '056',
    'VIVABANK ΜΟΝΟΠΡΟΣΩΠΗ ΑΝΩΝΥΜΗ ΤΡΑΠΕΖΙΚΗ ΕΤΑΙΡΕΙΑ': '057',
    'ΣΥΝΕΤΑΙΡΙΣΤΙΚΗ ΤΡΑΠΕΖΑ ΧΑΝΙΩΝ Συνεταιρισμός Περιορισμένης Ευθύνης': '069',
    'HSBC CONTINENTAL EUROPE, GREECE': '071',
    'ΤΡΑΠΕΖΑ ΚΥΠΡΟΥ ΔΗΜΟΣΙΑ ΕΤΑΙΡΕΙΑ ΛΤΔ (*)': '073',
    'ΣΥΝΕΤΑΙΡΙΣΤΙΚΗ ΤΡΑΠΕΖΑ ΗΠΕΙΡΟΥ Συν.Π.Ε': '075',
    'BANK OF AMERICA EUROPE DESIGNATED ACTIVITY COMPANY, ΚΑΤΑΣΤΗΜΑ ΑΘΗΝΩΝ': '081',
    'CITIBANK EUROPE PLC (CEP)': '084',
    'ΠΑΓΚΡΗΤΙΑ ΤΡΑΠΕΖΑ Α.Ε': '087',
    'ΣΥΝΕΤΑΙΡΙΣΤΙΚΗ ΤΡΑΠΕΖΑ ΚΑΡΔΙΤΣΑΣ Συν. Π.Ε.': '089',
    'ΣΥΝΕΤΑΙΡΙΣΤΙΚΗ ΤΡΑΠΕΖΑ ΘΕΣΣΑΛΙΑΣ Συν. Π.Ε.': '091',
    'ΣΥΝΕΤΑΙΡΙΣΤΙΚΗ ΤΡΑΠΕΖΑ ΚΕΝΤΡΙΚΗΣ ΜΑΚΕΔΟΝΙΑΣ Συν.Π.Ε.': '099',
    'ΤΡΑΠΕΖΑ ΤΗΣ ΕΛΛΑΔΟΣ Α.Ε.': '10',
    'VOLKSWAGEN BANK GmbH': '102',
    'BMW AUSTRIA BANK GmbH': '105',
    'ΤΡΑΠΕΖΑ T.C ZIRAAT BANKASI A.S.': '109',
    'DEUTSCHE BANK AG': '111',
    'HAMBURG COMMERCIAL BANK AG': '115',
    'PROCREDIT BANK (BULGARIA) EAD': '116',
    'EFG BANK (LUXEMBOURG) S.A.': '118',
    'ABN AMRO BANK N.V.': '119',
    'BANK OF CHINA (EUROPE) S.A-ΥΠΟΚΑΤΑΣΤΗΜΑ ΑΘΗΝΑΣ': '121',
    'BFF BANK S.p.A ΕΛΛΗΝΙΚΟ ΥΠΟΚΑΤΑΣΤΗΜΑ': '122',
    'SANTANDER CONSUMER FINANCE S.A.': '123',
    'J.P. MORGAN AG-ATHENS BRANCH': '124',
    'TBI BANK EAD- BRANCH GREECE': '125',
    'ΓΚΟΛΝΤΜΑΝ ΣΑΚΣ ΜΠΑΝΚ ΓΙΟΥΡΟΠ ΣΕ,ΥΠΟΚΑΤΑΣΤΗΜΑ ΑΘΗΝΩΝ': '126',
    'ΣΥΝΕΤΑΙΡΙΣΤΙΚΗ ΤΡΑΠΕΖΑ ΟΛΥΜΠΟΣ Συν. Π.Ε': '95'
  }

  public static getBankNameByIBAN(iban: string): string {
    if (!iban) return '';

    // Remove all spaces and colons from the IBAN
    iban = iban.replace(/[\s:]/g, '');

    // Extract the 5th, 6th, and 7th digits from the IBAN
    const bankCode = iban.slice(4, 7);
    const bankName = Object.entries(BankUtils.bankNames)
                           .find(([name, code]) => code == bankCode);

    return bankName ? bankName[0] : "Bank not found";
  }

  public static validateIban(ibanGR: string): boolean {
    let iban = ibanGR.replace(/\s+/g, '').toUpperCase(); // Remove spaces and make uppercase

    // Special case: Trust Revolut IBANs
    if (iban.startsWith('LT') || iban.startsWith('GB')) {
        return true;
    }

    const rearranged = iban.slice(4) + iban.slice(0, 4);
    
    let numericIban = '';
    for (const char of rearranged) {
        if (char >= '0' && char <= '9') {
            numericIban += char;
        } else if (char >= 'A' && char <= 'Z') {
            numericIban += (char.charCodeAt(0) - 55).toString();
        } else {
            return false; // Invalid character found
        }
    }

    // Now check if the numeric value modulo 97 equals 1
    let remainder = numericIban;
    while (remainder.length > 9) {
        const part = remainder.slice(0, 9);
        remainder = (parseInt(part, 10) % 97).toString() + remainder.slice(9);
    }
    
    return parseInt(remainder, 10) % 97 === 1;
  }

}
