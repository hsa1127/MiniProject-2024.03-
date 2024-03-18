// ProductTiles.js
// 필요한 모듈 임포트
import { api, LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import getProducts from '@salesforce/apex/ProductDataService.getProducts';

import PRODUCTMC from '@salesforce/messageChannel/ProductMessageChannel__c';

export default class ProductTiles extends LightningElement {

     // 공개 속성으로 제품 목록과 선택된 제품 ID 선언
    @api 
    productList = [];
    @api 
    selectedProductId = '';

    // 내부 상태인 productTypeId 초기화
    productTypeId = '';

    // 메시지 서비스의 컨텍스트를 wire
    @wire(MessageContext)
    messageContext;

    // getProducts 메소드를 wire하여 제품 데이터 로드
    @wire(getProducts, {productTypeId: '$productTypeId'})
    wiredProducts({data, error}) {
        if (data) {
            this.productList = data; // 데이터 로드 성공 시 productList 업데이트
        } else if (error) {
            console.error("Error loading products:", error); // 에러 발생 시 콘솔에 로깅
        }
    }

    // 선택된 타일을 업데이트하고 메시지 서비스를 통해 이벤트 전송
    updateSelectedTile(event) {
        this.selectedProductId = event.detail.productId; // 이벤트에서 productId 추출
        this.sendMessageService(this.selectedProductId) // sendMessageService 호출
    }

    // 메시지 채널을 통해 선택된 제품 ID 전송
    sendMessageService(productId) { 
        publish(this.messageContext, PRODUCTMC, { recordId: productId });
    }

    // 로딩 상태에 따라 'loading' 또는 'doneloading' 이벤트 발송
    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }        
    }

    // 제품이 선택되었을 때 이벤트 핸들러
    handleProductSelected(event){
        this.selectedProductId=event.detail.productId;
        }
}