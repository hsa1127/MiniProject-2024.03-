import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCT_TYPE_CHANNEL from '@salesforce/messageChannel/ProductTypeChannel__c';

export default class ProductTypeSelector extends LightningElement {
    @wire(MessageContext) messageContext;

    handleSelect(event) {
        const selectedLabel = event.detail.name; // "노트북" 또는 "악세사리"
        let productTypeValue;
        
        // 픽리스트 레이블에 따라 API 값 매핑
        switch (selectedLabel) {
            case "노트북":
                productTypeValue = "Laptop";
                break;
            case "주변기기":
                productTypeValue = "Accessory";
                break;
            // 여기에 다른 매핑을 추가할 수 있습니다.
            default:
                productTypeValue = selectedLabel; // 기본적으로 레이블을 그대로 사용
        }
    
        const payload = { productType: productTypeValue };
        console.log('Publishing message with payload:', payload);
        publish(this.messageContext, PRODUCT_TYPE_CHANNEL, payload);
    }
}