import { LightningElement, api, wire } from 'lwc';
import getBranchLocation from '@salesforce/apex/BranchLocationController.getBranchLocation';

export default class BranchLocation extends LightningElement {
    @api recordId; // Branch__c 레코드 페이지에서 Record Id를 자동으로 받습니다.
    mapMarkers;

    @wire(getBranchLocation, { branchId: '$recordId' })
    wiredLocation({ error, data }) {
        if (data) {
            this.mapMarkers = [{
                location: {
                    Latitude: data.wido__Latitude__s,
                    Longitude: data.wido__Longitude__s
                },
                title: data.Name,
                description: `${data.Street__c}, ${data.City__c}, ${data.PostalCode__c}, ${data.Country__c}`
            }];
        } else if (error) {
            this.mapMarkers = undefined;
            console.error('Error:', error);
        }
    }
}