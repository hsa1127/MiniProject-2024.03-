import { LightningElement, track } from 'lwc';
import getSangDams from '@salesforce/apex/SangDamController.getSangDams';
import { refreshApex } from '@salesforce/apex';

export default class SangDamDataTable extends LightningElement {
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
        },
        {
            label: '상담내역수정', type: 'button',
            typeAttributes: {
                label: '수정',
                name: 'edit',
                title: 'Edit',
                variant: 'brand-outline',
                iconName: 'utility:edit'
            }
        }];
    
    @track sangdams;
    @track searchKeyword = '';
    @track selectedRecordId;
    @track isDetailViewVisible = false;
    @track isEditFormVisible = false;
    @track showChildComponent = false;

    handleSearchKeywordChange(event) {
        this.searchKeyword = event.target.value;
    }

    connectedCallback() {
        this.searchSangDams();
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
        return refreshApex(this.wiredResult);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.selectedRecordId = row.Id;

        switch (actionName) {
            case 'view':
                this.isDetailViewVisible = true;
                this.isEditFormVisible = false;
                break;
            case 'edit':
                this.isEditFormVisible = true;
                this.isDetailViewVisible = false;
                break;
        }
    }

    handleCloseDetailView() {
        this.isDetailViewVisible = false;
    }

    handleEditFormClose() {
        this.isEditFormVisible = false;
    }

    handleSaveCompleted() {
        this.isEditFormVisible = false;
        return refreshApex(this.wiredResult);
    }

    handleNew() {
        this.showChildComponent = true;
    }

    handleCloseOffline() {
        this.showChildComponent = false;
    }

}