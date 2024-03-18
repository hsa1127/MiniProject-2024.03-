import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductDataTable extends LightningElement {
    @track columns = [
        { label: '제품 타입', fieldName: 'ProductType__c', type: 'text' },
        { label: '제품명', fieldName: 'Name', type: 'text' },
        { label: '제품 가격', fieldName: 'UnitPrice__c', type: 'currency' }
    ];

    @track products;

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
        } else if (error) {
            console.error('Error retrieving products:', error);
        }
    }   
}