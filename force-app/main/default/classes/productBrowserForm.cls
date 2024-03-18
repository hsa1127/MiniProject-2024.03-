public with sharing class productBrowserForm {
    
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts() {

        return [SELECT Id, ProductType__c FROM Product__c ORDER BY ProductType__c];

    }


}