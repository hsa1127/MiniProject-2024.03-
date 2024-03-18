public with sharing class OrderService {
    
    // 제품 목록 조회 메소드
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts() {
        // 모든 제품 정보 조회 SOQL 쿼리
        return [SELECT Id, Name, UnitPrice__c, ProductCode__c, ProductType__c FROM Product__c];
    }    

    // 특정 제품의 상세 정보 조회 메소드
    @AuraEnabled(cacheable=true)
    public static Product__c getProductDetail(Id productId) {
        // 제품 ID를 기반으로 한 제품 상세 정보 조회 SOQL 쿼리
        return [SELECT Id, Name, UnitPrice__c, ProductCode__c, ProductType__c FROM Product__c WHERE Id = :productId LIMIT 1];
    }

    // 주문 생성 메소드
    @AuraEnabled
    public static void createOrder(string accountId, List<String> productIds, List<Integer> quantities, Decimal discountPercent, Date orderDate) {

        // getUserRoleId() 컨텍스트 사용자의 역할 ID를 반환합니다. 
        // UserRole uRole = [SELECT Name FROM UserRole WHERE Id = :UserInfo.getUserRoleId()];
        // String currentUserName = UserInfo.getName();

        // 현재 사용자의 정보 조회
        String currentUserId = UserInfo.getUserId();

        // 현재 사용자의 역할 이름 조회
        String currentUserRoleName = [SELECT Name FROM UserRole WHERE Id = :UserInfo.getUserRoleId()].Name;
        Branch__c matchingBranch;

        String adminRoleName = 'System Admin';

        // 사용자 역할에 따라 다른 처리 로직 적용
        if (currentUserRoleName == adminRoleName) {
            // 관리자의 경우, 특정 판매점 할당
            matchingBranch = [SELECT Id, Name FROM Branch__c WHERE Id = 'a01IR00001fVDQ3YAO' LIMIT 1];
        } else {
            // 일반 사용자의 경우, 사용자에게 할당된 판매점 조회
            matchingBranch = [SELECT Id FROM Branch__c WHERE SalesRep__c = :currentUserId  LIMIT 1];
        }

        // 판매정보를 입력한 고객의 정보
        Account accountInfo = [SELECT Id, Name, Phone__c FROM Account WHERE Id = :accountId LIMIT 1];

        // 주문 상세 및 가격 계산 로직
        Decimal totalAmount = 0;
        List<String> orderDetail = new List<String>();

        for(Integer i = 0; i < productIds.size(); i++) {
            Id productId = productIds[i];
            Integer quantity = quantities[i];

            Product__c product = [SELECT Id, Name, UnitPrice__c, ProductType__c FROM Product__c WHERE Id = :productId LIMIT 1];

            String formattedPrice = formatCurrency(product.UnitPrice__c);

            String detail = product.Name + ' (' + formattedPrice + ') - 수량: ' + quantities[i];
            orderDetail.add(detail);

            totalAmount += product.UnitPrice__c * quantity;
        }

        // 할인 계산 및 최종 금액 계산
        Decimal discountAmount = totalAmount * (discountPercent / 100);
        Decimal finalAmount = totalAmount - discountAmount;

        // 주문 내역 정보 합치기
        String orderLists = String.join(orderDetail, ', \n');

        String saleCompletedStatus = '판매완료'; // 상태 값을 변수에 할당

        // 주문 내역 레코드 생성 및 저장
        List<OrderHistory__c> newOH = new List<OrderHistory__c>();
        OrderHistory__c oh = new OrderHistory__c(
             // 주문 내역 필드 값 할당
            OrderDate__c = orderDate,
            OrderDetail__c = orderLists,
            BeforeDiscount__c = totalAmount,
            TotalPrice__c = finalAmount,
            DiscountPercent__c = discountPercent,
            DiscountPrice__c = discountAmount,
            SalesBranch__c = matchingBranch.Id,
            AccountName__c = accountInfo.Id,
            AccountPhone__c = accountInfo.Phone__c,
            SaleStatus__c = saleCompletedStatus
        );
        newOH.add(oh);

        insert newOH; 


        String salePCompletedStatus = '판매완료';

        // 판매등록 후 동시에 제품별 주문 레코드 생성 및 저장 로직
        List<OrderProduct__c> newOP = new List<OrderProduct__c>();
        // 반복문 내 제품 정보 조회 및 OrderProduct__c 레코드 생성
        for(Integer i = 0; i < productIds.size(); i++) {
            Id productId = productIds[i];
            Integer quantity = quantities[i]; // 이 수량만큼 OrderProduct__c 레코드 생성

            // 제품 정보 조회
            Product__c product = [SELECT Id, Name, UnitPrice__c, ProductType__c, ProductCode__c FROM Product__c WHERE Id = :productId LIMIT 1];
            
            // 각 제품마다 수량만큼 OrderProduct__c 레코드 생성
            for (Integer q = 0; q < quantity; q++) {
                OrderProduct__c op = new OrderProduct__c();
                op.OrderNumber__c = oh.Id; // OrderHistory__c 레코드의 ID
                op.Name = product.Name; // 제품 이름
                op.ProductQuantity__c = 1; // 요구사항에 따라 각 레코드의 수량은 1로 설정
                op.UnitPrice__c = product.UnitPrice__c;
                op.ProductType__c = product.ProductType__c;
                op.ProductCode__c = product.ProductCode__c;
                op.SalePStatus__c = salePCompletedStatus;
                newOP.add(op);
            }
        }

        if (!newOP.isEmpty()) {
            insert newOP; // 생성된 OrderProduct__c 레코드 저장
        }
    }

    // 금액을 포맷하는 유틸리티 메소드
    private static String formatCurrency(Decimal amount) {
        // 금액 포맷 로직
        return '₩' + amount.setScale(0).format();
    }


}