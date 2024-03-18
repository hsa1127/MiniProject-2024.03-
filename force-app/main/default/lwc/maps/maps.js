import { LightningElement,wire } from 'lwc';
import getStore from '@salesforce/apex/MapController.getStore';

export default class Maps extends LightningElement {
    mapMarkers=[]
    markersTitle = "인입지점 위치정보"
    @wire(getStore)
    wireHandler({data, error}){
        if(data){
            console.log(data)
            this.formatResponse(data)
        }
        if(error){
            console.error(error)
        }
    }

    formatResponse(data) {
        this.mapMarkers = data.map(item => {
            // 지역명을 추출하는 로직, 필요한 경우 수정 가능
            let city = item.City__c || '';
            let description = city; // 또는 다른 로직을 사용하여 지역명을 설정
    
            return {
                location: {
                    City: city,
                    Country: item.Country__c || '',
                    Street: item.Street__c || '',
                    PostalCode: item.PostalCode__c || '',
                    Latitude: item.wido__Latitude__s, 
                    Longitude: item.wido__Longitude__s, 
                },
                icon: 'utility:salesforce1',
                title: item.Name,
                description: description, // 위에서 설정한 지역명을 사용
                value: item.Id // 마커를 구분하기 위한 고유 값
            }
        });
        this.selectedMarker = this.mapMarkers.length > 0 ? this.mapMarkers[0].value : undefined;
    }
    
    callMarkerHandler(event){
        this.selectedMarker = event.detail.selectedMarkerValue
    }
    
}