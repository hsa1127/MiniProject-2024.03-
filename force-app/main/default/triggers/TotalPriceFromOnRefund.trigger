trigger TotalPriceFromOnRefund on Refund__c (after insert, after update, after delete) {
    Set<Id> accountIds = new Set<Id>();

    // 환불된 주문과 연결된 계정의 ID 수집
    for (Refund__c refund : (Trigger.isDelete ? Trigger.old : Trigger.new)) {
        accountIds.add(refund.AccountName__c);
    }

    // 변경된 Account 정보 쿼리 및 업데이트
    Map<Id, Account> accountsToUpdate = new Map<Id, Account>(
        [SELECT Id, TotalPrice__c, (SELECT RefundAmount__c FROM AccRefundNames__r) FROM Account WHERE Id IN :accountIds]
    );

    for (Account acc : accountsToUpdate.values()) {
        Decimal totalRefund = 0;
        for (Refund__c refund : acc.AccRefundNames__r) { // 올바른 관계 이름 사용
            totalRefund += refund.RefundAmount__c;
        }
        acc.TotalPrice__c -= totalRefund; // 환불 금액을 차감
    }

    update accountsToUpdate.values();
}