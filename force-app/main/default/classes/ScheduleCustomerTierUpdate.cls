// 고객 등급 업데이트 배치 작업을 스케줄링하기 위한 클래스입니다.
public class ScheduleCustomerTierUpdate implements Schedulable {
    // 이 메서드는 스케줄러에 의해 호출될 때 실행됩니다.
    public void execute(SchedulableContext SC) {
        // UpdateCustomerTierBatch 배치 클래스를 실행합니다.
        Database.executeBatch(new UpdateCustomerTierBatch());
    }
}