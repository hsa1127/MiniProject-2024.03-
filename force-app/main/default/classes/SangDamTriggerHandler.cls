public class SangDamTriggerHandler {

    public void handleAfterInsertOrUpdate(List<SangDam__c> newSangDams) {
        Map<String, SangDam__c> validSangDamRecords = new Map<String, SangDam__c>();
        Set<String> phoneNumbers = new Set<String>();
        
        // 개인정보 수집 동의 확인 및 필수 필드 확인
        for (SangDam__c sangDam : newSangDams) {
            if (sangDam.ConsentToCollection__c &&
                !String.isBlank(sangDam.accountName__c) &&
                !String.isBlank(sangDam.phoneNumber__c) &&
                !String.isBlank(sangDam.Email__c)) {
                validSangDamRecords.put(sangDam.phoneNumber__c, sangDam);
                phoneNumbers.add(sangDam.phoneNumber__c);
            }
        }
        
        // 중복 전화번호 체크 및 새 Account 레코드 삽입
        if (!validSangDamRecords.isEmpty()) {
            List<Account> existingAccounts = [SELECT Name, Phone__c FROM Account WHERE Phone__c IN :phoneNumbers];
            Map<String, Account> phoneToAccountMap = new Map<String, Account>();
            for (Account acc : existingAccounts) {
                phoneToAccountMap.put(acc.Phone__c, acc);
            }
    
            for (String phone : validSangDamRecords.keySet()) {
                SangDam__c sangDam = validSangDamRecords.get(phone);
                if (phoneToAccountMap.containsKey(phone)) {
                    Account existingAcc = phoneToAccountMap.get(phone);
                    if (existingAcc.Name != sangDam.AccountName__c) {
                        // 이름이 다를 경우 오류 메시지 생성 및 상담 레코드 생성 방지
                        throw new CustomException('휴대전화 번호 : ' + phone + '는 이미 다른 고객의 번호입니다. 전화번호를 다시 확인해주세요.');
                    }
                    // 이름이 같은 경우는 이미 처리 로직에 의해 상담 레코드가 생성됨
                } else {
                    // 전화번호가 새로운 경우, Account 레코드 생성
                    Account newAccount = new Account(
                        Name = sangDam.AccountName__c,
                        Phone__c = sangDam.PhoneNumber__c,
                        Email__c = sangDam.Email__c
                    );
                    insert newAccount; // 적절한 예외 처리 필요
                }
            }
        }
    }
    
    // 사용자 정의 예외 클래스
    public class CustomException extends Exception {}

    //상담횟수 카운트 Trigger
    private List<SangDam__c> newSangDams;
    private Map<Id, SangDam__c> oldSangDamsMap;
    
    public SangDamTriggerHandler(List<SangDam__c> newSangDams, Map<Id, SangDam__c> oldSangDamsMap) {
        this.newSangDams = newSangDams != null ? newSangDams : new List<SangDam__c>();
        this.oldSangDamsMap = oldSangDamsMap != null ? oldSangDamsMap : new Map<Id, SangDam__c>();
    }
    
    public void processTrigger() {
        Set<String> phoneNumbers = new Set<String>();
    
        if (Trigger.isInsert || Trigger.isUpdate) {
            // Trigger.new를 SangDam__c 타입으로 명시적 캐스팅
            for (SObject obj : Trigger.new) {
                SangDam__c sangDam = (SangDam__c)obj;
                phoneNumbers.add(sangDam.phoneNumber__c);
            }
            if (!phoneNumbers.isEmpty()) {
                updateAccountLeadContentsCnt(phoneNumbers, true); // 삽입 또는 업데이트 시 상담 횟수 증가
            }
        }
        if (Trigger.isDelete) {
            // Trigger.old를 SangDam__c 타입으로 명시적 캐스팅
            for (SObject obj : Trigger.old) {
                SangDam__c sangDam = (SangDam__c)obj;
                phoneNumbers.add(sangDam.phoneNumber__c);
            }
            if (!phoneNumbers.isEmpty()) {
                updateAccountLeadContentsCnt(phoneNumbers, false); // 삭제 시 상담 횟수 감소
            }
        }
    }

    // 전화번호 형식을 검증하는 메서드
    private boolean isValidPhoneNumberFormat(String phoneNumber) {
        // 휴대전화: 010-0000-0000
        // 서울 지역번호: 02-000-0000
        // 기타 지역번호: 031-000-0000, 032-000-0000 등
        Pattern pattern = Pattern.compile('^(010-\\d{4}-\\d{4})|(02-\\d{3,4}-\\d{4})|(0[3-6][0-9]-\\d{3,4}-\\d{4})$');
        Matcher matcher = pattern.matcher(phoneNumber);
        return matcher.matches();
    }
    
    public void handleAfterInsertOrUpdate() {
        Set<String> phoneNumbersToUpdate = new Set<String>();
        List<Account> newAccountsToCreate = new List<Account>();
        Map<String, SangDam__c> phoneToSangDamMap = new Map<String, SangDam__c>();
    
        if (newSangDams != null) {
            for (SangDam__c sangDam : newSangDams) {
                SangDam__c oldSangDam = oldSangDamsMap != null ? oldSangDamsMap.get(sangDam.Id) : null;
    
                // 전화번호가 유효한 형식인지 확인
                if (sangDam.phoneNumber__c != null && !isValidPhoneNumberFormat(sangDam.phoneNumber__c)) {
                    // 유효하지 않은 형식의 전화번호가 입력된 경우, 처리하지 않고 다음 레코드로 넘어가게
                    continue;
                }
    
                // 조건에 따라 전화번호를 업데이트해야 하는 경우를 식별
                if (shouldUpdateLeadContentsCnt(sangDam, oldSangDam)) {
                    phoneNumbersToUpdate.add(sangDam.phoneNumber__c);
                }
    
                // 새로운 Account 생성 조건을 확인
                if (isNewAccountRequired(sangDam, oldSangDam)) {
                    Account newAccount = new Account(
                        Name = sangDam.AccountName__c,
                        Phone__c = sangDam.PhoneNumber__c,
                        Email__c = sangDam.Email__c
                    );
                    newAccountsToCreate.add(newAccount);
                    phoneToSangDamMap.put(sangDam.phoneNumber__c, sangDam);
                }
            }
        }
    
        // 새로운 Account 레코드들을 생성
        if (!newAccountsToCreate.isEmpty()) {
            insert newAccountsToCreate;
            // 새로 생성된 Account에 대해 상담 횟수를 증가
            updateAccountLeadContentsCntForNewAccounts(newAccountsToCreate, phoneToSangDamMap);
        }
    
        // 기존 Account 레코드들의 상담 횟수를 업데이트
        if (!phoneNumbersToUpdate.isEmpty()) {
            updateAccountLeadContentsCnt(phoneNumbersToUpdate);
        }
    }
    
    private boolean isNewAccountRequired(SangDam__c newSangDam, SangDam__c oldSangDam) {
        // 여기에 새로운 Account가 필요한 조건을 구현
        // 예: 이름, 전화번호 또는 이메일이 처음 입력되었는지 확인
        return oldSangDam == null || (
            (String.isBlank(oldSangDam.AccountName__c) && !String.isBlank(newSangDam.AccountName__c)) ||
            (String.isBlank(oldSangDam.PhoneNumber__c) && !String.isBlank(newSangDam.PhoneNumber__c)) ||
            (String.isBlank(oldSangDam.Email__c) && !String.isBlank(newSangDam.Email__c))
        );
    }
    
    private void updateAccountLeadContentsCntForNewAccounts(List<Account> newAccounts, Map<String, SangDam__c> phoneToSangDamMap) {
        // 새로 생성된 Account 레코드에 대해 상담 횟수를 1 증가
        Set<String> phoneNumbers = phoneToSangDamMap.keySet();
        updateAccountLeadContentsCnt(phoneNumbers, true); // 상담 횟수를 증가시키는 로직을 호출
    }

    private boolean shouldUpdateLeadContentsCnt(SangDam__c newSangDam, SangDam__c oldSangDam) {
        boolean phoneNumberChanged = oldSangDam == null || (newSangDam.phoneNumber__c != null && !newSangDam.phoneNumber__c.equals(oldSangDam.phoneNumber__c));
        boolean emailChanged = oldSangDam == null || (newSangDam.Email__c != null && !newSangDam.Email__c.equals(oldSangDam.Email__c));
        boolean nameChanged = oldSangDam == null || (newSangDam.AccountName__c != null && !newSangDam.AccountName__c.equals(oldSangDam.AccountName__c));
        
        return phoneNumberChanged || emailChanged || nameChanged;
    }

    private void updateAccountLeadContentsCnt(Set<String> phoneNumbers) {
        updateAccountLeadContentsCnt(phoneNumbers, true); // 기본적으로 increment를 true로 설정
    }

    private void updateAccountLeadContentsCnt(Set<String> phoneNumbers, Boolean increment) {
        List<Account> accountsToUpdate = new List<Account>();
        for (Account acc : [SELECT Id, Phone__c, LeadContentsCnt__c FROM Account WHERE Phone__c IN :phoneNumbers]) {
            // increment가 true이면 1을 증가, false이면 1을 감소
            Integer change = increment ? 1 : -1;
            Integer currentCount = (acc.LeadContentsCnt__c != null ? acc.LeadContentsCnt__c.intValue() : 0);
            Integer newCount = currentCount + change;
            // 상담 횟수가 음수가 되지 않도록 합니다.
            acc.LeadContentsCnt__c = Math.max(newCount, 0);
            accountsToUpdate.add(acc);
        }
    
        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate; // 
        }
    }
}