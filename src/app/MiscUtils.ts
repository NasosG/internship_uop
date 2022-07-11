
import Swal from 'sweetalert2';

export abstract class Utils  {

  public static onSaveSwal() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      // Reload the Page
      location.reload();
    });
  }

  public static reformatDateToEULocaleStr(date: Date): string {
    let newDate = new Date(date);
    return (newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear());
  }

  public static getPreferredTimestamp(dateParam: any): string {
    let dateVal = new Date(dateParam);
    let preferredTimestamp = dateVal.getDay() + "/" + dateVal.getMonth()+ "/" + dateVal.getFullYear() + " " + dateVal.getHours() + ":" + dateVal.getMinutes();
    return preferredTimestamp;
  }

  public static reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;

    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);

    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

  public static changeDateFormat(dateStr: any) {
    let dArr = dateStr.split("-");  // ex input "2010-01-18"
    return dArr[2] + "/" + dArr[1] + "/" + dArr[0].substring(2); //ex out: "18/01/10"
  }

  public static isLengthOutOfBounds(lengthMin: number, lengthMax: number): boolean {
    return (length > lengthMin && length > lengthMax);
  }

  public static isEmptyOrWhiteSpace(str: string) {
    return str === null || str.match(/^ *$/) !== null;
  }

  public static TaxNumRule(afm: string): boolean {
    if (Utils.isEmptyOrWhiteSpace(afm))
        return false;

    if (afm.length != 9)
        return false;

    let result = false;
    let count = 0;
    let digit, finalNum = 0;
    let temp;

    for (let i = afm.length; i >= 1; i--) {
        if (count != 0) {
            temp = afm[i - 1];
            digit = parseInt(temp);
            finalNum = finalNum + digit * Math.pow(2, count);
        }
        count++;
    }

    temp = afm[afm.length - 1];
    digit = parseInt(temp);

    if (((finalNum % 11) % 10) == digit)
        result = true;
    else
        result = false;

    return result;
  }

}
