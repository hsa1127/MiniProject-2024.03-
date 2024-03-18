trigger UpdateOrderProductOnRefund on Refund__c (after insert) {
    // 환불 내역에 대응하는 주문내역 ID를 수집합니다.
    Set<Id> orderHistoryIds = new Set<Id>();
    for (Refund__c refund : Trigger.new) {
        orderHistoryIds.add(refund.OrderNumber__c);
    }
    
    // 해당 주문내역에 연결된 모든 OrderProduct__c 레코드를 찾습니다.
    List<OrderProduct__c> orderProductsToUpdate = [
        SELECT Id, SalePStatus__c
        FROM OrderProduct__c
        WHERE OrderNumber__c IN :orderHistoryIds
    ];
    
    // OrderProduct__c 레코드의 판매상태를 '환불완료'로 업데이트합니다.
    for (OrderProduct__c op : orderProductsToUpdate) {
        op.SalePStatus__c = '환불완료';
    }
    
    // 변경사항을 저장합니다.
    if (!orderProductsToUpdate.isEmpty()) {
        update orderProductsToUpdate;
    }
}