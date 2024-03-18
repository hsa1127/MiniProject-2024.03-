import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import PHONE_NUMBER_FIELD from '@salesforce/schema/SangDam__c.PhoneNumber__c';


export default class SangDamEditForm extends LightningElement {
    @api recordId; // 부모 컴포넌트로부터 전달받은 레코드 ID
    @track phoneNumber = '';

    // "취소" 버튼 클릭 시 모달 닫기 이벤트를 발생시키는 메서드
    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    @track PhoneNumber__c;

    @wire(getRecord, { recordId: '$recordId', fields: [PHONE_NUMBER_FIELD] })
    wiredRecord({ error, data }) {
        if (data) {
            this.phoneNumber = getFieldValue(data, PHONE_NUMBER_FIELD);
        } else if (error) {
            // 오류 처리
            console.error('Error retrieving phone number:', error);
        }
    }


    handleSubmit(event) {
        event.preventDefault(); // 폼의 기본 제출 동작 방지
        const fields = event.detail.fields;
        fields.PhoneNumber__c = this.phoneNumber; // 상태에 저장된 전화번호 값을 필드에 할당
        this.template.querySelector('lightning-record-edit-form').submit(fields); // 수정된 필드 값으로 제출
    }

    handlePhoneChange(event) {
        let inputNumber = event.target.value.replace(/\D/g, ''); // 숫자만 추출
        // 서울 지역번호인 경우
        if (inputNumber.startsWith('02')) {
            inputNumber = inputNumber.replace(/(\d{2})(\d{3,4})(\d{4})?/, '$1-$2-$3').slice(0, 12);
        // 휴대폰 번호인 경우 (010으로 시작)
        } else if (inputNumber.startsWith('010')) {
            inputNumber = inputNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        // 그 외 지역번호인 경우
        } else {
            inputNumber = inputNumber.replace(/(\d{3})(\d{3,4})(\d{4})?/, '$1-$2-$3').slice(0, 13);
        }
        // 결과가 -로 끝나는 경우 제거
        inputNumber = inputNumber.endsWith('-') ? inputNumber.slice(0, -1) : inputNumber;
        
        this.phoneNumber = inputNumber; // 변환된 형식으로 업데이트
        event.target.value = this.phoneNumber; // 화면에 표시된 값을 업데이트
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "성공",
            message: "상담 기록이 성공적으로 수정되었습니다.",
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

    handleError(event) {
        const evt = new ShowToastEvent({
            title: "오류 발생",
            message: event.detail.message, // Salesforce에서 제공하는 오류 메시지
            variant: "error"
        });
        this.dispatchEvent(evt);
    }
}