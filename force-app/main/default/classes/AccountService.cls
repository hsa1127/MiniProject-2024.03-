public with sharing class AccountService {
    @AuraEnabled(cacheable=true)
    public static Account getAccountInfo(String accountId) {
        // 입력받은 accountId를 사용하여 해당 Account 정보를 조회합니다.
        return [SELECT Id, Name, Phone FROM Account WHERE Id = :accountId LIMIT 1];
    }
}