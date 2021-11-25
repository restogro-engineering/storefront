import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowRefService } from '../../../shared/window-ref.service';
import { Observable } from 'rxjs';

import { AddPayment, GetEligiblePaymentMethods } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { ADD_PAYMENT, GET_ELIGIBLE_PAYMENT_METHODS } from './checkout-payment.graphql';
import { map } from 'rxjs/operators';

@Component({
    selector: 'vsf-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    styleUrls: ['./checkout-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent implements OnInit {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    paymentMethods$: Observable<GetEligiblePaymentMethods.EligiblePaymentMethods[]>
    paymentErrorMessage: string | undefined;

    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router,
                private winRef: WindowRefService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.paymentMethods$ = this.dataService.query<GetEligiblePaymentMethods.Query>(GET_ELIGIBLE_PAYMENT_METHODS)
            .pipe(map(res => res.eligiblePaymentMethods));
    }

    getMonths(): number[] {
        return Array.from({ length: 12 }).map((_, i) => i + 1);
    }

    getYears(): number[] {
        const year = new Date().getFullYear();
        return Array.from({ length: 10 }).map((_, i) => year + i);
    }

    completeOrder(paymentMethodCode: string) {
        this.dataService.mutate<AddPayment.Mutation, AddPayment.Variables>(ADD_PAYMENT, {
            input: {
                method: paymentMethodCode,
                metadata: {},
            },
        })
            .subscribe(async ({ addPaymentToOrder }) => {
                switch (addPaymentToOrder?.__typename) {
                    case 'Order':
                        const order:any = addPaymentToOrder;
                        debugger
                        this.payWithRazor(order.payments && order.payments[0].transactionId,order);                       
                        break;
                    case 'OrderPaymentStateError':
                    case 'PaymentDeclinedError':
                    case 'PaymentFailedError':
                    case 'OrderStateTransitionError':
                        this.paymentErrorMessage = addPaymentToOrder?.message;
                        break;
                }

            });
    }

    payWithRazor(val:any,order:any) {
        debugger;
        const options: any = {
          key: 'rzp_test_V8va0hWULN0uxp',
          amount: 125500, // amount should be in paise format to display Rs 1255 without decimal point
          currency: 'INR',
          name: 'Hegmadental', // company name or product name
          description: '',  // product description
          image: './assets/logo.png', // company logo or product image
          order_id: val, // order_id created by you in backend
          modal: {
            // We should prevent closing of the form when esc key is pressed.
            escape: false,
          },
          notes: {
            // include notes if any
          },
          theme: {
            color: '#0c238a'
          }
        };
        options.handler = ((response:any, error:any) => {
          options.response = response;
          console.log(response);
          console.log(options);
          // call your backend api to verify payment signature & capture transaction

           if (order && (order.state === 'PaymentSettled' || order.state === 'PaymentAuthorized')) {
            this.stateService.setState('activeOrderId', null);
                this.router.navigate(['../confirmation', order.code], { relativeTo: this.route });
            }
        });
        options.modal.ondismiss = (() => {
          // handle the case when user closes the form while transaction is in progress
          console.log('Transaction cancelled.');
        });
        const rzp = new this.winRef.nativeWindow.Razorpay(options);
        rzp.open();
      }

}
