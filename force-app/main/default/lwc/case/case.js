import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Case extends LightningElement {
    @api accountId;
    @api status;
    @api reason;
    @api productFamily__c;
    @api product__c;
    @api caseDescription;

    saveCase(event) {
        event.preventDefault(); // 기본 폼 제출 동작을 방지

        const allValid = [...this.template.querySelectorAll('lightning-input-field')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (allValid) {
            this.template.querySelector('lightning-record-edit-form').submit();
        } else {
            this.showErrorToast('모든 필수 필드를 채워주세요.');
        }
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "성공",
            message: "Case가 성공적으로 저장되었습니다",
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

    showErrorToast(message) {
        const evt = new ShowToastEvent({
            title: "오류 발생",
            message: message,
            variant: "error"
        });
        this.dispatchEvent(evt);
    }
}