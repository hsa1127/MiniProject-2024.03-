public class AccountPriceManager {
    // 주문 내역을 기반으로 총액 업데이트
    public static void updateTotalPriceFromOrderHistory(Set<Id> accountIds) {
        // Account별로 현재 주문 총액 계산
        Map<Id, Decimal> newTotalPrices = new Map<Id, Decimal>();
        for (OrderHistory__c order : [SELECT Id, TotalPrice__c, AccountName__c FROM OrderHistory__c WHERE AccountName__c IN :accountIds]) {
            Decimal totalPrice = newTotalPrices.containsKey(order.AccountName__c) ? newTotalPrices.get(order.AccountName__c) : 0;
            newTotalPrices.put(order.AccountName__c, totalPrice + order.TotalPrice__c);
        }
        // Account의 TotalPrice__c 필드 업데이트
        List<Account> accountsToUpdate = new List<Account>();
        for (Id accountId : accountIds) {
            Account acc = new Account(Id = accountId, TotalPrice__c = newTotalPrices.get(accountId));
            accountsToUpdate.add(acc);
        }
        update accountsToUpdate;
    }

    // 환불 내역을 기반으로 총액 업데이트
    public static void updateTotalPriceFromRefunds(List<Refund__c> refundNew) {      
        if (RecursionControl.processingAlready) return; // 이미 처리 중이면 종료
        RecursionControl.processingAlready = true; // 처리 중 상태로 설정

        try {
            Refund__c refund = refundNew[0]; // 첫 번째 환불 건을 가져옵니다.
            Account acct = [SELECT Id, TotalPrice__c FROM Account WHERE Id = :refund.AccountName__c LIMIT 1];
            if (acct != null && acct.TotalPrice__c != null) {
                acct.TotalPrice__c -= refund.RefundAmount__c; // 환불 금액을 차감합니다.
                update acct; // 계정 정보를 업데이트합니다.
            }
        } finally {
            RecursionControl.processingAlready = false; // 처리 완료 후 상태를 재설정
        }
    }

    public static void editTotalPrice(List<OrderHistory__c> orders) {
        try {
            if (!orders.isEmpty()) {
                OrderHistory__c order = orders.get(0); // 첫 번째 주문을 가져옵니다.
                // AccountName__c가 실제 Account ID를 참조하는지 확인합니다.
                if (order.AccountName__c != null) { 
                    Account acct = [SELECT Id, TotalPrice__c FROM Account WHERE Id = :order.AccountName__c LIMIT 1];
                    if (acct != null) {
                        Decimal currentTotal = (acct.TotalPrice__c != null) ? acct.TotalPrice__c : 0;
                        acct.TotalPrice__c = currentTotal + order.TotalPrice__c; // 주문 가격을 더합니다.
                        update acct; // 계정 정보를 업데이트합니다.
                    }
                }
            }
        } catch (Exception e) {
            // 오류 로깅 또는 사용자에게 오류 메시지 전달
        }
    }
}