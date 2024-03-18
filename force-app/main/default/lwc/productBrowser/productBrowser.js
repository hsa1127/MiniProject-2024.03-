import { LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_PRODUCT_CHANNEL from '@salesforce/messageChannel/SelectedProductChannel__c';
import getProducts from '@salesforce/apex/ProductBrowser.getProducts';
import searchProducts from '@salesforce/apex/ProductDataService.searchProducts';

// ProductBrowser 컴포넌트 기본 클래스 선언
export default class ProductBrowser extends LightningElement {
    @track products = []; // 제품 목록을 추적할 배열
    @track productOptions = []; // 선택된 제품 정보를 저장할 배열

    @wire(MessageContext) 
    messageContext; // 메시지 컨텍스트를 wire하여 LMS와 통신

    // 컴포넌트 초기화 시 모든 제품 로드
    connectedCallback() {
        this.loadAllProducts();
    }

    // 모든 제품 데이터를 불러오는 함수
    loadAllProducts() {
        getProducts()
            .then(result => {
                this.products = result;
            })
            .catch(error => {
                console.error('Error fetching all products:', error);
            });
    }

    // 제품 검색 이벤트 처리 함수 (사용자가 콤보박스에서 선택을 변경할 때)
    handleSearchProducts(event) {
        const selectedProductId = event.detail.productId;
        if (selectedProductId) {
            this.fetchProduct(selectedProductId);
        } else {
            this.loadAllProducts();
        }
    }

    // 특정 제품 데이터를 불러오는 함수
    fetchProduct(productId) {
        searchProducts({ productId })
            .then(result => {
                this.products = result; // 제품 데이터 저장
                this.updateProductOptions(result); // 선택된 제품 정보를 productOptions 배열에 업데이트
            })
            .catch(error => {
                console.error('Error fetching selected product:', error); // 에러 로깅
            });
    }

    // 제품 선택 이벤트 핸들러
    handleProductSelected(event){
        const productId = event.detail.productId;
        this.updateSelectedProduct(productId); // 선택된 제품 ID 업데이트
    }

    // 선택된 제품 ID를 메시지 서비스를 통해 공유하는 함수
    updateSelectedProduct(productId){
        publish(this.messageContext, SELECTED_PRODUCT_CHANNEL, {
            ProductId: productId
        });
    }

    // 선택된 제품 정보를 productOptions 배열에 업데이트하는 메소드
    updateProductOptions(selectedProductInfo) {
        this.productOptions = selectedProductInfo.map(product => ({
            label: product.Name, // 제품 이름을 label로 사용
            value: product.Id // 제품 ID를 value로 사용
        }));
    }
        
}