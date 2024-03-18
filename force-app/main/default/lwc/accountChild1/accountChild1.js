import { LightningElement } from 'lwc';

export default class AccountChild1 extends LightningElement {

    searchTextChild1;

    // 입력 값이 변경될 때 호출되는 handleChange 메서드를 정의합니다.
    handleChange(event){
         // 입력 필드에서 입력된 값을 searchTextChild1 변수에 할당합니다.
        this.searchTextChild1 = event.target.value;
    }

    handleClick(event){
        // getsearchevent 커스텀 이벤트를 생성합니다.
        // 이벤트 디테일로 searchTextChild1 변수의 값을 전달합니다.
        const searchEvent  = new CustomEvent('getsearchevent', {detail:this.searchTextChild1})

        // 생성한 이벤트를 부모 컴포넌트로 디스패치합니다.
        this.dispatchEvent(searchEvent);
    }

    resetClick(){
        this.searchTextChild1 = ''; // 입력 필드 초기화 

        //resetserchevent 커스텀 이벤트 생성 
        const resetEvent = new CustomEvent('resetsearchevent');

        //생성한 이벤트를 부모 컴포넌트로 디스패치하기 
        this.dispatchEvent(resetEvent);
    }

}