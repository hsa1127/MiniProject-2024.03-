import { LightningElement, api } from 'lwc';

export default class SangDamDetailView extends LightningElement {
    @api recordId; // 부모 컴포넌트로부터 전달받은 레코드 ID

    // "닫기" 버튼 클릭 시 모달 닫기 이벤트를 발생시키는 메서드
    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}