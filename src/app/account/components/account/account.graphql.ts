import {gql} from 'apollo-angular';


export const SIGN_OUT = gql`
    mutation SignOut {
        logout {
            success
        }
    }
`;


export const GET_ACCOUNT_OVERVIEW = gql`
    query GetAccountOverview {
        activeCustomer {
            id
            title
            firstName
            lastName
            emailAddress
        }
    }
`;
