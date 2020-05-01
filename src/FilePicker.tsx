import * as React from 'react';
import './css/FilePicker.css';

import {eContentType, eLoadingState, FlowComponent, FlowObjectData, FlowObjectDataProperty} from 'flow-component-model';
import { HTMLProps } from 'react';

declare const manywho: any;

class FilePicker extends FlowComponent {
    selectedItem: string = null;
    imgDiv: any;
    img: any;
    text: string = '';
    fileInput: any;

    constructor(props: any) {
        super(props);
        this.fileSelected = this.fileSelected.bind(this);
        this.fileReadAsDataURL = this.fileReadAsDataURL.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.pickFile = this.pickFile.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    render() {

        let filePick: any;
        const caption: string = this.getAttribute('title') || 'Select File';

        let width: string = '100%';
        let height: string = '100%';
        if (this.model.width && this.model.width > 99) {
            width = this.model.width + 'px';
        }
        if (this.model.height && this.model.height > 99) {
            height = this.model.height + 'px';
        }

        const style: any = {};
        style.width = width;
        style.height = height;

        const content: any = 'Click to select a file';

        return (
            <div className="file-picker"
                style={{width}}
            >
                <div
                    className="file-picker-body"
                    onClick={this.pickFile}
                    ref={(element: any) => {this.imgDiv = element; }}
                    style={style}
                >
                    <span
                        style={{
                            margin: 'auto',
                            cursor: 'pointer',
                        }}
                    >
                        Click here to select a file
                    </span>
                    <input
                        ref={(ele: any) => {this.fileInput = ele; }}
                        type="file"
                        className="file-file"
                        onChange={this.fileSelected}
                    />
                </div>
            </div>
        );
    }

    clearFile() {
        this.forceUpdate();
    }

    pickFile() {
        this.fileInput.value = '';
        this.fileInput.click();
    }

    async fileSelected(e: any) {
        if (this.fileInput.files && this.fileInput.files.length > 0) {
            const file: File = this.fileInput.files[0];
            const dataURL: string = await this.fileReadAsDataURL(file);
            const fname: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
            const ext: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() : '';
            const typ: string = file.type;
            const size: number = file.size;

            let objData: any;

            if (this.model.contentType.toLocaleUpperCase() === 'CONTENTSTRING') {
                objData = dataURL;
            } else {
                // assume object
                objData = FlowObjectData.newInstance('FileData');
                objData.addProperty(FlowObjectDataProperty.newInstance('FileName', eContentType.ContentString, fname));
                objData.addProperty(FlowObjectDataProperty.newInstance('Extension', eContentType.ContentString, ext));
                objData.addProperty(FlowObjectDataProperty.newInstance('MimeType', eContentType.ContentString, typ));
                objData.addProperty(FlowObjectDataProperty.newInstance('Size', eContentType.ContentNumber, size));
                objData.addProperty(FlowObjectDataProperty.newInstance('Content', eContentType.ContentString, dataURL));
            }

            await this.setStateValue(objData);

            if (this.getAttribute('onSelected', '').length > 0) {
                await this.triggerOutcome(this.getAttribute('onSelected', ''));
            }

            this.forceUpdate();

        }
    }

    async fileReadAsDataURL(file: any): Promise<any> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem reading file'));
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }
}

manywho.component.register('FilePicker', FilePicker);

export default FilePicker;
