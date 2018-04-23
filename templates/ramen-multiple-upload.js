/**
 * `ramen-multiple-upload` Description
 *
 * @summary ShortDescription.
 * @customElement
 * @polymer
 * @extends {Polymer.Element}
 */
class RamenMultipleUpload extends Polymer.Element {
    /**
     * String providing the tag name to register the element under.
     */
    static get is() {
        return 'ramen-multiple-upload';
    }
    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            source: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            files: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            payload: {
                type: Object,
                value: function () {
                    return {};
                }
            },
            uploadUrl: {
                type: String
            },
            uploadAttribute: {
                type: String,
                value: 'files'
            },
            autoUpload: {
                type: Boolean
            }
        };
    }
    static get observers() {
        return [
            '_filesChanged(files.*)'
        ];
    }
    _filesChanged(e){
        let temp = e.path.split('.');
        if(temp.length > 2){
            if(temp[2] == 'uploading'){

            }
        }
        
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
        Polymer.RenderStatus.afterNextRender(this, function () {});
    }
    _isActive(e) {
        if (e != undefined && e.hasOwnProperty('indexSplices')) {
            if (e.indexSplices[0].object.length > 0) {
                return true;
            }
            return false;
        }
    }
    _isIdle(a, b) {
        if (!a && !b) {
            return true;
        }
        return false;
    }
    _isUploading(a, b) {
        if (!a && b) {
            return true;
        }
        return false;
    }
    _isCompleted(a, b) {
        if (a && !b) {
            return true;
        }
        return false;
    }
    _inputToggle(e) {}
    actionUpload(e) {
        this._processUpload();
    }
    actionDelete(e) {
        this.splice('files', e.model.index, 1);
    }
    _uploadFiles(e) {
        let self = this;
        let request = this.shadowRoot.querySelector("#uploadElement");
        request.url = this.uploadUrl;
        request.method = "POST";
        request.body = new FormData;
        request.body.append(this.uploadAttribute, e.data);
        for (let i in this.payload) {
            if (this.payload.hasOwnProperty(i)) {
                request.body.append(i, this.payload[i]);
            }
        }
        let xhr = request.generateRequest();
        xhr.xhr.addEventListener("progress", this._updateProgress, false);
        xhr.send();
        return xhr.completes;
    }
    _processUpload() {
        let self = this;
        self.files.forEach((element, index) => {
            if (!element.status) {
                self.set('files.' + index + '.uploading', true);
                self._uploadFiles(element)
                    .then(function (e) {
                        if (e.status == 200 || e.status == 201) {
                            self.set('files.' + index + '.status', true);
                            self.set('files.' + index + '.url', e.response.data.files);
                            self.set('files.' + index + '.uploading', false);
                        }
                        self.dispatchEvent(new CustomEvent("file-upload-completed", {
                            detail: {
                                result: self.files.map(x => x.url)
                            }
                        }));
                    }).catch(function (f) {
                        self.dispatchEvent(new CustomEvent("file-upload-failed", {
                            detail: {
                                result: self.files,
                                message: f.meta.message
                            }
                        }));
                    });
            }
        });
    }
    actionChange() {
        let files = Array.from(this.shadowRoot.querySelector("#fileInput").files);
        let self = this;
        if (files.length > 0) {
            files.forEach(element => {
                self.push('files', {
                    data: element,
                    status: false,
                    url: '',
                    uploading: false
                });
            });
            if (this.autoUpload) {
                this._processUpload();
            }
        }
    }
}
window.customElements.define(RamenMultipleUpload.is, RamenMultipleUpload);