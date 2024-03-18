public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static String getPhoneByAccountId(Id accountId) {
        try {
            Account account = [SELECT Id, Phone__c, SupportTier__c FROM Account WHERE Id = :accountId];
            return account.Phone__c;
        } catch (QueryException e) {
            // 쿼리 중 발생한 예외를 처리
            System.debug('QueryException: ' + e.getMessage());
            return null; 
        } catch (Exception e) {
            // 그 외 예외 처리
            System.debug('Exception: ' + e.getMessage());
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchKeyword) {
        if (String.isNotBlank(searchKeyword)) {
            return [SELECT Id, Name, Phone__c, SupportTier__c, AccountType__c, Email__c, FirstBranch__c, TotalPrice__c, Last90DaysTotalPrice__c FROM Account WHERE Name LIKE :('%'+searchKeyword+'%')];
        } else {
            return [SELECT Id, Name, Phone__c, SupportTier__c, AccountType__c, Email__c, FirstBranch__c, TotalPrice__c, Last90DaysTotalPrice__c FROM Account];
        }
    }
    
    @AuraEnabled
    public static void updateContactPhone(String accountId, String phone) {
        Account account = [SELECT Id, Phone__c FROM Account WHERE Id = :accountId LIMIT 1];
        account.Phone__c = phone;
        update account;
    }

    }