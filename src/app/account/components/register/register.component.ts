import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from "@angular/core";

import { Register } from "../../../common/generated-types";
import { DataService } from "../../../core/providers/data/data.service";

import { REGISTER } from "./register.graphql";

@Component({
    selector: "vsf-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
    firstName: string;
    lastName: string;
    emailAddress: string;
    dateofbirth: string;
    profession: string;
    phoneNumber: string;
    companyName: string;
    gender: string;
    companyWebsite: string;
    alternatePhoneNumber: string;
    registrationSent = false;

    constructor(
        private dataService: DataService,
        private changeDetector: ChangeDetectorRef
    ) {}

    register() {        
        this.dataService
            .mutate<Register.Mutation, Register.Variables>(REGISTER, {
                input: {
                    emailAddress: this.emailAddress,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    customFields: {
                        dateofbirth: this.dateofbirth
                            ? new Date(this.dateofbirth).toISOString()
                            : null,
                        profession: this.profession,
                        companyName: this.companyName,
                        gender: this.gender,
                        companyWebsite: this.companyWebsite,
                        alternatePhoneNumber: this.alternatePhoneNumber
                    }
                }
            })
            .subscribe(() => {
                this.registrationSent = true;
                this.changeDetector.markForCheck();
            });
    }
}
