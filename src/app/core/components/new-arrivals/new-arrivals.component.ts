import {
    Component,
    ViewChild,
    ChangeDetectionStrategy,
    OnInit
} from "@angular/core";
import { gql } from "apollo-angular";
import { NgImageSliderComponent } from "ng-image-slider";
import { DataService } from "../../providers/data/data.service";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Component({
    selector: "vsf-new-arrivals",
    templateUrl: "./new-arrivals.component.html",
    styleUrls: ["./new-arrivals.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewArrivalsComponent implements OnInit {
    topSellers$: Observable<any[]>;
    topSellersLoaded$: Observable<boolean>;

    @ViewChild("nav") slider: NgImageSliderComponent;
    constructor(
        private dataService: DataService        
    ) {}

    imageObject = [];

    prevImageClick() {
        this.slider.prev();
    }

    nextImageClick() {
        this.slider.next();
    }

    ngOnInit() {
        this.topSellers$ = this.dataService
            .query(NEW_ARRIVALS, {
                input: {
                    facetValueIds: ["41"],
                    take: 10,
                    groupByProduct: true,
                    sort: {
                        price: "ASC"
                    }
                }
            })
            .pipe(
                map(data => data.search.items),
                shareReplay(1)
            );
        this.topSellersLoaded$ = this.topSellers$.pipe(
            map(items => 0 < items.length)
        );
    }
}

const NEW_ARRIVALS = gql`
    query GetNewArrivals($input: SearchInput!) {
        search(input: $input) {
            items {
                productId
                slug
                productAsset {
                    id
                    preview
                }
                priceWithTax {
                    ... on PriceRange {
                        min
                        max
                    }
                }
                productName
            }
        }
    }
`;
