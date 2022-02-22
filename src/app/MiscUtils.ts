
import Swal from 'sweetalert2';

export class Utils  {

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
      // To be changed in the future refresh strategy is not good
      location.reload();
    });
  }




}
