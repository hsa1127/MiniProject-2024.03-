trigger OrderHistoryTrigger on OrderHistory__c (after insert) {
    AccountFirstBranchManager.updateFirstBranch(Trigger.new);
}