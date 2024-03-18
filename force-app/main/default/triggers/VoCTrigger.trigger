trigger VoCTrigger on VoC__c (before insert, before update, after insert, after delete) {
    Map<Id, Integer> accountIdToVoCCount = new Map<Id, Integer>();

    if (Trigger.isBefore) {
        for (VoC__c voc : Trigger.new) {
            // `before insert` 컨텍스트에서 생성 날짜 및 상담 종료일 설정
            if (Trigger.isInsert) {
                voc.CreatedDate__c = Date.today(); // 항상 생성 날짜를 설정

                // 상담 진행 현황이 '상담종료'인 경우, 상담 마감일 필드에도 현재 날짜 설정
                if ('상담종료' == voc.VoCProgress__c) {
                    voc.ClosedDate__c = Date.today();
                }
            }

            // `before update` 컨텍스트에서 상담 마감일 설정
            if (Trigger.isUpdate) {
                VoC__c oldVoc = Trigger.oldMap.get(voc.Id);
                // 이전 상태가 '상담종료'가 아니고, 새로운 상태가 '상담종료'인 경우
                if ('상담종료' != oldVoc.VoCProgress__c && '상담종료' == voc.VoCProgress__c) {
                    voc.ClosedDate__c = Date.today(); // 상담 마감일 필드에 현재 날짜 설정
                }
            }
        }
    }

    // after insert 및 after delete 컨텍스트에서 VoCCount__c 필드 업데이트 로직
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            for (VoC__c voc : Trigger.new) {
                if (voc.AccountId__c != null) {
                    accountIdToVoCCount.put(voc.AccountId__c, accountIdToVoCCount.get(voc.AccountId__c) == null ? 1 : accountIdToVoCCount.get(voc.AccountId__c) + 1);
                }
            }
        } else if (Trigger.isDelete) {
            for (VoC__c voc : Trigger.old) {
                if (voc.AccountId__c != null) {
                    accountIdToVoCCount.put(voc.AccountId__c, accountIdToVoCCount.get(voc.AccountId__c) == null ? -1 : accountIdToVoCCount.get(voc.AccountId__c) - 1);
                }
            }
        }

        // Account 레코드 조회 및 업데이트
        List<Account> accountsToUpdate = [SELECT Id, VoCCount__c FROM Account WHERE Id IN :accountIdToVoCCount.keySet()];
        for (Account acc : accountsToUpdate) {
            acc.VoCCount__c = (acc.VoCCount__c == null ? 0 : acc.VoCCount__c) + accountIdToVoCCount.get(acc.Id);
        }
        update accountsToUpdate;
    }
}