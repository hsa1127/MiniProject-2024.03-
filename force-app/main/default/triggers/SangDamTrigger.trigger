trigger SangDamTrigger on SangDam__c (after insert, after update, after delete) {
    SangDamTriggerHandler handler = new SangDamTriggerHandler(Trigger.new, Trigger.oldMap);

    if (Trigger.isInsert || Trigger.isUpdate) {
        handler.handleAfterInsertOrUpdate(Trigger.new); 
    }

    if (Trigger.isInsert || Trigger.isDelete) {
        handler.processTrigger();
    }
}