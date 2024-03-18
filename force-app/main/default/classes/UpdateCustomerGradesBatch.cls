public class UpdateCustomerGradesBatch implements Database.Batchable<sObject> {
    // 이 배치 클래스는 모든 Account에 대해서 실행됩니다.
    public Database.QueryLocator start(Database.BatchableContext BC) {
        // 최근 90일 동안의 구매 이력이 있는 모든 고객을 조회합니다.
        return Database.getQueryLocator([
            SELECT Id, Last90DaysTotalPrice__c FROM Account
        ]);
    }

    public void execute(Database.BatchableContext BC, List<Account> scope) {
        // 사용자 정의 메타데이터에서 등급 기준을 가져옵니다.
        List<CustomerTier__mdt> tiers = [SELECT MasterLabel, MinimumSpending__c FROM CustomerTier__mdt];
        
        // Account 리스트를 업데이트합니다.
        List<Account> accountsToUpdate = new List<Account>();
        
        // 각 Account에 대하여
        for (Account acc : scope) {
            String newGrade = 'D'; // 기본 등급은 'D'입니다.
            // 각 등급 기준에 따라
            for (CustomerTier__mdt tier : tiers) {
                // 최근 90일 동안의 구매 금액이 등급의 최소 구매 금액보다 크거나 같은 경우
                if (acc.Last90DaysTotalPrice__c >= tier.MinimumSpending__c) {
                    newGrade = tier.MasterLabel; // 새 등급을 할당합니다.
                    break; // 더 높은 등급을 찾지 않습니다.
                }
            }
            // 등급이 변경되었는지 확인하고, 변경된 경우에만 업데이트 목록에 추가합니다.
            if (acc.SupportTier__c != newGrade) {
                acc.SupportTier__c = newGrade;
                accountsToUpdate.add(acc);
            }
        }
        
        // 변경된 Account 정보를 업데이트합니다.
        update accountsToUpdate;
    }

    public void finish(Database.BatchableContext BC) {
        // 이메일 알림 보내기
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] {'ssookkdduugg@gmail.com'}); // 실제 이메일 주소로 변경
        mail.setSubject('Customer Grade Update Batch Finished');
        mail.setPlainTextBody('The batch process for updating customer grades has been completed.');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
    
}