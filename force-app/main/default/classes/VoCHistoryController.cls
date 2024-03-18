public with sharing class VoCHistoryController {
    @AuraEnabled(cacheable=true)
    public static List<VoC__c> getVoCHistory(Id accountId) {
        return [SELECT CreatedDate__c, VoCType__c, Product__c, Description__c FROM VoC__c ];
        }

        @AuraEnabled(cacheable=true)
        public static List<VoC__c> getVoCs(Id accountId) {
            // accountId를 사용하여 특정 계정에 대한 상담 내역만 조회하도록 쿼리를 수정합니다.
            return [SELECT Id, AccountId__c, CreatedDate, VoCType__c, Product__c, Description__c
                    FROM VoC__c 
                    WHERE AccountId__c = :accountId
                    ORDER BY CreatedDate DESC]; // 최신 상담 내역부터 보여주도록 정렬
        }

        @AuraEnabled(cacheable=true)
        public static List<VoC__c> getVoCRecords(String customerName) {
            if(String.isBlank(customerName)) {
                return [SELECT Id, AccountId__r.Name, CreatedDate, VoCType__c, Product__c, Description__c FROM VoC__c];
            } else {
                return [SELECT Id, AccountId__r.Name, CreatedDate, VoCType__c, Product__c, Description__c
                        FROM VoC__c
                        WHERE AccountId__r.Name LIKE :('%' + customerName + '%')];
            }
        }

        @AuraEnabled(cacheable=true)
        public static List<VoC__c> getVoCDatas(String customerName) {
            if (String.isEmpty(customerName)) {
                // 고객명 검색어가 빈 경우 모든 VoC 레코드를 반환
                return [SELECT AccountId__r.Name, CreatedDate, VoCType__c, Product__c FROM VoC__c];
            } else {
                // 고객명 검색어가 있을 경우 검색 조건에 맞는 레코드만 반환
                return [SELECT AccountId__r.Name, CreatedDate, VoCType__c, Product__c FROM VoC__c WHERE AccountId__r.Name = :customerName];
            }
        }

        @AuraEnabled
        public static void updateVoC(VoC__c voc) {
            update voc; // 받은 VoC 객체를 업데이트합니다.
        }

        @AuraEnabled
    public static VoC__c saveVoCDetails(VoC__c voc) {
        try {
            upsert voc;
            return voc;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}