import { LightningElement, api, wire } from 'lwc';
import getFirstBranchLocation from '@salesforce/apex/BranchLocationController.getFirstBranchLocation';

export default class BranchLocation extends LightningElement {
    @api recordId; // Account의 Record Id
    mapMarkers = [];

    @wire(getFirstBranchLocation, { accountId: '$recordId' })
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