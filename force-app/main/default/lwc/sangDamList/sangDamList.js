import { LightningElement, api, wire, track } from 'lwc';
import getSangDamRecordsMatchingAccountName from '@salesforce/apex/SangDamController.getSangDamRecordsMatchingAccountName';
import { NavigationMixin } from 'lightning/navigation';



export default class SangDamList extends NavigationMixin(LightningElement) {
    
    @api recordId; // 고객(Account)의 Record Id

    @wire(getSangDamRecordsMatchingAccountName, { accountId: '$recordId' })
    sangdams;

    @track columns = [
        // ... 기존 컬럼 정의
        { label: '상담 번호', fieldName: 'Name', type: 'text', cellAttributes: { alignment: 'center' }, initialWidth: 120 },
        { label: '상담 일자', fieldName: 'SangDamDate__c', type: 'date', initialWidth: 150 },
        { label: '상담 지점', fieldName: 'StoreName__c', type: 'text', typeAttributes: { currencyCode: 'KRW'}, cellAttributes: { alignment: 'left' }, initialWidth: 130 },
        { label: '상품명', fieldName: 'ProductList__c', type: 'text', cellAttributes: { alignment: 'left' } },
        { label: '상담내용', fieldName: 'SangDamDescription__c', type: 'text', cellAttributes: { alignment: 'left' } },

        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'View Details', name: 'view_details' }
                ]
            }
        }
    ];


    // 행 액션 핸들러
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view_details') {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.Id, // Correct case to 'Id'
                    actionName: 'view'
                }
            });
        }
    }
}