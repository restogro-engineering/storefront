import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { GetOrderList, SortOrder } from "../../../common/generated-types";
import { DataService } from "../../../core/providers/data/data.service";

import { GET_ORDER_LIST } from "./account-order-list.graphql";
import { StarRatingComponent } from "ng-starrating";

@Component({
    selector: "vsf-account-order-list",
    templateUrl: "./account-order-list.component.html",
    styleUrls: ["./account-order-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOrderListComponent implements OnInit {
    orders$: Observable<GetOrderList.Items[] | undefined>;
    filterOptions = ["All", "Upcoming", "Delivered", "Cancelled", "Returned"];
    selectedOrderStatus = "All";
    constructor(private dataService: DataService) {}

    trackByFn(index: number, line: { id: string }) {
        return line.id;
    }

    trackByDiscount(index: number, discount: any) {
        return discount.adjustmentSource;
    }

    isDiscounted(line: any): boolean {
        return line.discountedLinePriceWithTax < line.linePriceWithTax;
    }

    onRate($event: {
        oldValue: number;
        newValue: number;
        starRating: StarRatingComponent;
    }) {
        alert(`Old Value:${$event.oldValue}, 
          New Value: ${$event.newValue}, 
          Checked Color: ${$event.starRating.checkedcolor}, 
          Unchecked Color: ${$event.starRating.uncheckedcolor}`);
    }

    ngOnInit() {
        this.onFilterChange("All");
    }

    getRetunLastDate(date: string) {
        let dateObj = new Date(date);
        return dateObj.setDate(dateObj.getDate() + 15);
    }

    isRetunDisabled(date: string) {
        let dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() + 15) > Date.now();
    }

    onFilterChange(filterValue: any) {
        let filter: any = {
            active: {
                eq: false
            }
        };

        switch (filterValue) {
            case "Upcoming":
                filter.state = {
                    eq: "Shipped"
                };
                break;
            case "Completed":
                filter.state = {
                    eq: "Completed"
                };
                break;
            case "Cancelled":
                filter.state = {
                    eq: "Cancelled"
                };
                break;
            case "Returned":
                filter.state = {
                    eq: "returned"
                };
            default:
                break;
        }
        this.selectedOrderStatus = filterValue;

        this.orders$ = this.dataService
            .query<GetOrderList.Query, GetOrderList.Variables>(GET_ORDER_LIST, {
                options: {
                    filter: filter,
                    sort: {
                        createdAt: SortOrder.DESC
                    }
                }
            })
            .pipe(
                map(
                    data =>
                        data.activeCustomer && data.activeCustomer.orders.items
                )
            );
    }
}
