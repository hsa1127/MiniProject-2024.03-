public class TriggerHandler {
    private static Set<String> hasRun = new Set<String>();

    public static boolean runOnce(String triggerName) {
        if (!hasRun.contains(triggerName)) {
            hasRun.add(triggerName);
            return true;
        } else {
            return false;
        }
    }
}