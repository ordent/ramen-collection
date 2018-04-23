/**
 * `ramen-single-upload` Description
 *
 * @summary ShortDescription.
 * @customElement
 * @polymer
 * @extends {Polymer.Element}
 */
class RamenSingleUpload extends Polymer.Element {
        /**
         * String providing the tag name to register the element under.
         */
        static get is() {
            return 'ramen-single-upload';
        }

        /**
         * Object describing property-related metadata used by Polymer features
         */
        static get properties() {
            return {
                /**
                 * show the rendered file if the files type is image
                 * @type Boolean
                 */
                view: {
                    type: Boolean,
                    value: false
                },
                /**
                 * auto resize the rendered files
                 * @type Boolean
                 */
                autoResize: {
                    type: Boolean,
                    value: false
                },
                /**
                 * text of the input button
                 * @type String
                 */
                inputButtonText: {
                    type: String,
                    value: "Upload Document"
                },
                /**
                 * the result object from file upload
                 * @type Object
                 */
                srcView: {
                    type: Object,
                    readonly: true,
                    observer: '_srcViewChanged'
                },
                /**
                 * file being uploaded
                 * @type Object
                 */
                src: {
                    type: Object,
                    readonly: true
                },
                /**
                 * Allow the file being uploaded automatically
                 * @type Boolean
                 */
                autoUpload: {
                    type: Boolean,
                    value: true
                },
                /**
                 * The attribute of the upload request
                 * @type String
                 */
                uploadAttribute: {
                    type: String,
                    value: "files"
                },
                /**
                 * The url of the upload request
                 * @type String
                 */
                uploadUrl: {
                    type: String,
                    value: ""
                },
                /**
                 * the length of the file being uploaded
                 * @type Number
                 */
                length: {
                    type: Number,
                    readonly: true,
                    value: 0
                },
                /**
                 * request payload to send to server
                 * @type Object
                 */
                payload: {
                    type: Object,
                    readonly: true,
                    value: function () {
                        return {};
                    }
                },
                /**
                 * Allow the result url being shown or not
                 * @type Boolean
                 */
                urlView: {
                    type: Boolean,
                    value: false
                }
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

        _srcViewChanged(n, o) {}
        _isImage(e) {
            if (e.type.match(/image.*/)) {
                return true;
            }
            return false;
        }
        _renderImage(files) {
            let promises = new Promise((resolve, reject) => {
                if (files) {
                    let reader = new FileReader(),
                        canvas = document.createElement("canvas"),
                        image = new Image(),
                        self = this;
                    reader.onload = function (e) {
                        image.onload = function (ie) {
                            let w = image.width;
                            let h = image.height;
                            self.set("srcView", e.target.result);
                            if (self.autoResize) {
                                self.shadowRoot.querySelector("#viewImage").width = w;
                                self.shadowRoot.querySelector("#viewImage").height = h;
                            }
                            resolve(e.target.result);
                        }
                        image.src = e.target.result;
                    }
                    reader.readAsDataURL(files);
                }
            });
        }
        _inputToggle(e) {
            this.shadowRoot.querySelector("#inputButton").disabled = e;
            this.shadowRoot.querySelector("#fileInput").disabled = e;
            if (e) {
                this.shadowRoot.querySelector("#dialog").open();
            } else {
                this.shadowRoot.querySelector("#dialog").close();
            }

        }
        actionChange(e) {
            let files = this.shadowRoot.querySelector("#fileInput").files.item(0);
            let self = this;
            if (files && (files.length < this.length || this.length == 0)) {
                if (this._isImage(files) && this.view) {
                    this._renderImage(files);
                }
                if (this.autoUpload) {
                    this._inputToggle(true);
                    this._uploadFiles(files).then(function (e) {
                        self._inputToggle(false);
                    }).catch(function (f) {
                        self._inputToggle(false);
                    });
                }
            }
        }
        _updateProgress(e) {
            console.log(e.lengthComputable, e.loaded, e.total);
            if (e.lengthComputable) {
                // console.log(e.loaded / e.total);
            }
        }
        _uploadFiles(files) {
            let request = this.shadowRoot.querySelector("#uploadElement");
            request.url = this.uploadUrl;
            request.method = "POST";
            request.body = new FormData;
            request.body.append(this.uploadAttribute, files);
            for (let i in this.payload) {
                if (this.payload.hasOwnProperty(i)) {
                    request.body.append(i, this.payload[i]);
                }
            }
            let xhr = request.generateRequest();
            xhr.xhr.addEventListener("progress", this._updateProgress, false);
            xhr.send();

            let self = this;
            let promises = new Promise((resolve, reject) => {
                xhr.completes.then(function (e) {
                    self.set("src", e.response.data.files);
                    self.dispatchEvent(new CustomEvent("file-upload-completed", {
                        detail: {
                            base64: files,
                            file: files,
                            src: e.response.data.files
                        }
                    }));
                    resolve(e.response.data.files);
                }).catch(function (f) {
                    self.dispatchEvent(new CustomEvent("file-upload-failed", {
                        detail: f
                    }));
                    reject(f);
                });
            });
            return promises;

        }
    }

window.customElements.define(RamenSingleUpload.is, RamenSingleUpload);