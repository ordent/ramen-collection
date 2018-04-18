/**
 *  # Ramen Dialog
 * `ramen-dialog` add a paper-dialog with styled opinion that mimic the coloring of bootstrap dialog. HTML value and list is also available via API.
 * @summary a paper dialog with ramen color style.
 * @customElement
 * @polymer
 * @demo ../demo/ramen-dialog.html
 * @extends {Polymer.Element}
 */
class RamenDialog extends Polymer.mixinBehaviors([Polymer.PaperDialogBehavior], Polymer.Element) {
    static get is() {
        return 'ramen-dialog';
    }
    
    static get properties() {
        return {
            /**
             * title of dialog
             * @type String
             */
            title: {
                type: String,
                value: null
            },
            /**
             * indicator if title is exist
             * @type Boolean
             */
            isTitle: {
                type : Boolean,
                readOnly: true,
                computed : '_computeTitle(title)'
            },
            /**
             * attributes that activate header style of dialog
             * @type Boolean
             */
            header : {
                type: Boolean,
                value: false
            },
            /**
             * list based content for the paper dialog
             * @type Array
             */
            list: {
                type: Array,
                value: function(){
                    return [];
                }
            },
            /**
             * attributes to activate dismissal button
             * @type Button
             */
            dismissal: {
                type: Boolean,
                value: false
            },
            /**
             * text of cancel button dialog
             * @type String
             */
            dialogCancelText : {
                type : String,
                value : "Cancel"
            },
            /**
             * attributes to activate confirmation button
             * @type Button
             */
            confirmation: {
                type: Boolean,
                value: false
            },
            /**
             * text of confirmation button dialog
             * @type String
             */
            dialogConfirmText : {
                type : String,
                value : "Ok"
            },
            /**
             * indicator if list based content is exist
             * @type String
             */
            isList : {
                type: Boolean,
                readOnly: true,
                computed: '_computedList(list)'
            },
            /**
             * attributes of html based dialog content
             * @type String
             */
            htmlVal : {
                type: String,
                value: undefined
            },
            /**
             * indicator if html based content is exist
             * @type Boolean
             */
            isHtml : {
                type: Boolean,
                readOnly: true,
                computed: '_computedHtml(htmlVal)'
            },
            /**
             * indicator if only dismissal button is active
             * @type String
             */
            onlyDismissal : {
                type: Boolean,
                readOnly: true,
                computed: '_computeOnlyDismissal(dismissal, confirmation)'
            },
            /**
             * indicator if only c
             * @type String
             */
            
            onlyConfirmation : {
                type: Boolean,
                readOnly: true,
                computed: '_computeOnlyConfirmation(dismissal, confirmation)'
            },
            /**
             * indicator if list based content is exist
             * @type String
             */
            
            bothDialogButton : {
                type: Boolean,
                readOnly: true,
                computed: '_computeBothDialog(dismissal, confirmation)'
            },
        };
    }
    
    constructor() {
        super();
    }
    
    ready() {
        super.ready();
        Polymer.RenderStatus.afterNextRender(this, function () {
            this.addEventListener('iron-overlay-canceled', this._dialogCanceled);
            this.addEventListener('iron-overlay-closed', this._dialogClosed);
        });
    }
    disconnectedCallback(){
        this.removeEventListener('iron-overlay-canceled', this._dialogCanceled);
        this.addEventListener('iron-overlay-closed', this._dialogClosed);
        super.disconnectedCallback();
    }
    _computedList(list){
        if(Array.isArray(list)){
            if(list.length>0){
                return true;
            }
        }
        return false;
    }
    _computeTitle(val){
        if(val == null){
            return false;
        }
        return true;
    }
    _computeOnlyDismissal(a, b){
        if(a && !b){
            return true;
        }
        return false;
    }
    _computeOnlyConfirmation(a, b){
        if(!a && b){
            return true;
        }
        return false;
    }
    _computeBothDialog(a, b){
        if(a && b){
            return true;
        }
        return false;
    }
    _computedHtml(htmlVal){
        if(htmlVal){
            return true;
        }
        return false;
    }
    _actionDismiss(){
        this.dispatchEvent(new CustomEvent("dialog-dismiss"));
    }
    _actionConfirm(){
        this.dispatchEvent(new CustomEvent("dialog-confirm"));
    }
    /**
     * Use open to trigger the open process of dialog
     */
    open(){
        super.open();
        this.classList.add('hidden');
        window.setTimeout(function(){
            this.classList.remove('hidden');
        }.bind(this), 10);
    }
    /**
     * Use close to trigger the closing process of dialog
     */
    close(){
        this.set('listContent', []);
        this.htmlVal = undefined;
        this.classList.add('hidden');
        window.setTimeout(super.close.bind(this), 300);
    }
    /**
     * Open With Data allow you to trigger the open process injected with data to make it easier for you to dinamically change the Content.
     */
    openWithData(data){
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
        super.open();
    }
    _dialogCanceled(e){
        e.preventDefault();
        this.close();
    }
    _dialogClosed(){
        this.classList.remove('hidden');
    }
}
window.customElements.define(RamenDialog.is, RamenDialog);