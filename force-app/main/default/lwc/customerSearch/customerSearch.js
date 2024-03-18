// customerSearch.js
import { LightningElement, track, wire } from 'lwc';
import searchCustomers from '@salesforce/apex/CustomerController.searchCustomers';
import getCustomerDetails from '@salesforce/apex/CustomerController.getCustomerDetails';

export default class CustomerSearch extends LightningElement {
    @track customers;
    @track selectedCustomer;

    handlePhoneChange(event) {
        const partialPhoneNumber = event.target.value;
        if (partialPhoneNumber) {
            searchCustomers({ partialPhoneNumber: partialPhoneNumber })
                .then(result => {
                    this.customers = result;
                })
                .catch(error => {
                    console.error('Error retrieving customers:', error);
                });
        }
    }

    handleCustomerClick(event) {
        const selectedCustomerId = event.currentTarget.dataset.customerId;
        getCustomerDetails({ accountId: selectedCustomerId })
            .then(result => {
                this.selectedCustomer = result;
            })
            .catch(error => {
                console.error('Error retrieving customer details:', error);
            });
    }
}