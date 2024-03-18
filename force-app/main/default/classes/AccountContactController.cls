public with sharing class AccountContactController {
    @AuraEnabled(cacheable=true)
    public static String getContactPhone(String accountId) {
        // 계정 ID를 기준으로 연락처 정보 조회
        Account account = [SELECT Phone FROM Account WHERE Name = :accountId LIMIT 1];
        return account != null ? account.Phone : null;
    }
}