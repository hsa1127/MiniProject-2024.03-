trigger SetSangdamBranch on SangDam__c (before insert) {
    Set<Id> userIds = new Set<Id>();
    for (SangDam__c sd : Trigger.new) {
        userIds.add(sd.OwnerId); // 상담 레코드의 소유자 ID를 수집합니다.
    }
    
    Map<Id, User> users = new Map<Id, User>([SELECT Id, Department FROM User WHERE Id IN :userIds]);
    // 여기서 Department 필드는 사용자가 속한 지점을 나타냅니다. 
    // 이 필드는 실제 Salesforce 환경에 맞게 조정해야 할 수 있습니다.

    for (SangDam__c sd : Trigger.new) {
        if (users.containsKey(sd.OwnerId)) {
            User owner = users.get(sd.OwnerId);
            sd.StoreName__c = owner.Department; // 사용자의 '부서'를 상담지점으로 설정합니다.
        }
    }
}