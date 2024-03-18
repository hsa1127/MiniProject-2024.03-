public with sharing class ProductBrowser {

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(String productId) {

        String query = '';

		//Base query
        query += 'SELECT Id, ProductType__c, Name, UnitPrice__c, Image_Url__c FROM Product__c';
        
        if(String.isNotEmpty(productId)) {
            query += ' WHERE Id = :productId';
        }
		
		return Database.query(query);
    }
}