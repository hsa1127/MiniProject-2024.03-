import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

// NavigationMixin을 사용하기 위해 NavigationMixin을 상속받습니다.
export default class ForSales extends NavigationMixin(LightningElement) {
    @api recordId; // 외부에서 받은 recordId를 저장하는 프로퍼티

    connectedCallback() {
        // 컴포넌트가 DOM에 연결되었을 때 호출됩니다.
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/lightning/n/test?accountId=${this.recordId}`
            }
        }).then(() => {
            // 리디렉션이 성공적으로 완료된 후의 처리를 여기에 작성할 수 있습니다.
            // 예를 들어, 컴포넌트를 닫거나 추가 메시지를 표시할 수 있습니다.
        });
    }
}