import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { GetOrder } from "../../../common/generated-types";
import { notNullOrUndefined } from "../../../common/utils/not-null-or-undefined";
import { DataService } from "../../../core/providers/data/data.service";
import { GET_ORDER } from "./track-order-detail.graphql";

@Component({
    selector: "vsf-track-order-detail",
    templateUrl: "./track-order-detail.component.html",
    styleUrls: ["./track-order-detail.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackOrderDetailComponent implements OnInit {
    order$: Observable<GetOrder.OrderByCode | undefined>;
    constructor(
        private dataService: DataService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.order$ = this.route.paramMap.pipe(
            map(pm => pm.get("code")),
            filter(notNullOrUndefined),
            switchMap(code => {
                return this.dataService.query<
                    GetOrder.Query,
                    GetOrder.Variables
                >(GET_ORDER, { code });
            }),
            map(data => data.orderByCode)
        );
    }
}
