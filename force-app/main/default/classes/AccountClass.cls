public with sharing class AccountClass { //홈 본사에서 보는 Showaccout 컴포넌트에 띄울 메서드
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchTextClass){
        try{
            if(String.isEmpty(searchTextClass))
            {
            return [SELECT Id, Name, Phone__c FROM Account];
            }
            else {
                {
                    searchTextClass = '%' + searchTextClass + '%';
                    return [ SELECT Id, Name, Phone__c FROM Account WHERE Phone__c Like : searchTextClass];
                }
            }
        } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Account>  getAccountInfo(String accountId){
        try {
            return [SELECT Id, Name, Phone__c, SupportTier__c,FirstBranch__r.Name,TotalPrice__c   FROM Account WHERE Id = : accountId ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}