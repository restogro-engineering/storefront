import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-customer-feedback",
    templateUrl: "./customer-feedback.component.html",
    styleUrls: ["./customer-feedback.component.scss"]
})
export class CustomerFeedbackComponent implements OnInit {
    @Input()
    imageObject: any = [1, 2, 3, 4, 5, 6, 7];
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
