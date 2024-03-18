import { LightningElement, api, track } from 'lwc';
import getPhoneByAccountId from '@salesforce/apex/AccountController.getPhoneByAccountId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class VocInput extends LightningElement {
    @api AccountId__c;
    @api ContactPhone__c;
    @api VoCType__c;
    @api Product__c;
    @api Description__c;
    @api accountId;
    
    @track contactPhone;


    resetForm() {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        inputFields.forEach(field => {
            field.reset();
        });
    }
    
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
            message: "VoC 필드가 성공적으로 저장되었습니다",
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
    
    // handleAccountChange 메서드 내에서 정확한 AccountId 값을 설정하는 코드 예시
    handleAccountChange(event) {
        this.accountId = event.target.value;
        this.fetchContactPhone(this.accountId);
    }
    
    fetchContactPhone(accountId) {
        getPhoneByAccountId({ accountId })
            .then(result => {
                this.contactPhone = result;
            })
            .catch(error => {
                console.error('Error fetching phone number:', error);
                this.contactPhone = '';
            });
    }
    
    handlePhoneChange(event) {
        this.contactPhone = event.target.value;
    }

    //상담유형, 제품명 선택 후 고객 문의내용에 자동 삽입
    @track VoCTypeSelected;
    @track ProductSelected;

    handleVoCTypeChange(event) {
        this.VoCTypeSelected = event.detail.value;
        this.updateCustomerInquiry();
    }

    handleProductChange(event) {
        this.ProductSelected = event.detail.value;
        this.updateCustomerInquiry();
    }

    updateCustomerInquiry() {
        // 리치 텍스트 필드용 HTML 형식의 문자열 생성
        const richTextValue = `
            <p><strong>VoC 유형:</strong> ${this.VoCTypeSelected}</p>
            <p><strong>상담 문의 제품:</strong> ${this.ProductSelected}</p>
            <p><strong>상담 내용:</strong> 상담내용을 입력하세요.</p>
        `;
    
        // 리치 텍스트 필드 값을 업데이트하는 로직
        const customerInquiryField = this.template.querySelector("lightning-input-field[data-id='customerInquiry']");
        if (customerInquiryField) {
            customerInquiryField.value = richTextValue;
        }
    }
}