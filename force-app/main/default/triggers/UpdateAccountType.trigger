trigger UpdateAccountType on Account (after insert, after update) {
    if (TriggerHandler.runOnce('UpdateAccountType')) {
        // Account ID를 기반으로 OrderHistory__c와 Refund__c 레코드를 집계하기 위한 Map
        Map<Id, Integer> orderHistoryCountMap = new Map<Id, Integer>();
        Map<Id, Integer> refundCountMap = new Map<Id, Integer>();

        // 초기화
        for (Account acc : Trigger.new) {
            orderHistoryCountMap.put(acc.Id, 0);
            refundCountMap.put(acc.Id, 0);
        }

        // OrderHistory__c 레코드 개수 계산
        List<AggregateResult> orderHistories = [
            SELECT AccountName__c, COUNT(Id) cnt 
            FROM OrderHistory__c 
            WHERE AccountName__c IN :Trigger.newMap.keySet() 
            GROUP BY AccountName__c
        ];

        for (AggregateResult ar : orderHistories) {
            Id accountId = (Id)ar.get('AccountName__c');
            Integer count = (Integer)ar.get('cnt');
            orderHistoryCountMap.put(accountId, count);
        }

        // Refund__c 레코드 개수 계산
        List<AggregateResult> refunds = [
            SELECT AccountName__c, COUNT(Id) cnt 
            FROM Refund__c 
            WHERE AccountName__c IN :Trigger.newMap.keySet() 
            GROUP BY AccountName__c
        ];

        for (AggregateResult ar : refunds) {
            Id accountId = (Id)ar.get('AccountName__c');
            Integer count = (Integer)ar.get('cnt');
            refundCountMap.put(accountId, count);
        }

        // 개수 비교 및 AccountType__c 업데이트
        List<Account> accountsToUpdate = new List<Account>();
        for (Id accId : Trigger.newMap.keySet()) {
            Integer orderHistoryCount = orderHistoryCountMap.get(accId) != null ? orderHistoryCountMap.get(accId) : 0;
            Integer refundCount = refundCountMap.get(accId) != null ? refundCountMap.get(accId) : 0;
            
            if (orderHistoryCount == refundCount) {
                accountsToUpdate.add(new Account(Id = accId, AccountType__c = '상담고객'));
            } else if (orderHistoryCount - refundCount >= 1) {
                accountsToUpdate.add(new Account(Id = accId, AccountType__c = '구매고객'));
            }
        }

        // 필요한 경우 Account 업데이트
        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }
}