import { LightningElement, track, wire } from 'lwc';
import getSangDams from '@salesforce/apex/SangDamController.getSangDams';
import { refreshApex } from '@salesforce/apex';

export default class SangDamDataTableForVoc extends LightningElement {
    @track columns = [
        { label: '고객명', fieldName: 'AccountName__c', type: 'text' },
        { label: '상담일자', fieldName: 'SangDamDate__c', type: 'date' },
        { label: '상담 진행현황', fieldName: 'SangDamProgress__c', type: 'text' },
        {
            label: '상담내역 상세', type: 'button',
            typeAttributes: {
                label: 'View',
                name: 'view',
                title: 'View',
                variant: 'base'
            }
        }
    ];

    @track sangdams;
    @track searchKeyword = '';
    @track selectedRecordId;
    @track isDetailViewVisible = false;

    handleSearchKeywordChange(event) {
        this.searchKeyword = event.target.value;
    }

    connectedCallback() {
        this.searchSangDams();
    }

    wiredResult; // wire 서비스에서 반환된 결과를 저장하기 위한 속성 추가

    @wire(getSangDams, { customerName: '$searchKeyword' })
    wiredSangdams(result) {
        this.wiredResult = result; // wire 서비스의 반환 값을 저장
        if (result.data) {
            this.sangdams = result.data;
        } else if (result.error) {
            // 사용자에게 오류를 알리는 방법을 추가하세요.
            console.error('Error retrieving sangdams:', error);
        }
    }

    handleSearch() {
        // 사용자가 검색 버튼을 클릭하면 searchSangDams 메서드를 호출합니다.
        this.searchSangDams();
    }
    
    searchSangDams() {
        // 입력된 검색 키워드를 사용하여 Apex 메서드를 호출합니다.
        getSangDams({ customerName: this.searchKeyword })
            .then(result => {
                // 결과를 sangdams 상태에 설정합니다.
                this.sangdams = result;
            })
            .catch(error => {
                // 오류가 있을 경우 콘솔에 오류를 출력합니다.
                console.error('Error:', error);
            });
    }

   handleRefresh() {
        if (this.wiredResult) {
            return refreshApex(this.wiredResult);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.selectedRecordId = row.Id;

        switch (actionName) {
            case 'view':
                this.isDetailViewVisible = true;
                break;
            
        }
    }

    handleCloseDetailView() {
        this.isDetailViewVisible = false;
    }

    //모달
    @track isModalOpen = false;
    selectedRecordId;

    handleRowAction(event) {
        this.selectedRecordId = event.detail.row.Id;
        this.isModalOpen = true; // 모달 열기
    }

    handleCloseModal() {
        this.isModalOpen = false; // 모달 닫기
    }


}