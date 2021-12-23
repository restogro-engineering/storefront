import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-customer-feedback",
    templateUrl: "./customer-feedback.component.html",
    styleUrls: ["./customer-feedback.component.scss"]
})
export class CustomerFeedbackComponent implements OnInit {
    @Input()
    imageObject: any = [];
    slideIndex: any = 1;

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
        var i;
        var slides: any = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("dot");
        if (n > slides.length) {
            this.slideIndex = 1;
        }
        if (n < 1) {
            this.slideIndex = slides.length;
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[this.slideIndex - 1].style.display = "block";
        dots[this.slideIndex - 1].className += " active";
        this.showSlides = n;
    }

    imageClick(data: any) {
        this.router.navigate(["/category", this.imageObject[data].slug]);
    }
}
