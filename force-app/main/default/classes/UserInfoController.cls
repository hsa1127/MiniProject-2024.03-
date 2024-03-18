public with sharing class UserInfoController {
    @AuraEnabled(cacheable=true)
    public static String getUserNameById(Id userId) {
        User user = [SELECT UserName FROM User WHERE Id = :userId LIMIT 1];
        return user.UserName;
    }

    @AuraEnabled(cacheable=true)
    public static String getUserNameByName(String userName) {
        User user = [SELECT Id, Name FROM User WHERE Name = :userName LIMIT 1];
        return user.Name;
    }

    @AuraEnabled(cacheable=true)
    public static String getLoggedInUserName() {
        return UserInfo.getName(); // 현재 로그인한 사용자의 이름을 반환합니다.
    }
}