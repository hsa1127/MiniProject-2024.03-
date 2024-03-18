// 고객 등급을 업데이트하기 위한 배치 클래스입니다.
public class UpdateCustomerTierBatch implements Database.Batchable<sObject>, Database.Stateful {
    
    // 이 메서드는 배치 작업이 시작할 때 호출됩니다.
    public Database.QueryLocator start(Database.BatchableContext BC) {
        // 모든 Account 레코드를 선택합니다. 필요에 따라 쿼리를 조정할 수 있습니다.
        return Database.getQueryLocator([
            SELECT Id, Last90DaysTotalPrice__c, SupportTier__c FROM Account
        ]);
    }
    
    // 실제 Account 레코드를 처리하는 메서드입니다.
    public void execute(Database.BatchableContext BC, List<Account> scope) {
        // CustomerTier__mdt에서 등급 기준을 조회합니다.
        List<CustomerTier__mdt> tiers = [SELECT MasterLabel, MinimumSpending__c FROM CustomerTier__mdt ORDER BY MinimumSpending__c DESC];
        // 각 Account에 대해 적절한 고객 등급을 결정합니다.
        for (Account acc : scope) {
            for (CustomerTier__mdt tier : tiers) {
                if (acc.Last90DaysTotalPrice__c >= tier.MinimumSpending__c) {
                    acc.SupportTier__c = tier.MasterLabel;
                    break;
                }
            }
        }
        // 변경된 등급으로 Account 레코드를 업데이트합니다.
        update scope;
    }

    // 배치 작업이 완료된 후 호출되는 메서드입니다.
    public void finish(Database.BatchableContext BC) {
        // 필요한 경우 완료 후 추가 작업을 구현할 수 있습니다.
    }
}