import React = require('react');
import DataTable from './DataTable';
import { Field } from './Entities';
import { FieldDefinition } from './FieldDefinitions';

export default class DataTableCell extends React.Component<any, any> {
    editMode: boolean = false;
    input: HTMLInputElement;

    constructor(props: any) {
        super(props);
        this.setRef = this.setRef.bind(this);
        this.makeContent = this.makeContent.bind(this);
        this.enterEditMode = this.enterEditMode.bind(this);
        this.valueChanged = this.valueChanged.bind(this);
        this.leaveEditMode = this.leaveEditMode.bind(this);
    }

    setRef(key: string, element: any) {
        if (element) {
            this.input = element;
            this.input.focus();
        } else {
            this.input = undefined;
        }
    }

    enterEditMode(e: any) {
        this.editMode = true;
        this.forceUpdate();
    }

    valueChanged(e: any) {
        const input: HTMLInputElement = e.target;
        const root: DataTable = this.props.root;
        const rowId: number = this.props.rowId;
        const colName: string = this.props.colName;
        root.setFieldValue(rowId, colName, input.value);
    }

    leaveEditMode(e: any) {
        this.editMode = false;
        this.forceUpdate();
    }

    makeContent(): any {
        const root: DataTable = this.props.root;
        const rowId: number = this.props.rowId;
        const colName: string = this.props.colName;
        const field: Field = root.fileEntries.rows.get(rowId).fields.get(colName);
        const fieldDef: FieldDefinition = root.fieldDefinitions.defs.get(field.fieldName);

        let content: any;

        if (this.editMode === true && root.viewOnly === false) {
            content = (
                <input
                    className="dt-tb-tr-td-input"
                    key={'input'}
                    ref={(element: HTMLInputElement) => {this.setRef('input', element); }}
                    type="text"
                    defaultValue={field.fieldValue}
                    onBlur={this.leaveEditMode}
                    onChange={this.valueChanged}

                />
            );
        } else {
            content = (
                <span
                    className="dt-tb-tr-td-label"
                    onClick={this.enterEditMode}
                >
                    {field.fieldValue}
                </span>
            );
        }
        return content;
    }

    componentDidMount() {

    }

    render() {

        const content: any = this.makeContent();
        const root: DataTable = this.props.root;
        const rowId: number = this.props.rowId;
        const colName: string = this.props.colName;
        const field: Field = root.fileEntries.rows.get(rowId).fields.get(colName);
        const fieldDef: FieldDefinition = root.fieldDefinitions.defs.get(field.fieldName);
        return (
            <td
                key={rowId + ':' + colName}
                className="dt-tb-tr-td"
            >
                {content}
            </td>
        );
    }
}
