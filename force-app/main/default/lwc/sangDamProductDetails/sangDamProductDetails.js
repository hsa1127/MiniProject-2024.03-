import { LightningElement, api, wire } from 'lwc';
import getProductByName from '@salesforce/apex/ProductController.getProductByName';

export default class SangDamProductDetails extends LightningElement {
    @api productId;
    product;
    error;

    @wire(getProductByName, { productName: '$productName' })
    wiredProduct({ error, data }) {
        if (data) {
            this.product = data;
        } else if (error) {
            this.error = error;
        }
    }
}