import { api, LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { refreshApex } from '@salesforce/apex';

import getProducts from '@salesforce/apex/ProductDataService.getProducts';
import PRODUCTMC from '@salesforce/messageChannel/ProductMessageChannel__c';


export default class ProductSearchResults extends LightningElement {

    
    @track
    products;
    isLoading = false;
    productTypeId;

    // wired message context
    @wire(MessageContext)
    messageContext;

    // wired getProducts method
    @wire(getProducts, {productTypeId: '$productTypeId'})
    wiredProducts({data, error}) {
        if (data) {
            this.products = data;
        } else if (error) {
            console.log('data.error')
            console.log(error)
        }
    }

    // public function that updates the existing productTypeId property
    // uses notifyLoading
    @api
    searchProducts(productTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.productTypeId = productTypeId;
    }

        // this public function must refresh the boats asynchronously
    // uses notifyLoading
    @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);      
        await refreshApex(this.products);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(productId) { 
        // explicitly pass boatId to the parameter recordId
        publish(this.messageContext, PRODUCTMC, { recordId: productId });
    }

    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }        
    }
}