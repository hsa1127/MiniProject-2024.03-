@isTest
private class TestUpdateAccountTotalPrice {
    @isTest static void testUpdateTotalPrice() {
        // 테스트 계정 생성
        Account testAccount = new Account(Name = 'Test Account', TotalPrice__c = 0);
        insert testAccount;

        // 환불되지 않은 주문 내역 생성
        OrderHistory__c newOrder = new OrderHistory__c(
            AccountName__c = testAccount.Id,
            TotalPrice__c = 1000,
            RecordTypeId = [SELECT Id FROM RecordType WHERE DeveloperName = 'CompletedOrder' AND SobjectType = 'OrderHistory__c' LIMIT 1].Id
        );
        insert newOrder;

        // 환불 주문 내역 생성
        OrderHistory__c refundedOrder = new OrderHistory__c(
            AccountName__c = testAccount.Id,
            TotalPrice__c = 500,
            RecordTypeId = [SELECT Id FROM RecordType WHERE DeveloperName = 'RefundedOrder' AND SobjectType = 'OrderHistory__c' LIMIT 1].Id
        );
        insert refundedOrder;

        // 데이터베이스에서 계정 다시 쿼리하여 변경 확인
        Account updatedAccount = [SELECT TotalPrice__c FROM Account WHERE Id = :testAccount.Id];
        System.assertEquals(1000, updatedAccount.TotalPrice__c);
    }
}