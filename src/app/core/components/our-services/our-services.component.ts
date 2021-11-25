import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-our-services",
    templateUrl: "./our-services.component.html",
    styleUrls: ["./our-services.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class OurServicesComponent implements OnInit {
    constructor(public router: Router) {}
    ngOnInit() {}
}
