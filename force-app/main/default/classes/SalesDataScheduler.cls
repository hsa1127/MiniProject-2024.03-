global class SalesDataScheduler implements Schedulable {
    global void execute(SchedulableContext SC) {
        SalesDataBatch batch = new SalesDataBatch();
        Database.executeBatch(batch, 200); // 여기서 200은 배치 사이즈를 의미합니다. Salesforce 시스템의 제한에 따라 이 값을 조정할 수 있습니다.
    }
}