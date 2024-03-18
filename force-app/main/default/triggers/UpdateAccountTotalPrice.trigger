trigger UpdateAccountTotalPrice on OrderHistory__c (after insert, after update, after delete) {
    // Set<Id> accountIds = new Set<Id>();
    // // 추가되거나 업데이트된 주문 내역에 대한 Account ID 수집
    // if (Trigger.isInsert || Trigger.isUpdate) {
    //     for (OrderHistory__c newOrder : Trigger.new) {
    //         accountIds.add(newOrder.AccountName__c); // AccountName__c는 Account의 실제 ID를 참조해야 합니다.
    //     }
    // }
    // // 삭제된 주문 내역에 대한 Account ID 수집
    // if (Trigger.isDelete) {
    //     for (OrderHistory__c oldOrder : Trigger.old) {
    //         accountIds.add(oldOrder.AccountName__c); // AccountName__c는 Account의 실제 ID를 참조해야 합니다.
    //     }
    // }
    // // 해당 Account들에 대한 현재 TotalPrice__c 값을 쿼리합니다.
    // Map<Id, Account> accountsToUpdate = new Map<Id, Account>([SELECT Id, TotalPrice__c FROM Account WHERE Id IN :accountIds]);
    // // 모든 관련 OrderHistory 레코드를 기반으로 새로운 총 금액 계산
    // for (Account acc : [SELECT Id, (SELECT TotalPrice__c FROM AccHistoryNames__r) FROM Account WHERE Id IN :accountIds]) {
    //     Decimal newTotalPrice = 0;
    //     for (OrderHistory__c order : acc.AccHistoryNames__r) {
    //         newTotalPrice += order.TotalPrice__c;
    //     }
    //     // 변경된 총 금액으로 Account 레코드 업데이트
    //     if(accountsToUpdate.containsKey(acc.Id)) {
    //         accountsToUpdate.get(acc.Id).TotalPrice__c = newTotalPrice;
    //     }
    // }
    // // 변경된 Account 정보 업데이트
    // update accountsToUpdate.values();

    if (Trigger.isInsert) {
        AccountPriceManager.editTotalPrice(Trigger.new);
    }
    
}