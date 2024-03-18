import { LightningElement, track, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import createOrder from '@salesforce/apex/ProductService.createOrder';
import getAccountInfo from '@salesforce/apex/AccountService.getAccountInfo';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class CartData extends NavigationMixin(LightningElement) {
    @track showModal = false;
    @track showLoading = false;
    @track products;
    @track totalPrice = 0;

    @api recordId; // Account ID

    // Account 정보 조회
    account;
    @wire(getAccountInfo, { accountId: '$recordId' })
    wiredAccountInfo({ error, data }) {
        if (data) {
            console.log('Account data retrieved successfully:', data);
            this.account = data;
        } else if (error) {
            console.error('Failed to retrieve account information:', error);
            this.showToast('Error', 'Failed to retrieve account information', 'error', 'dismissable');
        }
    }

    

    // @api openModal(products) {
    //     console.log(products);
    //     this.totalPrice = 0;
    //     products.forEach(currentItem => {
    //         this.totalPrice = this.totalPrice + currentItem.totalPrice;
    //     });

    //     this.products = products;
    //     this.showModal = true;
    // }

    @api openModal(products) {
        this.products = products;
        this.calculateTotalPrice();
        this.showModal = true;
    }
    
    calculateTotalPrice() {
        this.totalPrice = this.products.reduce((total, product) => total + product.totalPrice, 0);
    }

    closeModal(){
        this.showModal = false;
    }

    get isDisable(){
        return !(this.products.length > 0) || this.showLoading;
    }

    handleOrder(){
        if (!this.account.Id) {
            this.showToast('Error', 'Account information is not available.', 'error', 'dismissable');
            return;
        }

        this.showLoading = true;

        // let orderDetailsArray = this.products.map(product => {
        //     return {
        //         // 각 제품의 상세 정보를 Apex가 예상하는 ProductOrderWrapper 형식으로 매핑
        //         Id: product.Id, // 이는 제품의 Salesforce 레코드 ID를 가정합니다.
        //         Name: product.Name,
        //         price: product.UnitPrice, // 제품 단위 가격
        //         totalPrice: product.totalPrice, // 제품 총 가격
        //         quantity: product.quantity, // 수량
        //         code: product.ProductCode, // 제품 코드
        //         type: product.ProductType // 제품 타입
        //     };
        // });

        // 주문 상세 내역을 구성하는 예시입니다.
        // 실제 값은 사용자 인터페이스로부터 가져오거나 계산해야 합니다.
        // Build the order details object for the order
        let orderDetailString = this.products.map(product => `${product.Name} (Quantity: ${product.quantity}`).join(', ');
        const orderDetails = {
            // OrderHistory__c 객체의 필드와 매핑된다고 가정합니다.
            TotalPrice__c: this.totalPrice,
            OrderDetail__c: orderDetailString,
            AccountPhone__c: this.account.Phone,
            AccountName__c: this.account.Name,
        };

        createOrder({ accountId: this.account.Id, orderJson: JSON.stringify(orderDetails) })
        .then(result=>{
            // 결과 문자열에 'Error'라는 단어가 포함되어 있는지 확인
            if (result.startsWith('Error: ')) {
                this.showToast('Error!!', result, 'error', 'dismissable');
            } else {
                let title = 'Order Created Successfully!!';
                this.showToast('Success!', title, 'success', 'dismissable');
                this.navigateToOrderPage(result);
            }
        })
        .catch(error => {
            // 에러를 콘솔에 기록하고 토스트 메시지로 사용자에게 알립니다.
            console.error('Order creation error: ', error);
            this.showToast('Error!!', error.body.message, 'error', 'dismissable');
        })
        .finally(() => {
            this.showLoading = false;
        });
    }

    navigateToOrderPage(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'OrderHistory__c',
                actionName: 'view'
            },
        });
    }
  
    showHideSpinner() {
        // Setting boolean variable show/hide spinner
        this.showLoading = !this.showLoading;
    }

    showToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    } 
}