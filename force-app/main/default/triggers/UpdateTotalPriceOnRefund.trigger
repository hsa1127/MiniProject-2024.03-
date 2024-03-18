trigger UpdateTotalPriceOnRefund on Refund__c (after insert) {
    // Set<Refund__c> accountIds = new Set<Refund__c>();

    // // 환불된 주문과 연결된 계정의 ID 수집
    // for (Refund__c refund : Trigger.new) {
    //     accountIds.add(refund);
    // }
    
    // AccountPriceManager 클래스를 호출하여 계정의 총 환불 금액을 업데이트
    AccountPriceManager.updateTotalPriceFromRefunds(Trigger.new);
}