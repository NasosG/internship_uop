import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { ActiveApplicationsRanked } from '../active-applications-ranked.model';
import { Company } from '../company.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'companies-students-applications',
  templateUrl: './students-applications.component.html',
  styleUrls: ['./students-applications.component.css']
})
export class StudentsApplicationsComponent implements OnInit, AfterViewInit {
  @ViewChild('appTable') table: ElementRef | undefined;
  company!: Company;
  apps: ActiveApplicationsRanked[] = [];
  constructor(private chRef: ChangeDetectorRef, public companyService: CompanyService) { }

  dtOptions: any = { };

  ngOnInit() {
    this.companyService.getProviderById()
      .subscribe((company: Company) => {
        this.company = company;
        console.log(this.company);

        this.companyService.getStudentActiveApplications(this.company.name, this.company.afm).subscribe((apps: ActiveApplicationsRanked[]) => {
          this.apps = apps;
          this.chRef.detectChanges();
          const table: any = $('#appTable');
          this.table = table.DataTable({
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, 'All']
            ],
            lengthChange: true,
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            autoWidth: false,
            responsive: true,
            select: true,
            pagingType: 'full_numbers',
            processing: true,
            columnDefs: [{ orderable: false, targets: [3, 5, 6, 7] }],
            language: {}
          });
        });
      });
  }



  changeSelectedColor() {
    // var alphas = new Array;
    // const inputField = (<HTMLInputElement>document.getElementsByClassName("kl")[0]);

    // for (let i=0; i<inputField.value.length; i++) {
    //   let inputValue = (<HTMLInputElement>document.getElementsByClassName("kl")[i]).value

    //   alert(inputValue );
    //   if (inputValue == "ΟΧΙ") {
    //     inputField.classList?.add("text-danger");
    //     inputField.classList?.remove("text-success");
    //   }
    //   else {
    //     inputField.classList?.add("text-success");
    //     inputField.classList?.remove("text-danger");
    //   }
    // }

    // let inputValue = (<HTMLInputElement>document.getElementsByClassName("kl")[0]).value;
    // alert (inputValue);

  }


  ngAfterViewInit(): void {
    // $('#example1').DataTable();

    $('.kl').change(function () {
      if ($(this).val() === "ΟΧΙ") {
        $(this).addClass("text-danger");
        $(this).removeClass("text-success");
      }
      else {
        $(this).toggleClass("text-success");
        $(this).removeClass("text-danger");
      }
    })
  }


  fireTheWhole() {
    Swal.fire({
      title: 'Αποδοχή Φοιτητών',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην επιλογή των φοιτητών;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

}
