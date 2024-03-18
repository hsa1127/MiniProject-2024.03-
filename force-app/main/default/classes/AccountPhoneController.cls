public with sharing class AccountPhoneController {
    @AuraEnabled(cacheable=true)
    public static String getAccountPhoneByName(String accountName) {
        Account account = [SELECT Phone FROM Account WHERE Name = :accountName LIMIT 1];
        return account != null ? account.Phone : null;
    }
}