import { LightningElement,api , wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountClass.getAccounts';
import { MessageContext, publish } from 'lightning/messageService'; //메세지 서비스 관련기능 가져오기
import hsa from '@salesforce/messageChannel/hsa__c'; //메세지 채널가져오기

export default class AccountChild2 extends LightningElement {
    @api searchTextChild2; //부모컴포넌트에서 값을 받음.

    @wire(MessageContext) messageContext; //지금 옆에 showaccount라는 컴포넌트에 주입해야하니까
                                        // @wire를 쓴거임. 메세지 전달해줄거

    columns=[
       
        {label: '이름', fieldName: 'Name'},
        {label: '전화번호', fieldName: 'Phone__c'},
        {label: '더보기', fieldName: 'Actions', type:'button', typeAttributes:
    {
        label: '고객 정보',
        value: 'customer_info'
    }
}
    ]


    rows=[
        {Id: '23', Name: '황'},
        {Id: '30', Name: '김'},
        {Id: '28', Name: '이'},
        {Id: '20', Name: '박'}
    ]
    //[] define array
    //{} defines object 

    currentId; //현재 선택된 행의 id 변수 
    currentName;//현재 선택된 행의 name 변수 
    currentPhone;
    currentStoreName;
    totalprice;

    handleRowAction(event){
        if(event.detail.action.value =='customer_info') //버튼 값이 customer_info면은
        {
        this.currentId = event.detail.row.Id;
        this.currentName = event.detail.row.Name;
        this.currentPhone = event.detail.row.Phone;
        this.currentStoreName = event.detail.row.FirstBranch__c ;
        this.totalprice = event.detail.row.totalprice;

        const payload = {
            accountId : event.detail.row.Id,
            accountName : event.detail.row.Name,
            currentPhone :  event.detail.row.Phone,
            currentStoreName : event.detail.row.FirstBranch__c,
            totalprice : event.detail.row.totalprice
          };

          publish(this.messageContext , hsa , payload);

        }
    }

    @wire(getAccounts, {searchTextClass:'$searchTextChild2'}) accountRecords; //apex쿼리에서 가져온 값들 저장 변수 
    
}