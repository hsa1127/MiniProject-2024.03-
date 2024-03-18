public with sharing class CustomerProductsController {
    public class OrderProductWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String productName;
        @AuraEnabled public String productSerialCode;
        @AuraEnabled public Decimal unitPrice;
        @AuraEnabled public String orderNumberName; // 주문 번호 이름을 저장하는 필드
        
        // 래퍼 클래스 생성자
        public OrderProductWrapper(OrderProduct__c op) {
            this.id = op.Id;
            this.productName = op.Name;
            this.productSerialCode = op.SerialCode__c;
            this.unitPrice = op.UnitPrice__c;
            this.orderNumberName = op.OrderNumber__r.Name;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderProductWrapper> getCustomerProducts(Id accountId) {
        List<OrderProductWrapper> wrappers = new List<OrderProductWrapper>();
        for (OrderProduct__c op : [
            SELECT Id, Name, UnitPrice__c, SerialCode__c, OrderNumber__c, OrderNumber__r.Name
            FROM OrderProduct__c
            WHERE OrderNumber__r.AccountName__c = :accountId
            AND OrderNumber__r.SaleStatus__c = '판매완료' // 판매완료된 주문만 선택
        ]) {
            wrappers.add(new OrderProductWrapper(op));
        }
        return wrappers;
    }
}