public with sharing class MapController {
   
    @AuraEnabled(cacheable=true)
    public static List<Branch__c> getStore(){
        try {
            //branch 오브젝트에서 주소 정보가져오기 
           return  [SELECT Id, Name, City__c, Country__c, Street__c, PostalCode__c, wido__Latitude__s, wido__Longitude__s FROM Branch__c];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}