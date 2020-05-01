import * as React from 'react';
import './DataTable.css';

import {eLoadingState, FlowComponent, FlowObjectData, FlowObjectDataArray} from 'flow-component-model';
import DataTableHeader from './DataTableHeader';
import DataTableRow from './DataTableRow';
import { Field, Row, Rows } from './Entities';
import { FieldDefinition, FieldDefinitions } from './FieldDefinitions';

declare const manywho: any;

class DataTable extends FlowComponent {
    header: DataTableHeader;
    fileData: FlowObjectData;
    childRows: Map<number, DataTableRow> = new Map();

    // holds the file data in a manipulatable form
    fieldDefinitions: FieldDefinitions = new FieldDefinitions();
    fileEntries: Rows = new Rows();
    viewOnly: boolean = false;

    resultPageNumber: number = 1;
    resultPageSize: number = 10;

    constructor(props: any) {
        super(props);
        this.buildUIRows = this.buildUIRows.bind(this);
        this.buildUIHeaders = this.buildUIHeaders.bind(this);
        this.onDone = this.onDone.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);

        // this.addRow = this.addRow.bind(this);
    }

    async componentDidMount() {
        await super.componentDidMount();
        // (manywho as any).eventManager.addDoneListener(this.onDone, this.componentId);
        if (this.attributes.ReadOnly && this.attributes.ReadOnly.value.toUpperCase() === 'TRUE') {
            this.viewOnly = true;
        }
        if (this.attributes.PageSize && this.attributes.PageSize.value.length > 0) {
            this.resultPageSize = parseInt(this.attributes.PageSize.value) || 10;
        }
        this.fileData = this.getStateValue() as FlowObjectData;
        this.parseFileData();
        this.forceUpdate();
    }

    async onDone(xhr: XMLHttpRequest, request: any) {
        // this handles the new subflow concept.
        // the flow could have moved to a sub flow and if so we need to reload all data
        if ((xhr as any).invokeType === 'FORWARD') {
            this.fileData = this.getStateValue() as FlowObjectData;
            this.parseFileData();
            this.forceUpdate();
        }
    }

    setFieldValue(rowId: number, columnName: string, newValue: string) {
        this.fileEntries.setValue(rowId, columnName, newValue);
        this.header.forceUpdate();
    }

    // saved the entire data back to flow
    async saveChanges() {
        // loop over this.fileEntries getting any changed ones
        this.fileEntries.rows.forEach((row: Row) => {
            if (row.hasChanges === true) {
                const targetRow: FlowObjectData = (this.fileData.properties['Entries'].value as FlowObjectDataArray).getItemWithPropertyValue('Index', row.rowIndex);
                row.fields.forEach((field: Field) => {
                    if (field.hasChanges === true) {
                        const targetField: FlowObjectData = (targetRow.properties['Fields'].value as FlowObjectDataArray).getItemWithPropertyValue('Name', field.fieldName);
                        targetField.properties['Value'].value = field.fieldValue;
                    }
                });
            }
        });
        await this.setStateValue(this.fileData);
        this.fileEntries.saved();
        this.forceUpdate();
    }

    async revertChanges() {
        this.parseFileData();
        this.fileEntries.saved();
        this.forceUpdate();
    }

    async submitData() {
        if (this.attributes.onSubmit) {
            await this.triggerOutcome(this.attributes.onSubmit.value);
        }
    }

    parseFileData() {
        this.fieldDefinitions.parse(this.fileData);
        this.fileEntries.parse(this.fileData, this.resultPageSize);
        this.header.forceUpdate();
    }

    nextPage() {
        this.resultPageNumber++;
        this.forceUpdate();
    }

    previousPage() {
        this.resultPageNumber--;
        this.forceUpdate();
    }

    addRow(key: number, row: DataTableRow) {
        if (row === undefined) {
            if (this.childRows.has(key)) {
                this.childRows.delete(key);
            }
        } else {
            this.childRows.set(key, row);
        }
    }

    buildUIRows(): any[] {
        const results: any[] = [];
        const rows: Row[] = this.fileEntries.getPage(this.resultPageNumber);
        rows.forEach((row: Row) => {
            results.push(
                <DataTableRow
                    key={row.rowIndex}
                    parent={this}
                    rowId={row.rowIndex}
                    ref={(element: DataTableRow) => {this.addRow(row.rowIndex, element); }}
                />,
            );
        });
        /*
        this.fileEntries.rows.forEach((row: Row) => {
            results.push(
                <DataTableRow
                    key={row.rowIndex}
                    parent={this}
                    rowId={row.rowIndex}
                    ref={(element: DataTableRow) => {this.addRow(row.rowIndex, element); }}
                />,
            );
        });
        */
        return results;
    }

    buildUIHeaders(): any[] {
        const results: any[] = [];
        this.fieldDefinitions.defs.forEach((def: FieldDefinition) => {
            results.push(
                <th
                    className="dt-th-tr-th"
                >
                    {def.fieldName}
                </th>,
            );
        });
        return results;
    }

    render() {

        let rows: any[] = [];
        let headers: any[] = [];
        if (this.loadingState === eLoadingState.ready) {
            headers = this.buildUIHeaders();
            rows = this.buildUIRows();
        }

        return (
            <div
                className="data-table"
            >
                <DataTableHeader
                    parent={this}
                    ref={(element: DataTableHeader) => {this.header = element; }}
                />
                <div
                    className="data-table-table-container"
                >
                    <table
                        className="dt"
                    >
                        <thead
                            className="dt-th"
                        >
                            <tr
                                className="dt-th-tr"
                            >
                                {headers}
                            </tr>
                        </thead>
                        <tbody
                            className="dt-tb"
                        >
                            {rows}
                        </tbody>

                    </table>
                </div>
            </div>
        );
    }
}

manywho.component.register('DataTable', DataTable);

export default DataTable;
