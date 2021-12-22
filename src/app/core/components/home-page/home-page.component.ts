import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { gql } from "apollo-angular";
import { DataService } from "../../providers/data/data.service";

@Component({
    selector: "vsf-home-page",
    templateUrl: "./home-page.component.html",
    styleUrls: ["./home-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
    mainPosters: any = [];
    topBrands: any = [];
    readonly placeholderProducts = Array.from({ length: 12 }).map(() => null);
    constructor(private dataService: DataService) {}

    compare(a: any, b: any) {
        if (a.position < b.position) {
            return -1;
        }
        if (a.position > b.position) {
            return 1;
        }
        return 0;
    }

    ngOnInit() {
        this.dataService
            .query(HOME_PAGE_DATA, {
                options: {
                    filter: {
                        name: {
                            contains: "offer"
                        }
                    }
                }
            })
            .subscribe(data => {
                data.collections.items.length > 0 &&
                    data.collections.items[0].children.forEach((type: any) => {
                        if (type.slug === "main-posters") {
                            let mainPostersList: any = JSON.parse(
                                JSON.stringify(type.children)
                            );
                            mainPostersList.sort(this.compare);
                            mainPostersList.forEach((element: any) => {
                                this.mainPosters.push({
                                    image: element.featuredAsset.source,
                                    thumbImage: element.featuredAsset.source,
                                    title: "",
                                    ...element
                                });
                            });
                        }

                        if (type.slug === "top-brands") {
                            let topBrandsList: any = JSON.parse(
                                JSON.stringify(type.children)
                            );
                            topBrandsList.sort(this.compare);
                            topBrandsList.forEach((element: any) => {
                                this.topBrands.push({
                                    image: element.featuredAsset.source,
                                    thumbImage: element.featuredAsset.source,
                                    title: "",
                                    ...element
                                });
                            });
                        }
                    });
            });
    }
}

const HOME_PAGE_DATA = gql`
    query GetCollectionList($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                children {
                    id
                    name
                    slug
                    children {
                        id
                        name
                        slug
                        position
                        featuredAsset {
                            id
                            name
                            source
                            preview
                        }
                    }
                }
            }
        }
    }
`;
