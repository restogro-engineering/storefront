import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { GetOrder } from "../../../common/generated-types";
import { notNullOrUndefined } from "../../../common/utils/not-null-or-undefined";
import { DataService } from "../../../core/providers/data/data.service";
import { GET_ORDER } from "./return-order.graphql";
import { MatDialog } from "@angular/material/dialog";
import { ReturnOrderModalComponent } from "../return-order-modal/return-order-modal.component";

@Component({
    selector: "vsf-return-order",
    templateUrl: "./return-order.component.html",
    styleUrls: ["./return-order.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnOrderComponent implements OnInit {
    order$: Observable<GetOrder.OrderByCode | undefined>;
    animal: string;
    name: string;
    constructor(
        private dataService: DataService,
        private route: ActivatedRoute,
        public dialog: MatDialog
    ) {}

    trackByFn(index: number, line: { id: string }) {
        return line.id;
    }

    trackByDiscount(index: number, discount: any) {
        return discount.adjustmentSource;
    }

    isDiscounted(line: any): boolean {
        return line.discountedLinePriceWithTax < line.linePriceWithTax;
    }

    openDialog(type: any, order: any): void {
        const dialogRef = this.dialog.open(ReturnOrderModalComponent, {
            width: "360px",
            data: { type: type, order: order }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
            this.animal = result;
        });
    }

    ngOnInit() {
        this.order$ = this.route.paramMap.pipe(
            map(pm => pm.get("code")),
            filter(notNullOrUndefined),
            switchMap(code => {
                return this.dataService.query<
                    GetOrder.Query,
                    GetOrder.Variables
                >(GET_ORDER, { code });
            }),
            map(data => data.orderByCode)
        );
    }
}
