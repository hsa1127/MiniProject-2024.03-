import { LightningElement, track, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductManager extends LightningElement {
    @track columns = [
        { label: '제품명', fieldName: 'Name', type: 'text' },
        { label: '제품 가격', fieldName: 'UnitPrice__c', type: 'currency' }
    ];
    @track products = [];
    @track filteredProducts = [];

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.filteredProducts = data;
        } else if (error) {
            console.error('Error:', error);
        }
    }

    handleSelect(event) {
        const selectedProductType = event.detail.name;
        this.filterProducts(selectedProductType);
    }

    filterProducts(selectedType) {
        this.filteredProducts = this.products.filter(
            product => product.ProductType__c === selectedType
        );
    }
}