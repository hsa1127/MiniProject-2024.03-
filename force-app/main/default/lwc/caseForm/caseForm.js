import { LightningElement, wire, track, api } from 'lwc';
import getAccountByPhone from '@salesforce/apex/AccountSearch.getAccountByPhone';

export default class CaseForm extends LightningElement {
    @track phoneNumber;

    @wire(getAccountByPhone, { phone: '$phoneNumber' }) account;

    handlePhoneChange(event) {
        this.phoneNumber = event.target.value;
    }
    searchAccount() {
        // The wired method will automatically get called when the phoneNumber changes.
    }
    resetForm() {
        this.phoneNumber = '';
    }
}