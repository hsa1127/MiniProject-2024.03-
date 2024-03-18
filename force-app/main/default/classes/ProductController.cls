public with sharing class ProductController {
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts() {
        return [SELECT Id, Name, UnitPrice__c, ProductType__c FROM Product__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getLaptops() {
        return [SELECT Id, Name, UnitPrice__c, ProductType__c, Image_Url__c FROM Product__c WHERE ProductType__c = :'노트북'];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getAccessory() {
        return [SELECT Id, Name, UnitPrice__c, ProductType__c, Image_Url__c FROM Product__c WHERE ProductType__c = :'주변기기'];
    }
}