public with sharing class ProductService {
    @AuraEnabled
    public static String createOrder(String accountId, String orderJson){

		try {
			UserRole userRole = [SELECT Name FROM UserRole WHERE Id = :UserInfo.getUserRoleId()];
			Account matchingAccount = [SELECT Id FROM Account WHERE Name = :userRole.Name LIMIT 1];
			Account accountInfo = [SELECT Phone FROM Account WHERE Id = :accountId LIMIT 1];

            // 직렬화된 JSON 문자열을 기반으로 OrderData 객체를 파싱합니다.
            OrderData orderData = (OrderData) JSON.deserialize(orderJson, OrderData.class);


            // OrderHistory__c 레코드를 생성하고 필수 필드를 설정합니다.
            OrderHistory__c ord = new OrderHistory__c(
                TotalPrice__c = orderData.totalPrice,
                OrderDetail__c = orderData.orderDetail,
                AccountName__c = orderData.accountName,
                AccountPhone__c = orderData.accountPhone
            );
            insert ord; // 생성한 레코드를 삽입합니다.

            List<OrderProduct__c> oliList = new List<OrderProduct__c>();

            for(ProductOrderWrapper product : orderData.products){
                OrderProduct__c oli = new OrderProduct__c(
                    OrderNumber__c = ord.Id, // 'OrderHistory__c'와의 Lookup 관계를 설정
                    Name = product.Name,
                    UnitPrice__c = product.price,
                    ProductQuantity__c = product.quantity,
                    ProductCode__c = product.code,
                    ProductType__c = product.type
                );
                oliList.add(oli);
            }

            insert oliList; // 생성한 OrderProduct__c 레코드 리스트를 삽입합니다.
            
            return ord.Id;
        
        } catch(Exception e) {
            // 에러를 잡아서 에러 메시지를 반환합니다.
            return 'Error: ' + e.getMessage();
        }
    }

    // 주문과 관련된 모든 데이터를 포함하는 복합 객체를 정의합니다.
    public class OrderData {
        @AuraEnabled
        public List<ProductOrderWrapper> products;
        @AuraEnabled
        public Decimal totalPrice;
        @AuraEnabled
        public String orderDetail;
        @AuraEnabled
        public String accountName;
        @AuraEnabled
        public String accountPhone;
    }

    public class ProductOrderWrapper {
        @AuraEnabled
        public String Id;
        @AuraEnabled
        public Decimal price;
        @AuraEnabled
        public Integer quantity;
        @AuraEnabled
        public String Name;
        @AuraEnabled
        public String code;
        @AuraEnabled
        public String type;
    }
}