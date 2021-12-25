import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "vsf-account-about",
    templateUrl: "./account-about.component.html",
    styleUrls: ["./account-about.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountAboutComponent {}
