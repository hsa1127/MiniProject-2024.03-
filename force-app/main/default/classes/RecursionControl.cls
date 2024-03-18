public class RecursionControl { //updateTotalPriceFromRefunds의 일반적으로 트리거가 너무 많은 횟수로 재귀적으로 호출되었을 때 발생합니다.
    // Salesforce에서는 하나의 실행 컨텍스트 내에서 하나의 오브젝트에 대한 트리거가 최대 16번까지만 재귀적으로 호출될 수 있습니다.
    public static Boolean processingAlready = false;
}