import { LightningElement, wire, track } from 'lwc';
import { MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import hsa from '@salesforce/messageChannel/hsa__c';
import getAccountInfo from '@salesforce/apex/AccountClass.getAccountInfo';

export default class ShowAccount extends LightningElement {
    subscription = null;
    @track title = '고객정보';
    @track account; // 단일 계정 정보를 위한 변수
    @track isCaseListVisible = false; // 케이스 리스트 표시 여부를 결정하는 변수
    @track latestSangDamStoreName;

    

    @wire(MessageContext) messageContext;

    connectedCallback() {
        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    handleSubscribe() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, hsa, (message) => {
                this.getAccountInfoDetail(message.accountId);
                this.title = `${message.accountName}'s Info`; // 계정 이름으로 제목 설정
                this.isCaseListVisible = false; // 초기 상태에서는 케이스 리스트를 숨김
            });
        }
    }

    async getAccountInfoDetail(accountId) {
    if (accountId) {
        try {
            const accountData = await getAccountInfo({ accountId });
            if (accountData && accountData.length > 0) {
                this.account = accountData[0]; // 반환된 리스트의 첫 번째 요소 (단일 계정)
            } else {
                this.account = undefined; // 데이터가 없으면 account를 undefined로 설정
            }
        } catch (error) {
            console.error('Error retrieving account information:', error);
        }
    }
}


    handleAccountClick() {
        // 계정 정보 클릭 시 케이스 리스트 표시를 토글
        this.isCaseListVisible = !this.isCaseListVisible;
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    get formattedTotalPrice() {
        return this.account && this.account.TotalPrice__c
            ? this.formatNumber(this.account.TotalPrice__c)
            : '0';
    }
    
}