import {
    Component,
    ViewChild,    
    OnInit
} from "@angular/core";
import { gql } from "apollo-angular";
import { NgImageSliderComponent } from "ng-image-slider";
import { DataService } from "../../providers/data/data.service";
import { Observable } from "rxjs";
import { Router } from '@angular/router';

@Component({
    selector: "vsf-top-brands",
    templateUrl: "./top-brands.component.html",
    styleUrls: ["./top-brands.component.scss"]
})
export class TopBrandsComponent implements OnInit {
    imageObject: any = [];

    topSellers$: Observable<any[]>;
    topSellersLoaded$: Observable<boolean>;

    @ViewChild("nav") slider: NgImageSliderComponent;
    constructor(
        private dataService: DataService,  
        public router: Router      
    ) {}

    ngOnInit() {
        this.dataService
            .query(GET_TOP_BRANDS, {
                facetId: "2"
            })
            .subscribe(data => {
                data.facet.values.forEach((element: any) => {
                    this.imageObject.push({
                        image:
                            "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg",
                        thumbImage:
                            "https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg",
                        title: element.name,
                        ...element
                    });
                });
            });
    }

    prevImageClick() {
        this.slider.prev();
    }

    nextImageClick() {
        this.slider.next();
    }

    imageClick(data: any) {        
        // this.router.navigate(["/category", this.imageObject[data].slug]);
        debugger;
        this.imageObject[data]
        this.router.navigate(['/search', {
            facets: this.imageObject[data].id,
        }], {
            queryParamsHandling: 'merge',            
           
        });

    }
}

const GET_TOP_BRANDS = gql`
    query Facet($facetId: ID!) {
        facet(id: $facetId) {
            id
            name
            values {
                id
                name
                code
            }
        }
    }
`;
