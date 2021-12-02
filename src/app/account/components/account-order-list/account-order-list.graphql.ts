import {gql} from 'apollo-angular';


export const GET_ORDER_LIST = gql`
    query GetOrderList($options: OrderListOptions) {
        activeCustomer {
            id
            orders(options: $options) {
                items {
                    id
                    updatedAt
                    createdAt
                    code
                    state
                    currencyCode
                    total
                    lines {
                        id
                        featuredAsset {
                          id
                          source
                          preview
                          name
                        }
                        unitPrice
                        discountedUnitPrice
                        discountedUnitPriceWithTax
                        unitPriceWithTax
                        quantity
                        linePrice
                        linePriceWithTax
                        discountedLinePriceWithTax
                        productVariant {
                            id
                            name
                          }
                      }
                }
                totalItems
            }
        }
    }
`;
