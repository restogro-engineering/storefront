import { Component, ViewChild } from "@angular/core";
import { NgImageSliderComponent } from "ng-image-slider";

@Component({
    selector: "vsf-top-brands",
    templateUrl: "./top-brands.component.html",
    styleUrls: ["./top-brands.component.scss"]
})
export class TopBrandsComponent {
    @ViewChild("nav") slider: NgImageSliderComponent;
    imageObject = [
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg",
            title: "Hummingbirds are amazing creatures"
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg"
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg",
            title: "Example with title."
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg",
            title: "Hummingbirds are amazing creatures"
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg"
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg",
            title: "Example two with title."
        }, {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg"
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg",
            title: "Example with title."
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg",
            title: "Hummingbirds are amazing creatures"
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg"
        },
        {
            image:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg",
            thumbImage:
                "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg",
            title: "Example two with title."
        }
    ];

    prevImageClick() {
        this.slider.prev();
    }

    nextImageClick() {
        this.slider.next();
    }
}
