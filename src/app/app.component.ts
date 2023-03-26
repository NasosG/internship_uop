import { Component, Renderer2, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'UOPinternship';

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  /**
   * Updates all tables with the 'table' class to have or not have the 'table-dark' class
   * based on the current dark mode setting. (mostly for bootstrap tables)
  */
  updateTableDarkMode() {
    const tables = this.el.nativeElement.querySelectorAll('.table');
    tables.forEach((table: HTMLElement) => {
      if (this.isDarkModeEnabled) {
        this.renderer.addClass(table, 'table-dark');
      } else {
        this.renderer.removeClass(table, 'table-dark');
      }
    });
  }

  /**
   * Observes changes to the body's class list and updates the table's dark mode accordingly.
  */
  observeBodyClassChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.updateTableDarkMode();
        }
      });
    });

    observer.observe(document.body, { attributes: true });
  }

  /**
   * Angular lifecycle hook that is called after a component's view has been fully initialized.
  */
  ngAfterViewInit() {
    this.observeBodyClassChanges();
    this.updateTableDarkMode();
  }

  /**
   * Checks if the dark mode is enabled or not.
   * @returns {boolean} - true if dark mode is enabled, false otherwise.
  */
  get isDarkModeEnabled(): boolean {
    return localStorage.getItem("mode") === "dark";
  }

  /**
   * Loads the custom script (assets/js/script.js) into the head of the document.
  */
  public loadScript() {
    console.log("preparing to load...");
    let node = document.createElement("script");
    node.src = 'assets/js/script.js';
    node.type = "text/javascript";
    node.async = true;
    node.id = 'custom_js';
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let customJsObj = document.getElementById('custom_js')!;
        if (customJsObj != null) customJsObj.remove();
        this.loadScript();
      }
    });
  }

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
