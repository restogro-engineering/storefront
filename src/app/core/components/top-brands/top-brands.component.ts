import { Component, ViewChild, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { gql } from "apollo-angular";
import { NgImageSliderComponent } from "ng-image-slider";
import { DataService } from "../../providers/data/data.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-top-brands",
    templateUrl: "./top-brands.component.html",
    styleUrls: ["./top-brands.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class TopBrandsComponent implements OnInit {
    @Input()
    imageObject: any = [];

    @ViewChild("nav") slider: NgImageSliderComponent;
    constructor(public router: Router) {}


    ngOnInit(){
                
    }

    prevImageClick() {
        this.slider.prev();
    }

    nextImageClick() {
        this.slider.next();
    }

    imageClick(data: any) {
        this.router.navigate(["/category", this.imageObject[data].slug]);
    }
}
