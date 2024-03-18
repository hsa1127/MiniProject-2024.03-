import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';


export default class SangDamForm extends LightningElement {
    @track ConsentToCollection__c;
    @track SangDamDate__c;
    @track StoreName__c;
    @track SangDamDescription__c;
    @track ProductList__c;

    @api recordId;
    //기존 고객정보 불러오기
    @api customerName;
    @api customerPhone;
    @api customerEmail;
    
    handleSubmit(event) {
        // 기본 이벤트 동작을 방지합니다.
        event.preventDefault();
    
        // event.detail.fields 객체를 사용하여 lightning-input-field로부터의 데이터를 가져옵니다.
        const fields = event.detail.fields;
    
        // lightning-input으로부터 입력받은 데이터를 fields 객체에 추가합니다.
        fields.AccountName__c = this.customerName;
        fields.PhoneNumber__c = this.customerPhone;
        fields.Email__c = this.customerEmail;
    
        // 수정된 fields 객체를 사용하여 폼을 제출합니다.
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleNameChange(event) {
        this.customerName = event.target.value;
    }
    
    handlePhoneChange(event) {
        this.customerPhone = event.target.value;
    }
    
    handleEmailChange(event) {
        this.customerEmail = event.target.value;
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "성공",
            message: "상담 기록이 성공적으로 제출되었습니다.",
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

    handleError(event) {
        const evt = new ShowToastEvent({
            title: "오류 발생",
            message: error.body.message, 
            variant: "error"
        });
        this.dispatchEvent(evt);
    }

    @api closeForm() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleClose() {
        this.closeForm();
    }
}