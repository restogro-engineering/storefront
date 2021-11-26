import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

export interface AppState {
    signedIn: boolean;
    activeOrderId: string | null;
    wishlistVariantId: string | null;
    lastCollectionSlug: string | null;
    mobileNavMenuIsOpen: boolean;
    cartDrawerOpen: boolean;
    wishListItems: any;
}

export const initialState: AppState = {
    signedIn: false,
    activeOrderId: null,
    wishlistVariantId: null,
    lastCollectionSlug: null,
    mobileNavMenuIsOpen: false,
    cartDrawerOpen: false,
    wishListItems: []
};

/**
 * A simple, observable store of global app state.
 */
@Injectable({
    providedIn: "root"
})
export class StateService {
    private state: AppState = initialState;
    private readonly stateSubject = new BehaviorSubject<AppState>(initialState);

    constructor() {
        if (typeof window !== "undefined") {
            Object.defineProperty(window, "appState", {
                get: () => this.stateSubject.value
            });
        }
    }

    setState<T extends keyof AppState>(key: T, value: AppState[T]) {
        this.state[key] = value;
        this.stateSubject.next(this.state);
    }

    select<R>(selector: (state: AppState) => R): Observable<R> {
        return this.stateSubject.pipe(
            map(selector),
            distinctUntilChanged()
        );
    }
}
