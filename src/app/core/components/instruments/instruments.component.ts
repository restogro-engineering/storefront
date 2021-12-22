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
    selector: "vsf-instruments",
    templateUrl: "./instruments.component.html",
    styleUrls: ["./instruments.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentsComponent implements OnInit {
    topSellers$: Observable<any[]>;
    topSellersLoaded$: Observable<boolean>;

    @ViewChild("nav") slider: NgImageSliderComponent;
    constructor(private dataService: DataService) {}

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
                    term: "",
                    groupByProduct: true,
                    collectionId: "33",
                    facetValueIds: [],
                    take: 15,
                    sort: {},
                    skip: 0
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