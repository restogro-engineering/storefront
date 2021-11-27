import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
    TemplateRef
} from "@angular/core";
import { Observable } from "rxjs";

import { DataService } from "../../providers/data/data.service";
import { StateService } from "../../providers/state/state.service";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

import { REMOVE_FROM_WISHLIST } from "../wishlist-toggle/wishlist-toggle.graphql";
import { GetProductDetail, AddToCart } from "../../../common/generated-types";
import { ADD_TO_CART } from "../product-detail/product-detail.graphql";
import { NotificationService } from "../../providers/notification/notification.service";

@Component({
    selector: "vsf-wishlis",
    templateUrl: "./wishlist.component.html",
    styleUrls: ["./wishlist.component.scss"]
})
export class WishListComponent implements OnInit {
    @Output() toggle = new EventEmitter<void>();
    wishListItems$: Observable<{ total: number; quantity: number }>;    
    faWindowClose = faWindowClose;

    @ViewChild("addedToCartTemplate", { static: true })
    private addToCartTemplate: TemplateRef<any>;

    constructor(
        private dataService: DataService,
        private stateService: StateService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.wishListItems$ = this.stateService.select(
            state => state.wishListItems
        );
    }

    getSelectedVariants(variantId: any, variants: any) {
        return variants.find((v: any) => v.id === variantId);
    }

    removeFromWishlist(id: any) {
        this.dataService
            .mutate<AddToCart.Mutation, any>(REMOVE_FROM_WISHLIST, {
                productVariantId: id
            })
            .subscribe(() => {
                this.stateService.setState("wishlistVariantId", id);
            });
    }

    addToCart(variant: GetProductDetail.Variants, qty: number) {
        this.dataService
            .mutate<AddToCart.Mutation, AddToCart.Variables>(ADD_TO_CART, {
                variantId: variant.id,
                qty
            })
            .subscribe(({ addItemToOrder }) => {
                switch (addItemToOrder.__typename) {
                    case "Order":
                        this.removeFromWishlist(variant.id);
                        this.stateService.setState(
                            "activeOrderId",
                            addItemToOrder ? addItemToOrder.id : null
                        );
                        if (variant) {
                            this.notificationService
                                .notify({
                                    title: "Added to cart",
                                    type: "info",
                                    duration: 3000,
                                    templateRef: this.addToCartTemplate,
                                    templateContext: {
                                        variant,
                                        quantity: qty
                                    }
                                })
                                .subscribe();
                        }
                        break;
                    case "OrderModificationError":
                    case "OrderLimitError":
                    case "NegativeQuantityError":
                    case "InsufficientStockError":
                        this.notificationService
                            .error(addItemToOrder.message)
                            .subscribe();
                        break;
                }
            });
    }
}
