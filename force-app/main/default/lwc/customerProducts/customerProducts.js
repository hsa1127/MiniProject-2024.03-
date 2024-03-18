// CustomerProducts.js
import { LightningElement, api, wire, track } from 'lwc';
// Apex 클래스에서 제공하는 메소드를 가져옴
import getCustomerProducts from '@salesforce/apex/CustomerProductsController.getCustomerProducts';
// 레코드 페이지 네비게이션을 위한 믹스인
import { NavigationMixin } from 'lightning/navigation';
// 레코드 업데이트 API 임포트
import { updateRecord } from 'lightning/uiRecordApi';
// 토스트 메시지 이벤트 임포트
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class CustomerProducts extends NavigationMixin(LightningElement) {
    
    @api recordId; // 고객(Account)의 현재 레코드 ID

    // wire를 사용하여 getCustomerProducts 메소드와 연결
    @wire(getCustomerProducts, { accountId: '$recordId' })
    products;

    // 데이터 테이블에 표시될 컬럼 정의
    @track columns = [
        // 각 컬럼의 라벨, 필드 이름, 타입, 추가 속성 설정
        { label: '주문 번호', fieldName: 'orderNumberName', type: 'text', cellAttributes: { alignment: 'center' }, initialWidth: 100 },
        { label: '제품 이름', fieldName: 'productName', type: 'text', initialWidth: 250 },
        { label: '가격', fieldName: 'unitPrice', type: 'currency', typeAttributes: { currencyCode: 'KRW'}, cellAttributes: { alignment: 'left' }, initialWidth: 130 },
        { label: '시리얼코드', fieldName: 'productSerialCode', type: 'text', cellAttributes: { alignment: 'left' } },
        // 행의 액션(상세보기) 설정
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'View Details', name: 'view_details' }
                ]
            }
        }
    ];


    // 데이터 테이블 행에서 액션이 발생할 때 호출되는 함수
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        // 액션의 종류에 따라 다른 처리 수행
        switch (actionName) {
            case 'view_details':
                // 네비게이션 믹스인을 사용하여 해당 레코드의 상세 페이지로 이동
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.id, // OrderProduct__c 객체의 실제 ID를 사용(선택된 행의 레코드 ID를 사용)
                        actionName: 'view'
                    }
                });
                break;
            // 추가적인 액션을 여기에 정의할 수 있음
        }
    }

}