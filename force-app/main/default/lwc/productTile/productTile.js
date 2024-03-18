// productTile.js
// LightningElement와 api 데코레이터 임포트
import { LightningElement, api } from 'lwc';

export default class ProductTile extends LightningElement {

    // @api로 공개된 product 객체는 외부에서 이 컴포넌트에 전달된 제품 데이터를 담고 있습니다.
    @api product = {
        Name: 'testProduct',
        Image_Url__c: '/services/images/photo/003B0FakePictId', 
    };

    // @api로 공개된 selectedProductId는 현재 선택된 제품 ID를 나타냅니다.
    @api selectedProductId = '';

    // 제품이 선택되었는지 여부에 따라 적용할 CSS 클래스를 계산하는 getter 함수입니다.
    get productSelected() {
        // 선택된 제품의 ID가 현재 제품의 ID와 일치하면 'product selected' 클래스를, 아니면 'product' 클래스를 반환합니다.
        return (this.selectedProductId===this.product.Id) ? "product selected" : "product";
    }

    // 제품 타일 클릭 이벤트 핸들러입니다.
    productClick() {
        // CustomEvent를 생성하여 'productselected' 이벤트를 발생시키고, 현재 제품의 ID를 이벤트의 detail에 담아 전달합니다.
        const evt = new CustomEvent('productselected', {
            bubbles: true, composed: true,
            detail: { productId: this.product.Id }
            });
            this.dispatchEvent(evt); // 이벤트를 발생시킵니다.
    }
}