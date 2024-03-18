import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AccountViewForm extends NavigationMixin(LightningElement) {
    @api account;

    //닫기버튼 누르면 창 닫기
    cancelViewForm() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    // 레코드 페이지로 이동하는 메소드
    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.account.Id,
                actionName: 'view'
            },
        });
    }

    //상담폼 관리
    isFormVisible = false;

    handleShowForm() {
        this.isFormVisible = true;
        // 다음 프레임에서 DOM 업데이트를 기다립니다.
        setTimeout(() => {
            const form = this.template.querySelector('c-sang-dam-form');
            if(form) {
                form.customerName = this.account.Name;
                form.customerPhone = this.account.Phone__c;
                form.customerEmail = this.account.Email__c;
            }
        }, 0);
    }

    handleFormClose() {
        this.isFormVisible = false;
    }
}