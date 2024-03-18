public with sharing class SangDamController {
    @AuraEnabled(cacheable=true)
    public static List<SangDam__c> getSangDams(String customerName) {
        if (String.isNotBlank(customerName)) {
            return [SELECT Id, AccountName__c, SangDamDate__c, SangDamProgress__c, SangdamDescription__c, ProductList__c
                    FROM SangDam__c
                    WHERE AccountName__c LIKE :('%' + customerName + '%')];
        } else {
            return [SELECT Id, AccountName__c,  SangDamDate__c, SangDamProgress__c, SangdamDescription__c, productlist__c
                    FROM SangDam__c];
        }
    }

    @AuraEnabled
    public static SangDam__c updateSangDam(SangDam__c updatedSangDam) {
        try {
            update updatedSangDam;
            return updatedSangDam;
        } catch (Exception e) {
            throw new AuraHandledException('Update Error: ' + e.getMessage());
        }
    }
        @AuraEnabled(cacheable=true)
        public static List<SangDam__c> getSangDamRecordsMatchingAccountName(Id accountId) {
            List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id = :accountId];
            if (!accounts.isEmpty()) {
                String accountName = accounts[0].Name;
                
                return [
                    SELECT Id, Name, SangDamDate__c, SangDamProgress__c, StoreName__c, 
                           ProductList__c, Email__c, PhoneNumber__c
                    FROM SangDam__c 
                    WHERE AccountName__c = :accountName
                ];
            }
            return new List<SangDam__c>();
        }
    }