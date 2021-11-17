import {
    Component,
    ViewChild,
    ChangeDetectionStrategy,
    OnInit
} from "@angular/core";
import { gql } from "apollo-angular";
import { NgImageSliderComponent } from "ng-image-slider";
import { DataService } from "../../providers/data/data.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Component({
    selector: "vsf-deal-of-day",
    templateUrl: "./deal-of-day.component.html",
    styleUrls: ["./deal-of-day.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DealOfDayComponent implements OnInit {
    topSellers$: Observable<any[]>;
    topSellersLoaded$: Observable<boolean>;

    @ViewChild("nav") slider: NgImageSliderComponent;
    constructor(
        private dataService: DataService,
        private sanitizer: DomSanitizer
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
            .query(GET_DEAL_OF_DAY, {
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

const GET_DEAL_OF_DAY = gql`
    query GetDealOfTheDay($input: SearchInput!) {
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
