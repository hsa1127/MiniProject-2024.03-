public class CustomerTierScheduler implements Schedulable {
    public void execute(SchedulableContext SC) {
        // 여기서 UpdateCustomerGradesBatch의 인스턴스를 생성하여 넘겨줍니다.
        Database.executeBatch(new UpdateCustomerGradesBatch());
    }
}