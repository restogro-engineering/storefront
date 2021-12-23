import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-image-slider",
    templateUrl: "./image-slider.component.html",
    styleUrls: ["./image-slider.component.scss"]
})
export class ImageSliderComponent implements OnInit {
    @Input()
    imageObject: any = [];
    slideIndex: any = 0;

    constructor(public router: Router) {}

    ngOnInit() {
        this.showSlides(this.slideIndex);
    }

    plusSlides(n: any) {
        this.showSlides((this.slideIndex += n));
    }

    currentSlide(n: any) {
        this.showSlides((this.slideIndex = n));
    }

    showSlides(n: any) {
        if (this.imageObject.length <= n) {
            this.slideIndex = 0;
        } else if (n < 0) {
            this.slideIndex = this.imageObject.length - 1;
        } else {
            this.slideIndex = n;
        }
    }

    imageClick(data: any) {
        this.router.navigate(["/category", this.imageObject[data].slug]);
    }
}
