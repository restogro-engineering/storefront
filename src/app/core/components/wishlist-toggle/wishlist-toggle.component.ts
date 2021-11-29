import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { from, merge, Observable, timer, zip } from "rxjs";
import {
    distinctUntilChanged,
    map,
    shareReplay,
    switchMap,
    take
} from "rxjs/operators";

import { DataService } from "../../providers/data/data.service";
import { StateService } from "../../providers/state/state.service";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import { GET_WISHLIST_DETAIL } from "./wishlist-toggle.graphql";
import { Router } from "@angular/router";
import { GetActiveCustomer } from "../../../common/generated-types";
import { GET_ACTIVE_CUSTOMER } from "../../../common/graphql/documents.graphql";

@Component({
    selector: "vsf-wishlist-toggle",
    templateUrl: "./wishlist-toggle.component.html",
    styleUrls: ["./wishlist-toggle.component.scss"]
})
export class WishListToggleComponent implements OnInit {
    @Output() toggle = new EventEmitter<void>();
    wishlist$: Observable<{ total: number; quantity: number }>;
    wishlistChangeIndication$: Observable<boolean>;
    isSignedIn$: Observable<boolean>;
    activeCustomer$: Observable<GetActiveCustomer.ActiveCustomer | undefined>;
    faHeart = faHeart;

    constructor(
        private dataService: DataService,
        private stateService: StateService,
        private router: Router
    ) {}

    goToWishlist() {
        this.router.navigate(["/wishlist"]);
    }

    ngOnInit() {
        this.wishlist$ = merge(
            this.stateService.select(state => state.wishlistVariantId),
            this.stateService.select(state => state.signedIn)
        ).pipe(
            switchMap(() =>
                this.dataService.query<any>(
                    GET_WISHLIST_DETAIL,
                    {},
                    "network-only"
                )
            ),
            map(({ getWishList }) => {
                const { items } = getWishList;
                this.stateService.setState("wishListItems", items);
                return {
                    total: items ? items.length : 0,
                    quantity: items ? items.length : 0
                };
            }),
            shareReplay(1)
        );
        this.wishlistChangeIndication$ = this.wishlist$.pipe(
            map(wishlist => wishlist.quantity),
            distinctUntilChanged(),
            switchMap(() =>
                zip(from([true, false]), timer(0, 1000), val => val)
            )
        );

        const getActiveCustomer$ = this.dataService.query<
            GetActiveCustomer.Query
        >(GET_ACTIVE_CUSTOMER, {}, "network-only");

        getActiveCustomer$.pipe(take(1)).subscribe(data => {
            if (data.activeCustomer) {
                this.stateService.setState("signedIn", true);
            }
        });

        this.activeCustomer$ = this.stateService
            .select(state => state.signedIn)
            .pipe(
                switchMap(() => getActiveCustomer$),
                map(data => data && data.activeCustomer)
            );
    }
}
