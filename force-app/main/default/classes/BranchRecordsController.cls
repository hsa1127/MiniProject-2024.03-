public with sharing class BranchRecordsController {
    @AuraEnabled(cacheable=true)
    public static List<Branch__c> getBranchRecordsForCurrentUser() {
        // 현재 로그인한 사용자의 Id 가져오기
        Id currentUserId = UserInfo.getUserId();
        
        // 현재 사용자와 일치하는 판매사원(SalesRep__c)이 있는 Branch__c 레코드 조회
        return [SELECT Id, Name, SalesRep__c FROM Branch__c WHERE SalesRep__c = :currentUserId];
    }
}