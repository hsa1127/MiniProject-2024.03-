import { LightningElement, api, wire, track } from 'lwc';
import getPurchaseHistory from '@salesforce/apex/PurchaseHistoryController.getPurchaseHistory';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PurchaseHistory extends LightningElement {
    @api accountId;
    @track purchaseHistory;
    @track isModalOpen = false; // Property to control modal visibility
    @track selectedRecord; // Property to hold selected record details
    @track columns = [
        { label: 'Order Date', fieldName: 'OrderDate__c', type: 'date', initialWidth: 150 },
        { label: 'Sales Branch', fieldName: 'SalesBranchName', type: 'text', initialWidth: 200 },
        { label: 'Total Price', fieldName: 'TotalPrice__c', type: 'currency',initialWidth: 100 },
        { label: 'Order Detail', fieldName: 'OrderDetail__c', type: 'text', wrapText: true , initialWidth: 500}
    ];

    connectedCallback() {
        console.log('Account ID: ', this.accountId);
    }

    @wire(getPurchaseHistory, { accountId: '$accountId' })
    wiredPurchaseHistory({ error, data }) {
        if (data) {
            console.log('Data received: ', data);
            this.purchaseHistory = data.map(record => ({
                ...record,
                OrderDate__c: record.OrderDate__c ? new Date(record.OrderDate__c).toLocaleDateString() : '',
                SalesBranchName: record.SalesBranch__r ? record.SalesBranch__r.Name : 'N/A'
            }));
        } else if (error) {
            console.error('Error retrieving purchase history:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to retrieve purchase history',
                    variant: 'error'
                })
            );
            this.purchaseHistory = undefined;
        }
    }

    handleRowAction(event) {
        const row = event.detail.row;
        this.selectedRecord = row;
        this.isModalOpen = true; // Open modal
    }

    closeModal() {
        this.isModalOpen = false;
    }
}