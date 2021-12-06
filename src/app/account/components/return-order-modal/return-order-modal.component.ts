import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../../../core/providers/data/data.service";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { RETURN_ORDER } from "./return-order-modal.graphql";

@Component({
    selector: "vsf-return-order-modal",
    templateUrl: "./return-order-modal.component.html",
    styleUrls: ["./return-order-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnOrderModalComponent {
    retrunReasons = [
        "wrong/ incorrect items",
        "damaged/ broken items",
        "Incorrect quantity",
        "Item quality not good",
        "Other"
    ];
    reasonOption: string = "";
    otherReason: string = "";
    constructor(
        public dialogRef: MatDialogRef<ReturnOrderModalComponent>,
        private dataService: DataService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onReturn() {
        const { order, selectedLines } = this.data;
        const lines: any = [];
        order.lines.forEach((line: any) => {
            if (selectedLines.indexOf(line.id) !== -1) {
                lines.push({
                    orderLineId: line.id,
                    quantity: line.quantity
                });
            }
        });
        this.dataService
            .mutate<any, any>(RETURN_ORDER, {
                input: {
                    orderId: order.id,
                    lines: lines,
                    reason:
                        this.reasonOption === "Other"
                            ? this.otherReason
                            : this.reasonOption
                }
            })
            .subscribe(({ returnOrder }) => {
                switch (returnOrder.__typename) {
                    case "CurrentUser":
                        this.onNoClick();
                        this.router.navigate(["./account", "orders"]);
                        break;
                    case "OrderStateTransitionError":
                        break;
                }
                this.onNoClick();
                this.router.navigate(["./account", "orders"]);
            });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
