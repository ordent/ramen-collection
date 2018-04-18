/*! JS START */
/**
 * `ramen-datatable` Description
 *
 * @summary ShortDescription.
 * @customElement
 * @polymer
 * @extends {Polymer.Element}
 */
class RamenDatatable extends Polymer.Element {
    /**
     * String providing the tag name to register the element under.
     */
    static get is() {
        return 'ramen-datatable';
    }

    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {

        };
    }

    /**
     * Instance of the element is created/upgraded. Use: initializing state,
     * set up event listeners, create shadow dom.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Use for one-time configuration of your component after local DOM is initialized. 
     */
    ready() {
        super.ready();

        Polymer.RenderStatus.afterNextRender(this, function () {

        });
    }

}

window.customElements.define(RamenDatatable.is, RamenDatatable);