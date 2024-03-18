import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class VocEditForm extends LightningElement {
    @api recordId;
    recordData;
    @api VoC__c;

    handleSuccess(event) {
        const updatedRecord = event.detail.fields;
        console.log('Save success, record data:', updatedRecord);
    
        this.dispatchEvent(new ShowToastEvent({
            title: "성공",
            message: "VoC 상담 기록이 성공적으로 수정되었습니다.",
            variant: "success"
        }));

        // 저장 성공 후 부모 컴포넌트에 이벤트를 발송하여 알림
        this.dispatchEvent(new CustomEvent('saverefresh'));
    }


    closeModal() {
        // 부모 컴포넌트에 이벤트를 발송하여 모달 닫기
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleError(event) {
        const evt = new ShowToastEvent({
            title: "오류 발생",
            message: event.detail.message, // Salesforce에서 제공하는 오류 메시지
            variant: "error"
        });
        this.dispatchEvent(evt);
    }

    submitForm() {
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    handleSubmit(event) {
        event.preventDefault(); // 기본 동작 방지
        this.submitForm(); // 폼 제출 메서드 호출
    }
}