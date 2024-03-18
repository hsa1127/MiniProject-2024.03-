// Apex 클래스 선언, 'with sharing' 키워드는 호출자의 데이터 접근 권한을 적용
public with sharing class ProductDataService {
    
    // 제품 목록을 반환하는 메소드, 제품 유형 ID를 옵셔널 파라미터로 받음
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(String productTypeId) {
        // 기본 SOQL 쿼리 문자열 생성
        String query = 'SELECT '
                    + 'Name, ProductType__c, ProductCode__c, '
                    + 'UnitPrice__c, Image_Url__c '
                    + 'FROM Product__c';
        // 제품 유형 ID가 제공되면, 쿼리에 WHERE 절 추가
        if (String.isNotBlank(productTypeId)) {
            query += ' WHERE ProductType__c = :productTypeId';
        }
        // 동적 쿼리 실행 후 결과 반환
        return Database.query(query);
    }

    // 사용 가능한 모든 제품 유형을 반환하는 메소드
    @AuraEnabled(cacheable=true)
    public static List<String> getProductTypes() {
        // 제품 유형을 저장할 리스트 초기화
        List<String> productTypes = new List<String>();
        // 제품 유형별로 그룹화된 집계 쿼리 실행
        for (AggregateResult ar : [SELECT ProductType__c FROM Product__c GROUP BY ProductType__c]) {
            // 각 집계 결과에서 제품 유형을 추출하여 리스트에 추가
            productTypes.add((String)ar.get('ProductType__c'));
        }
        return productTypes;
    }

    // 특정 제품 유형에 해당하는 제품 목록을 반환하는 메소드
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProductsByType(String productType) {
        // 제품 유형을 기준으로 제품 조회, 결과는 이름으로 오름차순 정렬
        return [SELECT Id, Name, ProductType__c FROM Product__c WHERE ProductType__c = :productType ORDER BY Name LIMIT 10];
    }

    // 특정 제품 ID로 단일 제품을 조회하는 메소드
    @AuraEnabled(cacheable=true)
    public static List<Product__c> searchProducts(String productId) {
        // 제품 ID를 기준으로 단일 제품 정보 조회, LIMIT 1로 결과를 한 개로 제한
        return [SELECT Id, Name, ProductType__c, Image_Url__c FROM Product__c WHERE Id = :productId LIMIT 1];
    }
}