import { LightningElement, wire, track } from 'lwc';
import getAccessory from '@salesforce/apex/ProductController.getAccessory';
import { refreshApex } from '@salesforce/apex';

export default class AccessoryDataTable extends LightningElement {
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

    @track accessories;
    @track selectedImageUrl;
    @track searchKeyword = ''; //검색어를 저장할 변수

    @wire(getAccessory)
    wiredAccessories({ error, data }) {
        if (data) {
            this.accessories = data;
        } else if (error) {
            console.error('Error retrieving accessories:', error);
        }
    }

    handleSearchKeywordChange(event) {
        this.searchKeyword = event.target.value;
    }

    handleSearch() {
        // 검색 로직은 @wire 데코레이터에 의해 자동으로 처리됩니다.
        // searchKeyword의 반응성에 의해 getSangDams 메소드가 재호출됩니다.
    }

    handleRefresh() {
        return refreshApex(this.wiredResult); // 데이터 리프레시
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        if (action.name === 'view_details') {
            this.selectedImageUrl = row.Image_Url__c; // Image_Url__c 필드를 row 데이터에서 가져옵니다.
        }
    }
}