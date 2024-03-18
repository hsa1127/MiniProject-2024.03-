import { LightningElement, api, wire  } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getProductTypes from '@salesforce/apex/ProductDataService.getProductTypes';
import searchProducts from '@salesforce/apex/ProductDataService.searchProducts';

export default class ProductSearchForm extends LightningElement {
        
    selectedProductTypeId = '';

    @api
    productName = '';

    @wire(searchProducts, { productName: '$productName' }) products;

    @api
    handleProductSearch(event) {
        const searchEvent = new CustomEvent('search', {
            detail: { keyword: event.target.value }
        });
        this.dispatchEvent(searchEvent);
    }
    }


    
    // Wire a custom Apex method
    // @wire(getProductTypes)
    // productTypes({ data, error }) {
    //     if (data) {
    //         this.searchOptions = data.map(type => {
    //             return { label: type.ProductType__c, value: type.ProductType__c };
    //         });
    //         this.searchOptions.unshift({ label: 'All Types', value: '' });
    //     } else if (error) {
    //         this.searchOptions = undefined;
    //         this.error = error;
    //     }
    // }
    

    // Fires event that the search option has changed.
    // passes productTypeId (value of this.selectedProductTypeId) in the detail
    // handleSearchOptionChange(event) {
    //     this.selectedProductTypeId = event.detail.value
        // Create the const searchEvent        
    //     const searchEvent = new CustomEvent('search', { 
    //         detail: {
    //             productTypeId: this.selectedProductTypeId
    //         }
    //     });
    //     this.dispatchEvent(searchEvent);
    // }