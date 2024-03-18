import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/SangDam__c.AccountName__c';
import SANG_DAM_DATE_FIELD from '@salesforce/schema/SangDam__c.SangDamDate__c';
import SANG_DAM_PROGRESS_FIELD from '@salesforce/schema/SangDam__c.SangDamProgress__c';
import SANG_DAM_DESCRIPTION_FIELD from '@salesforce/schema/SangDam__c.SangDamDescription__c';
import PRODUCT_LIST_FIELD from '@salesforce/schema/SangDam__c.ProductList__c';

export default class SangDamViewForm extends LightningElement {
    @api recordId;
    @api accountName;
    @api sangDamDate;
    @api sangDamProgress;
    @api sangDamDescription;
    @api productListString;


    // 레코드 데이터 가져오기
    @wire(getRecord, {
        recordId: '$recordId', 
        fields: [ACCOUNT_NAME_FIELD, SANG_DAM_DATE_FIELD, SANG_DAM_PROGRESS_FIELD, SANG_DAM_DESCRIPTION_FIELD, PRODUCT_LIST_FIELD]
    }) record;

    // 필드 값 추출
    get accountName() {
        return getFieldValue(this.record.data, ACCOUNT_NAME_FIELD);
    }

    get sangDamDate() {
        return getFieldValue(this.record.data, SANG_DAM_DATE_FIELD);
    }

    get sangDamProgress() {
        return getFieldValue(this.record.data, SANG_DAM_PROGRESS_FIELD);
    }

    get sangDamDescription() {
        return getFieldValue(this.record.data, SANG_DAM_DESCRIPTION_FIELD);
    }
  // 상담 제품목록 배열로 변환
    get productList() {
        const productListString = getFieldValue(this.record.data, PRODUCT_LIST_FIELD);
        return productListString ? productListString.split(';') : [];
    }
}