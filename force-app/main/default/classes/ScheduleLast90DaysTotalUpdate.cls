// Salesforce에서 배치 작업을 정기적으로 스케줄링하기 위한 클래스입니다.
public class ScheduleLast90DaysTotalUpdate implements Schedulable {
    // 스케줄러에 의해 호출될 때 실행되는 메소드입니다.
    public void execute(SchedulableContext SC) {
        // UpdateLast90DaysTotalBatch 배치 클래스의 인스턴스를 생성하고 실행합니다.
       Database.executeBatch(new UpdateLast90DaysTotalBatch()); 
    }
}