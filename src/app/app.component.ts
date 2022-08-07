import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'UOPinternship';

  constructor(private router: Router) {}

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
    // var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    // let screenCssPixelRatio = (window.devicePixelRatio)
    if (window.devicePixelRatio > 1) {
      // TODO: Mozilla Browser fix
      // $('body').css('MozTransform', 'scale(' + 0.99 + ')');
      $('body').css('zoom', ' ' + 79.75 + '%');
    }
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
