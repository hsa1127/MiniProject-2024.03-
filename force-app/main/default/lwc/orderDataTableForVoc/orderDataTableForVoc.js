import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOrderHistories from '@salesforce/apex/OrderHistoryController.getOrderHistories';

export default class OrderDataTableForVoc extends NavigationMixin(LightningElement) {
    @track columns = [
        // fieldName을 'accountName'으로 수정하고 관계 필드 참조를 제거합니다.
        { label: '고객명', fieldName: 'accountName', type: 'text' },
        { label: '주문번호', fieldName: 'Name', type: 'text' },
        { label: '실판매금액', fieldName: 'TotalPrice__c', type: 'currency' },
    ];

    @track orderHistories;
    @track error;
    searchKey = '';

    connectedCallback() {
        this.loadOrderHistories();
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value; // 입력 값 업데이트
    }

    handleSearch() {
        this.loadOrderHistories();
    }


    loadOrderHistories() {
        getOrderHistories({ accountName: this.searchKey })
            .then(result => {
                this.orderHistories = result.map(row => ({
                    ...row, 
                    accountName: row.AccountName__r ? row.AccountName__r.Name : ''
                }));
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.orderHistories = undefined;
            });
    }

    handleRowAction(event) {
        const row = event.detail.row;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'OrderHistory__c',
                actionName: 'view'
            }
        });
    }
}