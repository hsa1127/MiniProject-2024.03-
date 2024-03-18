public with sharing class PurchaseHistoryController {
    @AuraEnabled(cacheable=true)
    public static List<OrderHistory__c> getPurchaseHistory(String accountId) {
        // 주어진 AccountId에 일치하는 주문내역 조회하기
        return [
            SELECT Id, OrderDate__c, SalesBranch__r.Name, TotalPrice__c, OrderDetail__c, AccountName__c
            FROM OrderHistory__c
            WHERE AccountName__c = :accountId
            ORDER BY OrderDate__c DESC
        ];
    }
}