import { Component, ViewChild, Input } from "@angular/core";
import { NgImageSliderComponent } from "ng-image-slider";
import { DataService } from "../../providers/data/data.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-main-posters",
    templateUrl: "./main-posters.component.html",
    styleUrls: ["./main-posters.component.scss"]
})
export class MainPostersComponent {
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
