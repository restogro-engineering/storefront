import { Component } from "@angular/core";
import { gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { DataService } from "../../providers/data/data.service";
import { Router } from "@angular/router";

@Component({
    selector: "vsf-categories-images",
    templateUrl: "./categories-images.component.html",
    styleUrls: ["./categories-images.component.scss"]
})
export class CategoriesImagesComponent {
    collections$: Observable<any[]>;
    imageObject: any = [];
    readonly placeholderProducts = Array.from({ length: 12 }).map(() => null);
    constructor(private dataService: DataService, public router: Router) {}

    ngOnInit() {
        this.collections$ = this.dataService
            .query(GET_COLLECTIONS, {
                options: {}
            })
            .pipe(
                map(data => {                    
                    return data.collections.items.filter((collection: any) => {
                        if (                            
                            collection.assets &&
                            collection.assets.length > 0 &&
                            collection?.parent?.slug !== "landing-page" &&
                            collection?.parent?.parent?.slug !== "landing-page"
                        ) {
                            this.imageObject.push({
                                image: collection.assets[0].preview,
                                thumbImage: collection.assets[0].source,
                                title: collection.name,
                                slug: collection.slug
                            });
                        }
                    });
                })
            );
    }

    imageClick(data: any) {
        this.router.navigate(["/category", this.imageObject[data].slug]);
    }
}

const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                assets {
                    id
                    name
                    type
                    source
                    preview
                }
                slug
                parent {
                    id
                    slug
                    name
                    parent {
                        slug
                    }
                }
                featuredAsset {
                    id
                    preview
                }
            }
        }
    }
`;
