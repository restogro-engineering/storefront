import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { filter, map } from "rxjs/operators";

import {
    GetActiveCustomer,
    UpdateCustomerDetails,
    UpdateCustomerInput
} from "../../../common/generated-types";
import { GET_ACTIVE_CUSTOMER } from "../../../common/graphql/documents.graphql";
import { notNullOrUndefined } from "../../../common/utils/not-null-or-undefined";
import { DataService } from "../../../core/providers/data/data.service";

import { UPDATE_CUSTOMER_DETAILS } from "./account-customer-details.graphql";

@Component({
    selector: "vsf-account-customer-details",
    templateUrl: "./account-customer-details.component.html",
    styleUrls: ["./account-customer-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountCustomerDetailsComponent implements OnInit {
    form: FormGroup;
    constructor(
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    appendZero(number: any) {
        if (+number < 10) {
            return "0" + number;
        }
        return number;
    }

    formatDate(date: any) {
        if (date) {
            let dateObj = new Date(date);
            return `${dateObj.getFullYear()}-${this.appendZero(
                dateObj.getMonth() + 1
            )}-${this.appendZero(dateObj.getDate())}`;
        }
        return null;
    }

    ngOnInit() {
        this.dataService
            .query<GetActiveCustomer.Query>(
                GET_ACTIVE_CUSTOMER,
                {},
                "network-only"
            )
            .pipe(
                map(data => data.activeCustomer),
                filter(notNullOrUndefined)
            )
            .subscribe(customer => {                
                const {
                    firstName,
                    lastName,
                    phoneNumber,
                    customFields
                } = customer;
                const {
                    dateofbirth,
                    profession,
                    companyName,
                    gender,
                    companyWebsite
                } = customFields;

                this.form = this.formBuilder.group({
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    dateofbirth: this.formatDate(dateofbirth),
                    profession: profession,
                    companyName: companyName,
                    gender: gender,
                    companyWebsite: companyWebsite
                });
                this.changeDetectorRef.markForCheck();
            });
    }

    updateDetails() {
        const formValue = this.form.value;
        const input: UpdateCustomerInput = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            phoneNumber: formValue.phoneNumber,
            customFields: {
                dateofbirth: formValue.dateofbirth
                    ? new Date(formValue.dateofbirth).toISOString()
                    : null,
                profession: formValue.profession,
                companyName: formValue.companyName,
                gender: formValue.gender,
                companyWebsite: formValue.companyWebsite
            }
        };
        this.dataService
            .mutate<
                UpdateCustomerDetails.Mutation,
                UpdateCustomerDetails.Variables
            >(UPDATE_CUSTOMER_DETAILS, {
                input
            })
            .subscribe(() => {
                this.form.markAsPristine();
            });
    }
}
