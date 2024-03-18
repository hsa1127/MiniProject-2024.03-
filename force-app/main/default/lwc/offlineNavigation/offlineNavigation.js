import { LightningElement, track } from 'lwc';

export default class OfflineNavigation extends LightningElement {
    @track isProductSelected = false;
    @track isAccountSelected = false;
    @track isSangdamSelected = false;
    @track isOrderSelected = false;
    @track isAccessoryelected = false;
    @track isLaptopSelected = false;
    

    handleNavigation(event) {
        const selectedName = event.detail.name;
        this.resetSelections();

        switch (selectedName) {
            case 'product':
                this.isProductSelected = true;
                break;
            case 'account':
                this.isAccountSelected = true;
                break;
            case 'sangdam':
                this.isSangdamSelected = true;
                break;
            case 'order':
            this.isOrderSelected = true;
                break;
            case 'laptop':
                    this.isLaptopSelected = true;
                    break;
            case 'accessory':
                this.isAccessoryelected = true;
                break;
            default:
                // handle default case
        }
    }

    resetSelections() {
        this.isProductSelected = false;
        this.isAccountSelected = false;
        this.isOrderSelected = false;
        this.isSangdamSelected = false;
        this.isAccessoryelected = false;
        this.isLaptopSelected = false;
    }
}