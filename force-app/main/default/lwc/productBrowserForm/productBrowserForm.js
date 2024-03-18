import { LightningElement, api, wire, track } from 'lwc';
// Apex 컨트롤러의 메소드 임포트
import getProductTypes from '@salesforce/apex/ProductDataService.getProductTypes';
import getProductsByType from '@salesforce/apex/ProductDataService.getProductsByType';

export default class ProductBrowserForm extends LightningElement {

    // 선택된 제품 유형과 이름, 그리고 드롭다운 옵션 배열을 추적
    @track selectedType;
    @track selectedProduct;
    @track productTypes = [];
    @track productNames = [];

    // 제품 유형 데이터를 가져오는 wire 메소드
    @wire(getProductTypes)
    wiredProductTypes({error, data}) {
        if (data) {
            // 제품 유형 옵션 배열을 생성하고, "All" 옵션을 추가
            this.productTypes = [{ label: 'All', value: '' }].concat(data.map(type => ({ label: type, value: type })));
        } else if (error) {
            // 에러 처리 로직
        }
    }

    // 선택된 제품 유형에 따른 제품 데이터를 가져오는 wire 메소드
    @wire(getProductsByType, { productType: '$selectedType' })
    wiredProductsByType({error, data}) {
        if (data) {
            // 제품 이름 옵션 배열을 생성
            this.productNames = data.map(product => ({ label: product.Name, value: product.Id }));
        } else if (error) {
            // 에러 처리 로직
        }
    }

    // 제품 유형 드롭다운 변경 이벤트 핸들러
    handleTypeChange(event) {
        this.selectedType = event.detail.value;
        this.selectedProduct = null; // 타입 변경 시 선택된 제품 초기화
        // 선택된 제품 유형을 부모 컴포넌트에 알리는 filterchange 이벤트 발송
        this.dispatchEvent(new CustomEvent('filterchange', {
            detail: { productType: this.selectedType }
        }));
    }

    // 제품 이름 드롭다운 변경 이벤트 핸들러
    handleProductChange(event) {
        this.selectedProduct = event.detail.value;
        // 선택된 제품 ID를 부모 컴포넌트에 알리는 filterchange 이벤트 발송
        this.dispatchEvent(new CustomEvent('filterchange', {
            detail: { productId: this.selectedProduct }
        }));
    }

    // 외부에서 호출 가능한 메소드로, 제품 이름으로 제품을 검색
    @api
    searchProducts(productName) {
        // searchproducts 이벤트를 발송하여 외부에서 제품 검색 요청을 처리
        this.dispatchEvent(new CustomEvent('searchproducts', { detail: { productName } }));
    }
    
    // 검색 이벤트 핸들러
    handleSearch(event) {
        this.searchProducts(event.detail.productName);
    }
}