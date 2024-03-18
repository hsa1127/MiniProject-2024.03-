import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts'; // Apex 메소드를 구현해야 합니다.
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_TYPE_CHANNEL from '@salesforce/messageChannel/ProductTypeChannel__c';

export default class ProductList extends LightningElement {
    @track columns = [
        { label: '제품명', fieldName: 'Name', type: 'text' },
        { label: '제품 가격', fieldName: 'UnitPrice__c', type: 'currency' }
    ];

    @track filteredProducts = [];


    @wire(MessageContext) messageContext;
    subscription = null;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, PRODUCT_TYPE_CHANNEL, (message) => {
            this.handleProductTypeSelection(message.payload); // 수정된 부분
        });
        console.log('Subscribing to message channel');
    }

    @wire(getProducts)
wiredProducts({ error, data }) {
    if (data) {
        this.products = data;
        this.filteredProducts = data; // 초기에는 모든 제품을 표시합니다.
    } else if (error) {
        console.error('Error retrieving products:', error);
    }
}

    handleProductTypeSelection(payload) {
        console.log('Received message:', payload);

        const productType = payload.productType;
        this.filteredProducts = this.products.filter(
            product => product.ProductType__c === productType
        );
    }
    
}