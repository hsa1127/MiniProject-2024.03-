import { LightningElement,track } from 'lwc';
import createSangDamRecord from '@salesforce/apex/SangDamController.createSangDamRecord';


export default class OfflineSangdam extends LightningElement {
    value = [];
    _selected = [];
    clickedButtonLabel;


    @track customerName;
    @track phoneNumber;
    @track applicationDate;
    @track storeName;
    @track consentToCollection;

    get options() {
        return [
            { label: '단순 상담', value: 'option1' },
            { label: '구매 (예정)', value: 'option2' },
        ];
    }

    get storeoptions() {
        return [
            { label: '서울 신세계백화점 강남점', value: '서울 신세계백화점 강남점' },
            { label: '부산 신세계백화점 센텀시티', value: '부산 신세계백화점 센텀시티' },
            { label: '인천 롯데백화점', value: '인천 롯데백화점' },
            { label: '대전 롯데백화점', value: '대전 롯데백화점' },
            { label: '대구 신세계백화점', value: '대구 신세계백화점' },
            { label: '광주 신세계백화점', value: '광주 신세계백화점' },
            { label: '울산 현대백화점', value: '울산 현대백화점' },
            { label: '세종시 이마트', value: '세종시 이마트' }
        ];
    }

    get selected() {
        return this._selected.length ? this._selected : 'none';
    }

    handleChange(e) {
        this._selected = e.detail.value;
    }

    handleClick(event) {
    this.clickedButtonLabel = event.target.label; // 유지
    // 새 SangDam__c 레코드 생성을 위한 데이터 준비
    const recordInput = {
        'CustomerType__c': this.value.join('; '), // 고객 유형
        'ConsentToCollection__c':this.consentToCollection, // 개인정보 수집 동의 여부
        'AccountId__c': this.customerName, // 고객명
        'PhoneNumber__c': this.phoneNumber, // 전화번호
        'SangDamDate__c': this.applicationDate, // 방문 일자
        'StoreName__c' : this.storeName
        // 여기에 추가 필드를 계속 추가할 수 있습니다.
    };
    createSangDamRecord({ sangDamRecord: recordInput })
        .then(result => {
            // 성공적으로 레코드가 생성되었을 때의 처리
            console.log('Record created with Id: ', result);
            // 추가적인 성공 처리 로직 (예: 알림, 폼 초기화 등)
        })
        .catch(error => {
            // 에러 처리
            console.error('Error creating record: ', error);
            // 추가적인 에러 처리 로직
        });
}

    handleDateChange(event) {
        const selectedDate = event.target.value; // 사용자가 선택한 날짜
    
        if (event.target.name === 'applicationDate') {
            this.applicationDate = selectedDate; // 선택한 날짜로 설정
        } else if (event.target.name === 'orderDeadline') {
            this.orderDeadline = selectedDate; // 선택한 날짜로 설정
        }
    }

    handleInputChange(event) {
        const field = event.target.name;
        switch(field) {
            case 'customerName':
                this.customerName = event.target.value;
                break;
            case 'consentToCollection':
                this.consentToCollection = event.target.value;
                break;
            case 'phoneNumber':
                this.phoneNumber = event.target.value;
                break;
            case 'applicationDate': // 만약 날짜 필드를 처리한다면
                this.applicationDate = event.target.value;
                break;
            case 'storeName': // 인입지점이 다른 컴포넌트에서 설정된 경우
                this.storeName = event.detail.value.join('; '); // 'lightning-dual-listbox' 사용시
                break;
            case 'consultationNotes': // 상담 내역을 처리한다면
                this.consultationNotes = event.target.value;
                break;
            // 추가적인 필드들...
        }
    }
}