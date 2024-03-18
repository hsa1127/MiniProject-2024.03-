import { LightningElement, wire } from 'lwc';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_SELECTOR_CHANNEL from '@salesforce/messageChannel/ProductSelectors__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_ID from '@salesforce/user/Id';
import getUserNameById from '@salesforce/apex/UserInfoController.getUserNameById';


export default class sangDamNavigation extends LightningElement {
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
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        // 여기서 message는 메시지 채널을 통해 받은 메시지 객체입니다.
        // 예시로, message.payload.productType에 "노트북" 혹은 "주변기기"가 들어있을 것으로 가정합니다.
        if (message && message.payload) {
            // 예를 들어, productType을 state 변수에 저장하여 사용할 수 있습니다.
            this.selectedProductType = message.payload.productType;
    
            // 추가로 필요한 동작을 수행할 수 있습니다.
            // 예를 들면, 상품 리스트를 필터링하는 메서드를 호출할 수 있습니다.
            this.filterProducts(this.selectedProductType);
        }
    }

    filterProducts(selectedType) {
        // this.products는 모든 제품의 목록입니다.
        // selectedType은 "노트북" 또는 "주변기기"와 같은 선택된 제품 유형입니다.
        this.filteredProducts = this.products.filter(
            product => product.ProductType__c === selectedType
        );
    }

    handleSelect(event) {
        const selectedProductType = event.detail.name; // '노트북' 혹은 '주변기기'
        const payload = { productType: selectedProductType };
        publish(this.messageContext, PRODUCT_SELECTOR_CHANNEL, payload);
    }
    
    handleProductTypeSelection(productType) {
        if (!this.products) {
            return;
        }
        this.filteredProducts = this.products.filter(
            product => product.ProductType__c === productType
        );
    }
    
    //로그인시
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
            duration: 3000 // 3초 동안 표시
        });
        this.dispatchEvent(evt);
    }
    
    showToastError() {
        const evt = new ShowToastEvent({
            title: "오류",
            message: "사용자 정보를 가져오는 데 문제가 발생했습니다.",
            variant: "error",
            duration: 3000 // 3초 동안 표시
        });
        this.dispatchEvent(evt);
    }
}