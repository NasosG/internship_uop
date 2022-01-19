import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let customJsObj = document.getElementById('custom_js')!;
        if (customJsObj != null) customJsObj.remove();
        this.loadScript();
      }
    });
  }
}
