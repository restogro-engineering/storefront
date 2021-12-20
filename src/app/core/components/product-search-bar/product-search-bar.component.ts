import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { SEARCH_PRODUCTS } from "../product-list/product-list.graphql";
import { DataService } from "../../providers/data/data.service";

@Component({
    selector: "vsf-product-search-bar",
    templateUrl: "./product-search-bar.component.html",
    styleUrls: ["./product-search-bar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSearchBarComponent implements OnInit, OnDestroy {
    /** If true, searches as you type */
    @Input() autoSearch = false;
    results: any[] = [];
    queryField: FormControl = new FormControl();
    searchTerm = new FormControl("");
    private subscription: Subscription;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService
    ) {}

    ngOnInit() {
        if (this.autoSearch) {
            this.subscription = this.searchTerm.valueChanges
                .pipe(debounceTime(250))
                .subscribe(term => this.doSearch(term));
        }

        this.subscription = this.searchTerm.valueChanges
            .pipe(debounceTime(250))
            .subscribe(term => this.search(term));
    }

    search(term: any) {
        if (term) {
            this.dataService
                .query<any>(SEARCH_PRODUCTS, {
                    input: {
                        term,
                        groupByProduct: true,
                        take: 6
                    }
                })
                .subscribe(res => {
                    if (res.search && res.search.items) {
                        this.results = res.search.items.map(
                            (i: any) => i.productName
                        );
                    }
                });
        } else {
            this.results = [];
        }
    }
    doSearch(term: string) {
        this.results = [];
        this.router.navigate(["/search"], {
            queryParams: { search: term },
            relativeTo: this.route,
            queryParamsHandling: "merge"
        });
        this.searchTerm.setValue("", { emitEvent: false });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
