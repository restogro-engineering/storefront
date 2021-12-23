import { Component, ViewChild, Input } from "@angular/core";
import { NgImageSliderComponent } from "ng-image-slider";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-categories-images",
    templateUrl: "./categories-images.component.html",
    styleUrls: ["./categories-images.component.scss"]
})
export class CategoriesImagesComponent {
    @Input()
    imageObject: any = [];

    @ViewChild("nav") slider: NgImageSliderComponent;
    constructor(public router: Router) {}

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
