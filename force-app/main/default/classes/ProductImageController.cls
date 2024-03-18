public with sharing class ProductImageController {
    @AuraEnabled(cacheable=true)
    public static String getProductImage(Id productId) {
        // ContentDocumentLink를 사용하여 연결된 ContentDocumentId를 찾기
        ContentDocumentLink cdl = [
            SELECT ContentDocumentId 
            FROM ContentDocumentLink 
            WHERE LinkedEntityId = :productId 
            LIMIT 1
        ];
        if(cdl == null) {
            return null;
        }

        // ContentDocument로부터 ContentVersionId를 찾기
        ContentVersion cv = [
            SELECT Id, ContentDocumentId 
            FROM ContentVersion 
            WHERE ContentDocumentId = :cdl.ContentDocumentId 
            AND IsLatest = true 
            LIMIT 1
        ];

        // ContentDistribution 객체 생성 및 초기화
        ContentDistribution cd = new ContentDistribution();
        cd.Name = 'Public Image Distribution';
        cd.ContentVersionId = cv.Id;
        cd.PreferencesAllowViewInBrowser = true;
        cd.PreferencesLinkLatestVersion = true;
        cd.PreferencesNotifyOnVisit = false;
        cd.PreferencesPasswordRequired = false;
        cd.PreferencesAllowOriginalDownload = true;

        insert cd;

        // ContentDistribution을 생성한 후, 공개 URL 조회
        ContentDistribution dist = [
            SELECT DistributionPublicUrl 
            FROM ContentDistribution 
            WHERE Id = :cd.Id 
            LIMIT 1
        ];

        return dist.DistributionPublicUrl;
    }
}