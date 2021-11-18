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
                data.collections.items[0].children.forEach((type: any) => {
                    if (type.name === "Main posters") {    
                        type.children.forEach((element: any) => {
                            this.mainPosters.push({
                                image: element.featuredAsset.source,
                                thumbImage: element.featuredAsset.source,
                                title: "",
                                ...element
                            });
                        });
                    }

                    if (type.name === "top-brands") {
                        type.children.forEach((element: any) => {
                            this.topBrands.push({
                                image: element.featuredAsset.source,
                                thumbImage: element.featuredAsset.source,
                                title: element.name,
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
