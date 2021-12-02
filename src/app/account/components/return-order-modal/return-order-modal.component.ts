import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../../core/providers/data/data.service";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from "@angular/material/dialog";

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
    constructor(
        public dialogRef: MatDialogRef<ReturnOrderModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
