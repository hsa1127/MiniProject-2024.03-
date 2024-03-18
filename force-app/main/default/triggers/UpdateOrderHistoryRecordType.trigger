trigger UpdateOrderHistoryRecordType on Refund__c (after insert) {
    // Refund__c 레코드의 OrderNumber__c 필드값을 기준으로 OrderHistory__c 레코드를 찾아 레코드 타입을 업데이트합니다.
    
    // OrderNumber__c 필드값을 저장할 Set을 생성합니다.
    Set<Id> orderHistoryIds = new Set<Id>();
    for (Refund__c refund : Trigger.new) {
        orderHistoryIds.add(refund.OrderNumber__c);
    }
    
    // 변경할 레코드 타입의 ID를 찾습니다. 이 ID는 설정에 따라 달라집니다.
    Id newRecordTypeId = Schema.SObjectType.OrderHistory__c.getRecordTypeInfosByName().get('환불건').getRecordTypeId();

    // OrderHistory__c 레코드를 조회합니다.
    List<OrderHistory__c> orderHistoriesToUpdate = [SELECT Id, RecordTypeId FROM OrderHistory__c WHERE Id IN :orderHistoryIds];

    // 조회한 레코드의 레코드 타입을 변경합니다.
    for (OrderHistory__c orderHistory : orderHistoriesToUpdate) {
        orderHistory.RecordTypeId = newRecordTypeId;
    }

    // 변경된 레코드 타입으로 OrderHistory__c 레코드를 업데이트합니다.
    update orderHistoriesToUpdate;
}