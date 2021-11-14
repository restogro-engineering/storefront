import { Component, ViewChild } from "@angular/core";
import { NgImageSliderComponent } from "ng-image-slider";

@Component({
    selector: "vsf-main-posters",
    templateUrl: "./main-posters.component.html",
    styleUrls: ["./main-posters.component.scss"]
})
export class MainPostersComponent {
    @ViewChild("nav") slider: NgImageSliderComponent;
    imageObject = [
        {
            image:
                "https://rukminim1.flixcart.com/flap/844/140/image/296e1504bce3ee6a.jpg?q=50",
            thumbImage:
                "https://rukminim1.flixcart.com/flap/844/140/image/296e1504bce3ee6a.jpg?q=50",
            title: "Hummingbirds are amazing creatures"
        },
        {
            image:
                "https://rukminim1.flixcart.com/flap/3376/560/image/a0f90bf38b918bcd.jpg?q=50",
            thumbImage:
                "https://rukminim1.flixcart.com/flap/3376/560/image/a0f90bf38b918bcd.jpg?q=50",
            title: "Example with title."
        },
        {
            image:
                "https://rukminim1.flixcart.com/flap/844/140/image/296e1504bce3ee6a.jpg?q=50",
            thumbImage:
                "https://rukminim1.flixcart.com/flap/844/140/image/296e1504bce3ee6a.jpg?q=50"
        }
    ];

    prevImageClick() {
        this.slider.prev();
    }

    nextImageClick() {
        this.slider.next();
    }
}
