/**
 *  # Ramen Button
 * `ramen-button` add a paper-button with styled opinion that mimic the coloring of bootstrap button.
 * @summary a paper button with bootstrap color style.
 * @customElement
 * @polymer
 * @demo ../demo/ramen-button.html
 * @extends {Polymer.Element}
 */
class RamenButton extends Polymer.mixinBehaviors([Polymer.PaperButtonBehavior], Polymer.Element) {
    /**
     * String providing the tag name to register the element under.
     */
    static get is() {
        return 'ramen-button';
    }

    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            /**
             * attributes that toogle the behaviour of raised button.
             *
             * @type Boolean
             */
            raised: {
                type: Boolean,
                reflectToAttribute: true,
                value: false,
                observer: '_calculateElevation'
            },
            /**
             * attributes that toogle the behaviour of flat button.
             *
             * @type Boolean
             */
            flat : Boolean,
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

    _calculateElevation() {
        if (!this.raised) {
          this._setElevation(0);
        } else {
          Polymer.PaperButtonBehaviorImpl._calculateElevation.apply(this);
        }
      }
      /**
      Fired when the animation finishes.
      This is useful if you want to wait until
      the ripple animation finishes to perform some action.
      @event transitionend
      Event param: {{node: Object}} detail Contains the animated node.
      */

}

window.customElements.define(RamenButton.is, RamenButton);