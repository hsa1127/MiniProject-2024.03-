import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_SELECTOR_CHANNEL from '@salesforce/messageChannel/ProductSelectors__c';

export default class sangDamProductList extends LightningElement {
    columns = [
        { label: '제품명', fieldName: 'Name', type: 'text' },
        { label: '제품 가격', fieldName: 'UnitPrice__c', type: 'currency' }
    ];

    @track products;
    @track filteredProducts;

    @wire(MessageContext) messageContext;
    subscription = null;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext, 
            PRODUCT_SELECTOR_CHANNEL, 
            (message) => this.handleProductTypeSelection(message.productType)
        );
    }
    
    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.filterProducts(); // 초기 필터링 또는 전체 목록 표시 로직
        } else if (error) {
            console.error('Error fetching products:', error);
        }
    }  
    
    filterProducts() {
        // 선택된 productType에 따라 제품을 필터링하는 로직
        // 예: this.selectedProductType가 '노트북' 또는 '주변기기'
        this.filteredProducts = this.products.filter(
            product => product.ProductType__c === this.selectedProductType
        );
    }
    
    handleProductTypeSelection(productType) {
        console.log('Selected product type:', productType);
        if (!this.products) {
            return;
        }
        this.filteredProducts = this.products.filter(
            product => product.ProductType__c === productType
        );
        console.log('Filtered products:', this.filteredProducts);
    }
}