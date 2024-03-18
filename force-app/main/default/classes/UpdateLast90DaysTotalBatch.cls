// Salesforce에서 정기적으로 실행할 수 있는 배치 클래스입니다.
public class UpdateLast90DaysTotalBatch implements Database.Batchable<sObject> {
    
    // 배치 작업의 시작 부분입니다. 여기서 처리할 레코드를 선택합니다.
    public Database.QueryLocator start(Database.BatchableContext BC) {
        // Account와 관련된 최근 90일 동안의 주문 이력을 조회합니다.
        return Database.getQueryLocator([
            SELECT Id, (SELECT TotalPrice__c FROM AccHistoryNames__r WHERE OrderDate__c >= :Date.today().addDays(-90)) FROM Account
        ]);
    }
    
    // 선택된 레코드를 실제로 처리하는 부분입니다.
    public void execute(Database.BatchableContext BC, List<Account> scope) {
        // 각 Account의 OrderHistory 레코드를 순회하며 최근 90일간의 총 구매액을 계산합니다.
        for (Account acc : scope) {
            Decimal totalAmount = 0;
            for (OrderHistory__c oh : acc.AccHistoryNames__r) {
                totalAmount += oh.TotalPrice__c;
            }
            // 계산된 총액을 Account의 Last90DaysTotalPrice__c 필드에 저장합니다.
            acc.Last90DaysTotalPrice__c = totalAmount;
        }
        // 계산 후 변경된 Account 레코드를 업데이트합니다.
        update scope;
    }

    // 배치 작업이 완료된 후 실행되는 부분입니다.
    public void finish(Database.BatchableContext BC) {
        // 필요한 경우 완료 후 추가 작업을 구현할 수 있습니다.
    }
}