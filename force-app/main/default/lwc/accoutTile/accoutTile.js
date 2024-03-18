import { LightningElement, api } from 'lwc';

export default class AccoutTile extends LightningElement {
    @api account = {
        Name: 'Account Name',
        Photourl: '/services/images/photo/003B0FakePictId'
    };
    
    get tileSelected() {
        return this.isSelected ? "tile selected" : "tile";
        }
    }