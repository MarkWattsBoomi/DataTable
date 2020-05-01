import * as React from 'react';
import DataTable from './DataTable';
import './DataTable.css';
import DataTableCell from './DataTableCell';
import { Field, Row } from './Entities';

export default class DataTableRow extends React.Component<any, any> {
    selectedItem: string = null;
    constructor(props: any) {
        super(props);
        this.buildColumns = this.buildColumns.bind(this);
    }

    componentDidMount() {

    }

    buildColumns(): any[] {
        const parent: DataTable = this.props.parent;
        const rowId: number = this.props.rowId;
        const row: Row = parent.fileEntries.rows.get(rowId);
        const results: any[] = [];
        row.fields.forEach((col: Field) => {
            results.push(
                <DataTableCell
                    parent={this}
                    root={this.props.parent}
                    rowId={rowId}
                    colName={col.fieldName}
                />,
            );
        });
        return results;
    }

    render() {
        const cols: any[] = this.buildColumns();
        return (
            <tr
                className="dt-tb-tr"
            >
                {cols}
            </tr>
        );
    }
}
