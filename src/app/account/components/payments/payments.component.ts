import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "vsf-payments",
    templateUrl: "./payments.component.html",
    styleUrls: ["./payments.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {}
