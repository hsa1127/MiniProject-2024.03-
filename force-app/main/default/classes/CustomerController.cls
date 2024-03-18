public with sharing class CustomerController {
    @AuraEnabled(cacheable=true)
    public static List<Account> searchCustomers(String partialPhoneNumber){
        String phoneQuery = '%' + partialPhoneNumber + '%';
        return [SELECT Id, Name, Phone, SupportTier__c, 
                FirstBranch__c, TotalPrice__c, LeadContentsCnt__c FROM Account WHERE Phone LIKE :phoneQuery];
    }

    @AuraEnabled(cacheable=true)
    public static Account getCustomerDetails(Id accountId){
        return [SELECT Id, Name, Phone, SupportTier__c, 
        FirstBranch__c, TotalPrice__c, LeadContentsCnt__c FROM Account WHERE ID = : accountId LIMIT 1 ];
    }
}