import { LightningElement, track } from 'lwc';

export default class VocNavigation extends LightningElement {
    @track isVocSelected = false;
    @track isVocSangdamSelected = false;
    @track isOrderSelected = false;
    @track isSangdamSelected = false;

    handleNavigation(event) {
        const selectedName = event.detail.name;
        this.resetSelections();

        switch (selectedName) {
            case 'voc':
                this.isVocSelected = true;
                break;
            case 'vocsangdam':
                this.isVocSangdamSelected = true;
                break;
            case 'order':
            this.isOrderSelected = true;
                break;
            case 'sangdam':
            this.isSangdamSelected = true;
                break;
            default:
        }
    }

    resetSelections() {
        this.isVocSelected = false;
        this.isVocSangdamSelected = false;
        this.isOrderSelected = false;
        this.isSangdamSelected = false;
    }
}