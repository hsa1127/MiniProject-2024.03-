import { LightningElement, track, wire } from 'lwc';
// messageChannels
import {
	subscribe,
	unsubscribe,
	MessageContext
} from "lightning/messageService";
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";

export default class ProductMaster extends LightningElement {
    @track totalInCart = 0;
    @track cartData = [];
    

    @wire(MessageContext)
	messageContext;

	connectedCallback() {
		this.subscribeMC();
	}

	disconnectedCallback() {
		this.unsubscribeMC();
	}
	

	subscribeMC() {
		if (this.subscription) {
			return;
		}
		this.subscription = subscribe(this.messageContext, CART_CHANNEL, (message) => {
			console.log("message " + JSON.stringify(message));
			let { cartData, action: { cartAction } } = message;
			
			if (cartAction === 'Add') {
				this.cartData = [...this.cartData, cartData];
			} else if (cartAction === 'Remove') {
				this.cartData = this.cartData.filter(item => item.productId !== cartData.productId);
			}
	
			this.totalInCart = this.cartData.length;
		});
	}

	unsubscribeMC() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	handleOpenCart(){
		let child = this.template.querySelector('c-cart-data');
		child.openModal(this.cartData);
	}
}