public with sharing class AccountFirstBranchManager {

    // 첫 구매에 따라 고객의 인입지점 업데이트
    public static void updateFirstBranch(List<OrderHistory__c> newOrders) {
    // 새 주문과 연관된 고객 계정 ID 수집
    Set<Id> accountIds = new Set<Id>();
    for(OrderHistory__c order : newOrders) {
        if(order.AccountName__c != null) {
            accountIds.add(order.AccountName__c);
        }
    }

    // 인입지점이 설정되지 않은 계정만 필터링
    Map<Id, Account> accountsToUpdate = new Map<Id, Account>();
    for(Account acc : [SELECT Id, FirstBranch__c FROM Account WHERE Id IN :accountIds AND FirstBranch__c = null]) {
        accountsToUpdate.put(acc.Id, acc);
    }

    // 새 주문의 판매점 정보로 인입지점 업데이트
    for(OrderHistory__c order : newOrders) {
        if(accountsToUpdate.containsKey(order.AccountName__c) && order.SalesBranch__c != null) {
            accountsToUpdate.get(order.AccountName__c).FirstBranch__c = order.SalesBranch__c;
        }
    }

    update accountsToUpdate.values();
    }
    
}