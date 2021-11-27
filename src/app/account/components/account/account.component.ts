import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { notNullOrUndefined } from '../../../common/utils/not-null-or-undefined';
import { SignOut, GetAccountOverview } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { SIGN_OUT, GET_ACCOUNT_OVERVIEW } from './account.graphql';

@Component({
    selector: 'vsf-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

    activeCustomer$: Observable<GetAccountOverview.ActiveCustomer>;
    isSignedIn$: Observable<boolean>;

    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router) {
        this.isSignedIn$ = this.stateService.select(state => state.signedIn);
    }

    ngOnInit() {
        this.activeCustomer$ = this.dataService.query<GetAccountOverview.Query>(GET_ACCOUNT_OVERVIEW).pipe(
            map(data => data.activeCustomer),
            filter(notNullOrUndefined),
        );
    }

    signOut() {
        this.dataService.mutate<SignOut.Mutation>(SIGN_OUT).subscribe({
            next: () => {
                this.stateService.setState('signedIn', false);
                this.router.navigate(['/']);
            },
        });
    }
}
