trigger UpdateOrderStatusOnRefund on Refund__c (after insert) {

    // 환불 처리된 주문 ID를 저장할 Set 컬렉션
    Set<Id> orderHistoryIds = new Set<Id>();

    // 환불 내역을 반복하여 관련된 주문 ID를 수집
    for (Refund__c refund : Trigger.new) {
        if(refund.OrderNumber__c != null) { // Lookup 필드가 null이 아닌 경우만 추가
            orderHistoryIds.add(refund.OrderNumber__c);
        }
    }

    // 주문 내역 레코드 조회
    List<OrderHistory__c> ordersToUpdate = [
        SELECT Id, SaleStatus__c 
        FROM OrderHistory__c
        WHERE Id IN :orderHistoryIds
    ];

    // SaleStatus__c  필드를 '환불완료'로 업데이트
    for (OrderHistory__c order : ordersToUpdate) {
        order.SaleStatus__c  = '환불완료';
    }

    // 데이터베이스에 업데이트
    update ordersToUpdate;
}