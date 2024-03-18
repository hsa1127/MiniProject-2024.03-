public with sharing class AccountSearch {
    @AuraEnabled(cacheable=true)
    public static Account getAccountByPhone(String phone) {
        return [SELECT Name, Phone__c, SupportTier__c FROM Account WHERE Phone__c = :phone LIMIT 1];
    }
}