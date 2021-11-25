import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input
} from "@angular/core";
import { Router } from "@angular/router";

import { SignIn } from "../../../common/generated-types";
import { DataService } from "../../../core/providers/data/data.service";
import { StateService } from "../../../core/providers/state/state.service";

import { SIGN_IN, GET_OTP, AUTHENTICATE } from "./sign-in.graphql";

@Component({
    selector: "vsf-sign-in",
    templateUrl: "./sign-in.component.html",
    styleUrls: ["./sign-in.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
    @Input() navigateToOnSuccess: any[] | undefined;
    @Input() displayRegisterLink = true;

    nativeAuth: boolean = true;
    emailAddress: string;
    mobileNumber: string;
    password: string;
    otp: string;
    rememberMe = false;
    invalidCredentials = false;
    sentOTP = false;

    constructor(
        private dataService: DataService,
        private stateService: StateService,
        private router: Router,
        private changeDetector: ChangeDetectorRef
    ) {}

    signIn() {
        let payload = {};
        if (this.sentOTP) {
            payload = {
                sms: {
                    phoneNumber: "+91 " + this.mobileNumber,
                    otp: this.otp
                }
            };
        } else {
            payload = {
                native: {
                    username: this.emailAddress,
                    password: this.password
                }
            };
        }

        this.dataService
            .mutate<any, any>(AUTHENTICATE, {
                input: payload
            })
            .subscribe({
                next: ({ authenticate }) => {
                    switch (authenticate.__typename) {
                        case "CurrentUser":
                            this.stateService.setState("signedIn", true);
                            const commands = this.navigateToOnSuccess || ["/"];
                            this.router.navigate(commands);
                            break;
                        case "NativeAuthStrategyError":
                        case "InvalidCredentialsError":
                            this.displayCredentialsError();
                            break;
                    }
                }
            });
    }

    reSendOTP() {
        this.getOTP();
    }

    validateMobile() {
        if (!this.mobileNumber) {
            return true;
        } else if (
            this.mobileNumber &&
            this.mobileNumber.toString().length !== 10
        ) {
            return true;
        }

        return false;
    }

    getOTP() {
        if (this.sentOTP) {
            this.signIn();
            return;
        }
        this.sentOTP = !this.sentOTP;
        this.dataService
            .mutate<any, any>(GET_OTP, {
                strategy: "sms",
                phoneNumber: "+91 " + this.mobileNumber
            })
            .subscribe(({ sendOTP }) => {
                debugger;
                if (sendOTP.success) {
                    this.sentOTP = !this.sentOTP;
                }

                // switch (sendOTP.__typename) {
                //     case "AuthAttemptResponse":

                //         break;
                //     case "NativeAuthStrategyError":
                //     case "InvalidCredentialsError":
                //         this.displayCredentialsError();
                //         break;
                // }
            });
    }
    toggleAuth() {
        this.nativeAuth = !this.nativeAuth;
        this.sentOTP = false;
    }
    private displayCredentialsError() {
        this.invalidCredentials = false;
        this.changeDetector.markForCheck();
        setTimeout(() => {
            this.invalidCredentials = true;
            this.changeDetector.markForCheck();
        }, 50);
    }
}
