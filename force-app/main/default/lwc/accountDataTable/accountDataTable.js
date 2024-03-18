import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts'; // Apex 메소드를 구현해야 합니다.

export default class AccountDataTable extends LightningElement {
    @track columns = [
        { label: '고객명', fieldName: 'Name', type: 'text' },
        { label: '전화번호', fieldName: 'Phone__c', type: 'phone' },
        { label: '고객 등급', fieldName: 'SupportTier__c', type: 'text' },
        { label: '고객정보 Detail', type: 'button', 
            typeAttributes: { label: 'View', name: 'view_details', title: 'View Details', variant: 'base' } }
    ];

    @track accounts;
    @track selectedAccount; //선택된 고객 정보를 저장

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            // 오류 처리
            console.error('Error retrieving accounts:', error);
        }
    }

    handleView(event) {
        const actionName = event.detail.action.name;
        if (actionName === 'view_details') {
            this.selectedAccount = event.detail.row;
        }
    }

    @track searchKeyword = ''; // 검색 키워드

    // Apex 메소드 호출을 위한 @wire 대신 검색 기능을 위한 메소드 사용
    connectedCallback() {
        this.loadAccounts();
    }

    loadAccounts() {
        getAccounts({ searchKeyword: this.searchKeyword })
            .then(result => {
                this.accounts = result;
            })
            .catch(error => {
                console.error('Error retrieving accounts:', error);
            });
    }

    handleSearchKeywordChange(event) {
        this.searchKeyword = event.target.value;
    }

    handleSearch() {
        this.loadAccounts();
    }

    handleCloseDetailView() {
        this.selectedAccount = null; // 고객정보 상세보기를 숨김
    }
}