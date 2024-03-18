trigger UpdateCustomerGrade on Account (before update) {
    for (Account acc : Trigger.new) {
        // 기존 값과 새로운 값을 비교하여 변경된 경우에만 등급을 업데이트
        if (Trigger.oldMap.get(acc.Id).Last90DaysTotalPrice__c != acc.Last90DaysTotalPrice__c) {
            // Custom Metadata Types을 사용하여 등급 기준을 가져옵니다.
            List<CustomerTier__mdt> tiers = [SELECT MasterLabel, MinimumSpending__c FROM CustomerTier__mdt ORDER BY MinimumSpending__c DESC];
            // 새로운 등급을 결정합니다.
            for (CustomerTier__mdt tier : tiers) {
                if (acc.Last90DaysTotalPrice__c >= tier.MinimumSpending__c) {
                    acc.SupportTier__c = tier.MasterLabel;
                    break;
                }
            }
        }
    }
}