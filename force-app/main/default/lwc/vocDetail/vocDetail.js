import { LightningElement, api } from 'lwc';

export default class VocDetail extends LightningElement {
    @api recordId; // 부모 컴포넌트로부터 받는 recordId
}