import { LightningElement, track, wire, api } from 'lwc';
import getVocRecords from '@salesforce/apex/VoCHistoryController.getVoCRecords';
import { refreshApex } from '@salesforce/apex';
import saveVoCDetails from '@salesforce/apex/VoCHistoryController.saveVoCDetails';



export default class VocDataTable extends LightningElement {
    @track vocs;
    @track selectedAccountId;
    @track searchKeyword = '';
    wiredVoCsResult;
    @api recordForSave;

    columns = [
        { label: '고객명', fieldName: 'Name', type: 'text' },
        { label: '상담일자', fieldName: 'CreatedDate', type: 'date' },
        { label: '상담유형', fieldName: 'VoCType__c', type: 'text' },
        { label: '상품명', fieldName: 'Product__c', type: 'text' },
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
            label: '상담내역 수정', type: 'button',
            typeAttributes: {
                label: '수정',
                name: 'edit',
                title: 'Edit',
                variant: 'brand-outline',
                iconName: 'utility:edit'
            }
        }];

    // accountId를 기반으로 상담 내역을 가져오는 wired 메서드
    /*@wire(getVoCs, { accountId: '$selectedAccountId' })
    wiredVoCs(result) {
        this.wiredVoCsResult = result;
        console.log('대님' + this.wiredVoCsResult);
        if (result.data) {
            this.vocs = result;
            console.log('대욱님' + this.vocs);
        } else if (result.error) {
            console.error('Error retrieving VoCs:', error);
        }
    }*/

    // 선택된 계정 ID를 설정하는 메서드
    handleAccountSelection(event) {
        this.selectedAccountId = event.detail.value;
        // 선택된 계정 ID에 따라 상담 내역을 조회할 수 있습니다.
    }

    handleSearchKeywordChange(event) {
        this.searchKeyword = event.detail.value;
    }

    handleSearch() {
        // 입력된 고객명으로 상담 내역을 검색하는 메서드
        getVocRecords({ customerName: this.searchKeyword })
            .then(data => {
                // 결과 데이터 가공
                const modifiedData = data.map(record => ({
                    ...record,
                    Name: record.AccountId__r?.Name // AccountId__r 객체에서 Name 필드를 추출
                }));

                this.vocs = modifiedData;
                console.log('확인' + JSON.stringify(this.vocs));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //modal구현
    @track isModalOpen = false; // 모달 상태를 관리하기 위한 변수
    @track currentRecordId; // 현재 선택된 레코드 ID를 저장

    // 모달을 열기 위한 메서드
    openModal(recordId) {
        this.isModalOpen = true;
        this.currentRecordId = recordId;
    }

    // 모달을 닫기 위한 메서드
    closeModal() {
        this.isModalOpen = false;
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const recordId = event.detail.row.Id;

        switch (actionName) {
            case 'view':
                this.openModal(recordId);
                break;
            case 'edit':
                this.openModal(recordId);
                break;
        }
    }

    //modal 작동
    @track isDetailVisible = false; // 상세 정보 보기 상태
    @track isEditVisible = false; // 편집 상태

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const recordId = event.detail.row.Id;

        // 모든 상태를 초기화
        this.isDetailVisible = false;
        this.isEditVisible = false;

        // 선택된 액션에 따라 상태 설정
        if (actionName === 'view') {
            this.isDetailVisible = true;
            this.isEditVisible = false;
            this.currentRecordId = recordId;
            this.isModalOpen = true; // 모달을 여는 상태로 설정
        } else if (actionName === 'edit') {
            this.isEditVisible = true;
            this.isDetailVisible = false;
            this.currentRecordId = recordId;
            this.isModalOpen = true; // 모달을 여는 상태로 설정
        }
    }

    handleSaveRefresh() {
        this.closeModal();
        console.log('console.log');
        this.refreshData(); // 데이터를 새로고침하는 사용자 정의 메서드
    }

    // 데이터 새로고침 메서드
    refreshData() {
        if (this.wiredVoCsResult) {
            console.log('refreshdata');
            refreshApex(this.wiredVoCsResult);
        }
    }

    handleSaveDetail() {
        // 데이터 새로고침 로직
        this.refreshData();
    }

    handleSaveRecord(event) {
        console.log('Received record data:', event.detail.record);

        this.recordForSave = event.detail.record; // 이벤트에서 수정된 레코드 데이터 수신
    }

    saveDetails() {
        console.log('Saving record data:', this.recordForSave);
        if (this.recordForSave) {
            saveVoCDetails({ voc: this.recordForSave })
                .then(result => {
                    this.closeModal();
                    this.refreshData();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            console.error('No record data to save');
        }
    }
}