import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// 제품 오브젝트 API 이름과 필드 API 이름을 상수로 정의
const PRODUCT_OBJECT = 'Product__c';
const IMAGE_URL_FIELD = 'Product__c.Image_Url__c';

export default class ProductImageViewer extends LightningElement {
    @api recordId; // Record Page에서 자동으로 제공받는 제품 레코드의 ID

    // 필드 값을 가져오기 위한 @wire 어댑터 사용
    @wire(getRecord, { recordId: '$recordId', fields: [IMAGE_URL_FIELD] })
    product;

    // 이미지 URL을 가져오기 위한 getter 정의
    get imageUrl() {
        return getFieldValue(this.product.data, IMAGE_URL_FIELD);
    }

    
}