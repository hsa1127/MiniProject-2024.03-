public with sharing class OrderHistoryController {

    @AuraEnabled(cacheable=true)
    public static List<OrderHistory__c> getOrderHistories(String accountName) {
        // Account 이름으로 Account ID 찾기
        Set<Id> accountIds = new Set<Id>();
        if (String.isNotBlank(accountName)) {
            for (Account acc : [SELECT Id FROM Account WHERE Name LIKE :('%' + accountName + '%')]) {
                accountIds.add(acc.Id);
            }
        }

        // Account ID를 사용하여 OrderHistory__c 검색
        if (!accountIds.isEmpty()) {
            return [SELECT Id, Name, TotalPrice__c, AccountName__r.Name FROM OrderHistory__c WHERE accountName__c IN :accountIds];
        } else {
            return [SELECT Id, Name, TotalPrice__c, AccountName__r.Name FROM OrderHistory__c];
        }
    }
}