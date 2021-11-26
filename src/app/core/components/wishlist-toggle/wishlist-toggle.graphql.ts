import { gql } from "apollo-angular";

export const GET_WISHLIST_DETAIL = gql`
    query Query {
        getWishList {
            items {
                id
                productId
                product {
                    id
                    name
                    description
                    slug
                    featuredAsset {
                        id
                        source
                        preview
                        name
                    }
                    variants {
                        id
                        name
                        price
                        priceWithTax
                        options {
                            code
                            name
                        }
                    }
                }
            }
        }
    }
`;

export const ADD_TO_WISHLIST = gql`
    mutation AddToWishList($productVariantId: ID!) {
        addToWishList(productVariantId: $productVariantId) {
            description
            code
        }
    }
`;

export const REMOVE_FROM_WISHLIST = gql`
    mutation RemoveFromWishList($productVariantId: ID!) {
        removeFromWishList(productVariantId: $productVariantId) {
            description
            code
        }
    }
`;
