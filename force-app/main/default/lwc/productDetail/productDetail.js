import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import SELECTED_PRODUCT_CHANNEL from '@salesforce/messageChannel/SelectedProductChannel__c';
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";
import labelDetails from '@salesforce/label/c.Details';
import labelPleaseSelectAItem from '@salesforce/label/c.Please_select_a_item';
import FIELD_Family from '@salesforce/schema/Product__c.ProductType__c';
import FIELD_Name from '@salesforce/schema/Product__c.Name';
import FIELD_ProductCode from '@salesforce/schema/Product__c.ProductCode__c';
import FIELD_UnitPrice from '@salesforce/schema/Product__c.UnitPrice__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import createOrder from '@salesforce/apex/OrderService.createOrder';
import getProductDetail from '@salesforce/apex/OrderService.getProductDetail';

const fields = [FIELD_Family, FIELD_Name, FIELD_ProductCode, FIELD_UnitPrice];
const FIELDS = ['Account.Id'];

export default class ProductDetail extends LightningElement {
    @track 
    products = []; // 제품 목록을 저장할 배열
    @track 
    cartItems = []; // 장바구니에 담긴 제품 목록
    @track 
    selectedProductId; // 현재 선택된 제품의 ID
    @track 
    quantity = 1; // 기본 수량
    @track
    orderDate;
    @track 
    finalPrice = 0;
    @track 
    originalTotalPrice = 0;
    @track
    discountAmount = 0;
    _accountId;

    @api
    recordId;

    @api
    get accountId() {
        return this._accountId;
    }
    set accountId(value) {
        this._accountId = value;
    }

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredAccount( { error, data }) {
        if (data) {
            this.accountId = getFieldValue(data, 'Account.Id');
        } else if (error) {
            console.error('Error AccountId', error);
        }
    }

    // 메시지 채널을 통한 커뮤니케이션을 위한 wire
    @wire(MessageContext) 
    messageContext;

    // @wire를 사용하여 Apex 클래스 메소드로부터 선택된 제품 데이터를 비동기적으로 가져옴
    @wire(getProductDetail, { productId: '$selectedProductId' })
    productDetail;

    @api product;

    @track 
    productOptions = []; // productBrowser에서 업데이트할 예정

    @track totalPrice
    
    @track productId;
    subscription = null;
    isAddedToCart = false;

    @wire(getRecord, { recordId: '$productId', fields })
    wiredProduct;

    label = {
        labelDetails,
        labelPleaseSelectAItem,
    };

    @track discountPercent = 0;
    // 기타 필요한 상태 변수들

    // handleQuantityChange(event) {
    //     this.quantity = event.target.value;
    // }


    // 컴포넌트가 연결될 때 구독 시작
    connectedCallback() {
        this.subscribeToMessageChannel();
        this.subscribeToSelectedProductChannel();
        this.subscribeToCartChannel();
    }


    // 메시지 채널 구독
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                SELECTED_PRODUCT_CHANNEL,
                (message) => this.handleProductSelected(message)
            );
        }
    }

    subscribeToSelectedProductChannel() {
        if (!this.productSubscription) {
            this.productSubscription = subscribe(this.messageContext, SELECTED_PRODUCT_CHANNEL, (message) => {
                this.handleProductChange(message);
            });
        }
    }

    subscribeToCartChannel() {
        if (!this.cartSubscription) {
            this.cartSubscription = subscribe(this.messageContext, CART_CHANNEL, (message) => {
                this.handleCartChange(message);
            });
        }
    }

    // 선택된 제품을 처리하는 메서드
    handleProductSelected(message) {
        this.selectedProductId = message.ProductId;
        // 여기서 추가적으로 productOptions 내에서 해당 productId를 찾아
        // 필요한 정보를 활용할 수 있습니다.
        }

    handleProductChange(message) {
        this.productId = message.ProductId;
        this.resetProductState();
    }



    handleCartChange(message) {
        if (message && message.cartData && message.cartData.productId === this.productId) {
            if (message.action.cartAction === 'Add') {
                this.isAddedToCart = true;
                this.quantity = message.cartData.quantity;
            } else if (message.action.cartAction === 'Remove') {
                this.resetProductState();
            }
        }
    }


    resetProductState() {
        // 상품 상태 초기화 로직
        this.quantity = 1; // 수량을 기본값 1로 초기화
        this.isAddedToCart = false; // 장바구니 상태를 초기화
    }

    disconnectedCallback() {
        unsubscribe(this.productSubscription);
        unsubscribe(this.cartSubscription);
        this.productSubscription = null;
        this.cartSubscription = null;
    }

    publishChange(cartData, cartAction) {
        const message = {
            cartData: cartData,
            action: {
                cartAction: cartAction
            }
        };
        publish(this.messageContext, CART_CHANNEL, message);
    }


    handleChange(event) {
        this.quantity = event.target.value;
    }


    get detailsTabIconName() {
        return this.wiredProduct.data ? 'standard:warranty_term' : null;
    }

    get productName() {
        return this.wiredProduct.data ? getFieldValue(this.wiredProduct.data, FIELD_Name) : '';
    }

    _getDisplayValue(data, field) {
        return getFieldValue(data, field);
    }


    // 수량 입력 처리
    handleQuantityChange(event) {
        this.quantity = event.target.value;
    }

    // 할인율 입력 처리
    handleDiscountPercentChange(event) {
        this.discountPercent = event.target.value;
        this.calculateFinalPrice();
    }

    // 숫자를 통화 포맷으로 변환하는 함수
    formatPrice(value) {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
    }

    get formattedOriginalTotalPrice() {
        return this.formatPrice(this.originalTotalPrice);
    }
    
    get formattedFinalPrice() {
        return this.formatPrice(this.finalPrice);
    }

    get formattedDiscountAmount() {
        return this.formatPrice(this.discountAmount);
    }
    

    // 최종 가격 계산 메소드
    calculateFinalPrice() {
        let totalPrice = 0;
        this.cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        // 할인 적용
        this.originalTotalPrice = totalPrice; // 정가 기준 총 가격
        this.finalPrice = totalPrice - (totalPrice * this.discountPercent / 100);
        this.discountAmount = totalPrice * this.discountPercent / 100; // 할인금액 계산
        // 포맷팅된 값 업데이트
        // this.formattedDiscountAmount = this.formatPrice(this.discountAmount);
    }

    // 판매일자 입력 처리
    onDateOrderedChange(event) {
        this.orderDate = event.target.value;
    }


     // "제품 추가" 버튼 클릭 이벤트
     addToCart() {
        if (this.productDetail.data) {
            const { Id, Name, UnitPrice__c } = this.productDetail.data;
            const price = UnitPrice__c; // 단가
            const totalItemPrice = price * this.quantity; // 항목별 총 가격
            const formattedTotalItemPrice = this.formatPrice(totalItemPrice); // 항목별 총 가격 포맷팅

            const newItem = {
                productId: Id,
                productName: Name,
                quantity: this.quantity,
                price: price, // 단가 추가
                totalItemPrice: totalItemPrice, // 항목별 총 가격 추가
                formattedTotalItemPrice: formattedTotalItemPrice // 포맷된 항목별 총 가격 추가
            };
            this.cartItems = [...this.cartItems, newItem];
            this.calculateTotalPrice(); // 항목이 추가될 때마다 총 가격을 다시 계산
        } else {
            console.error('제품 상세 정보를 불러오는 데 실패했습니다.');
        }
    
        this.selectedProductId = null;
        this.quantity = 1;
    }
    

    // 총 가격을 계산하는 메서드
    calculateTotalPrice() {
        // 초기 총 가격은 0으로 시작
        let total = 0;
        // cartItems 배열을 순회하면서 각 항목의 가격과 수량을 곱한 값을 합산
        this.cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        // 계산된 총 가격을 totalPrice 변수에 할당
        this.totalPrice = total;
        this.calculateFinalPrice();
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity -= 1;
        }
    }
    
    increaseQuantity() {
        this.quantity += 1;
    }
    
    // 제품을 장바구니에서 삭제하는 메소드
    deleteItem(event) {
        // 삭제 버튼에 설정된 data-id 속성에서 제품 ID를 가져옵니다.
        const productId = event.target.dataset.id;
        
        // cartItems 배열에서 해당 제품 ID를 제외한 새 배열을 만듭니다.
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.calculateTotalPrice(); // 항목이 삭제될 때마다 총 가격을 다시 계산
    }


// 주문 생성 버튼 클릭 이벤트 핸들러
createOrder() {
    // 판매일자 필드 값 검증
    if (!this.orderDate) {
        // 판매일자가 입력되지 않았다면, 사용자에게 알림을 주고 함수 실행 중단
        this.showToast('경고', '판매일자를 반드시 입력해주세요.', 'error');
        return; // 함수 실행 중단
    }

    // 장바구니에 상품이 담겨 있는지 확인
    if (this.cartItems.length > 0) {
        // Apex 메서드 createOrder 호출
        createOrder({
            accountId: this.accountId,
            productIds: this.cartItems.map(item => item.productId),
            quantities: this.cartItems.map(item => item.quantity),
            discountPercent: this.discountPercent,
            orderDate: this.orderDate // 판매일자를 추가
        })
        .then(result => {
            if (this.discountPercent > 20) {
                this.showToast('경고', '할인율 제한 초과!', 'warning');
            }
            // 판매 등록 성공 메시지 표시
            this.showToast('성공', '판매 등록 완료!', 'success');
            // 판매 등록 후 장바구니, 할인율 초기화
            this.cartItems = [];
            this.discountPercent = 0;
            this.orderDate = null; // 판매일자도 초기화
            this.originalTotalPrice = 0;
            this.finalPrice = 0;
            this.discountAmount = 0;
        })
        .catch(error => {
            console.log(error);
            // 판매 등록 실패 메시지 표시
            // this.showToast('실패', '판매 등록 실패!. 오류: ' + (error.body ? error.body.message : '알 수 없는 오류'), 'error');
            this.showToast('실패', '판매 등록 실패!. 오류: ' + error.message, 'error');
        });
    } else {
        // 상품이 장바구니에 담겨 있지 않은 경우 경고 메시지 표시
        this.showToast('경고', '아무 제품도 선택되지 않았습니다.', 'warning');
    }
}

// 토스트 메시지 표시 메서드
showToast(title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(evt);
}



}