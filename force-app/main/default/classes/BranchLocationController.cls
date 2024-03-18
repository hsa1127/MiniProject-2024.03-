public with sharing class BranchLocationController {
    @AuraEnabled(cacheable=true)
    public static Branch__c getFirstBranchLocation(Id accountId) {
        // Account 레코드에서 FirstBranch__c lookup 필드를 통해 Branch__c 레코드 조회
        Account accountRecord = [SELECT FirstBranch__r.Name, 
                                        FirstBranch__r.City__c, 
                                        FirstBranch__r.Country__c, 
                                        FirstBranch__r.Street__c, 
                                        FirstBranch__r.PostalCode__c, 
                                        FirstBranch__r.wido__Latitude__s, 
                                        FirstBranch__r.wido__Longitude__s 
                                 FROM Account WHERE Id = :accountId LIMIT 1];
        
        // Branch__c 레코드가 있으면 반환, 없으면 null 반환
        if (accountRecord.FirstBranch__r != null) {
            return accountRecord.FirstBranch__r;
        }
        return null;
    }

    @AuraEnabled(cacheable=true)
    public static Branch__c getBranchLocation(Id branchId) {
        // Branch__c 레코드 조회
        Branch__c branchRecord = [SELECT Name, 
                                        City__c, 
                                        Country__c, 
                                        Street__c, 
                                        PostalCode__c, 
                                        wido__Latitude__s, 
                                        wido__Longitude__s 
                                 FROM Branch__c WHERE Id = :branchId LIMIT 1];
        return branchRecord;
    }
}