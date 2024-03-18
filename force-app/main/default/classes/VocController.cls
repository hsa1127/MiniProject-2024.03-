public with sharing class VocController {

    @AuraEnabled(cacheable=true)
    public static List<Voc__c> getVocs() {
        // VoC 모델의 API 이름과 필드가 정확히 일치하는지 확인하세요.
        return [SELECT Id, AccountId__c, VoCProgress__c, VoCType__c, Product__c FROM Voc__c];
    }
}