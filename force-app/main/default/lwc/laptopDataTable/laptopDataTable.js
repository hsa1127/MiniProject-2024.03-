import { LightningElement, track, wire } from 'lwc';
import getLaptops from '@salesforce/apex/ProductController.getLaptops';

export default class LaptopDataTable extends LightningElement {
    columns = [
        { label: '제품 타입', fieldName: 'ProductType__c', type: 'text' },
        { label: '제품명', fieldName: 'Name', type: 'text' },
        { label: '제품 가격', fieldName: 'UnitPrice__c', type: 'currency' },
        {
            label: '제품 상세', type: 'button', typeAttributes: {
                label: 'View',
                name: 'view_details',
                title: 'View Details',
                variant: 'base'
            }
        }
    ];

    @track laptops;

    @wire(getLaptops)
    wiredLaptops({ error, data }) {
        if (data) {
            this.laptops = data;
            console.log('Data retrieved:', this.laptops);
        } else if (error) {
            console.error('Error retrieving laptops:', error);
            this.showErrorToast(error);
        }
    }

    @track selectedImageUrl;

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        if (action.name === 'view_details') {
            this.selectedImageUrl = row.Image_Url__c; // Image_Url__c 필드를 row 데이터에서 가져옵니다.
        }
    }

}