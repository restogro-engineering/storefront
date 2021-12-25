import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "vsf-refund",
    templateUrl: "./refund.component.html",
    styleUrls: ["./refund.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefundComponent {}
