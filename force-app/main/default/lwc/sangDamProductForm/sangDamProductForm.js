import { LightningElement, wire, track } from 'lwc';
import getProductTypes from '@salesforce/apex/ProductController.getProductTypes';
import getProducts from '@salesforce/apex/ProductController.getProducts';
//showToast를 활용해서 환영인사
import USER_ID from '@salesforce/user/Id';
import getUserNameById from '@salesforce/apex/UserInfoController.getUserNameById';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SangDamProductForm extends LightningElement {
    @track columns = [
        { label: '제품명', fieldName: 'Name', type: 'text' },
        { label: '제품 가격', fieldName: 'UnitPrice__c', type: 'currency' }
    ];

    @track products;
    @track filteredProducts;
    @track productTypes;

    @track selectedProductType; // 선택된 제품 유형을 추적합니다

    @wire(getProductTypes)
    wiredProductTypes({ error, data }) {
        if (data) {
            this.productTypes = data;
        } else if (error) {
            this.showToastError('제품 유형을 불러오는 중 오류가 발생했습니다.');
        }
    }

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.filterProducts(); // 제품 목록 초기화 후 필터링 실행
        } else if (error) {
            this.showToastError('제품 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 제품 유형 선택 시 필터링하는 메서드
    handleSelect(event) {
        // 'name' 속성이 이벤트에서 반환하는 실제 프로퍼티인지 확인합니다.
        const selectedProductType = event.detail.name;
        // 콘솔에 로깅하여 선택된 제품 유형이 올바른지 확인합니다.
        console.log('Selected Product Type:', selectedProductType);
    
        // filteredProducts를 올바른 제품 유형으로 필터링합니다.
        this.filteredProducts = this.products.filter(
            product => product.ProductType__c === selectedProductType
        );
    }
    
    // 선택된 제품 유형에 따라 제품을 필터링하는 메서드
    filterProducts() {
        if (this.products) {
            this.filteredProducts = this.selectedProductType
                ? this.products.filter(product => product.ProductType__c === this.selectedProductType)
                : this.products;
        }
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length > 0) {
            this.selectedProductName = selectedRows[0].Name;
            console.log('Selected Product Name:', this.selectedProductName); // 디버깅
        }
    }

    //showTaost를 활용해서 환영인사
    userId = USER_ID;

    @wire(getUserNameById, { userId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            this.showToast(data);
        } else if (error) {
            console.error('Error fetching user info:', error);
            this.showToastError();
        }
    }

    showToast(userName) {
        const evt = new ShowToastEvent({
            title: "환영합니다",
            message: `${userName}님, 안녕하세요!`,
            variant: "success",
            duration: 2000 // 2초 동안 표시
        });
        this.dispatchEvent(evt);
    }
    
    showToastError() {
        const evt = new ShowToastEvent({
            title: "오류",
            message: "사용자 정보를 가져오는 데 문제가 발생했습니다.",
            variant: "error",
            duration: 2000 // 2초 동안 표시
        });
        this.dispatchEvent(evt);
    }
}