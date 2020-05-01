import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';

export class Field {
    fieldIndex: number;
    fieldName: string;
    fieldValue: string;
    hasChanges: boolean = false;

    constructor(fieldDef: FlowObjectData) {
        this.fieldIndex = fieldDef.properties['Index'].value as number;
        this.fieldName = fieldDef.properties['Name'].value as string;
        this.fieldValue = fieldDef.properties['Value'].value as string;
    }

    setValue(newValue: string): boolean {
        if (this.fieldValue !== newValue) {
            this.fieldValue = newValue;
            this.hasChanges = true;
        }
        return this.hasChanges;
    }

    saved() {
        this.hasChanges = false;
    }
}

export class Row {
    rowIndex: number;
    fields: Map<string, Field>;
    hasChanges: boolean = false;
    constructor(row: FlowObjectData) {
        this.fields = new Map();
        this.rowIndex = row.properties['Index'].value as number;
        (row.properties['Fields'].value as FlowObjectDataArray).items.forEach((field: FlowObjectData) => {
            this.fields.set(field.properties['Name'].value as string, new Field(field));
        });
    }

    setValue(columnName: string, newValue: string): boolean {
        const causedChanges: boolean = this.fields.get(columnName).setValue(newValue);
        this.hasChanges = this.hasChanges || causedChanges;
        return this.hasChanges;
    }

    saved() {
        this.fields.forEach((field: Field) => {
            field.saved();
        });
        this.hasChanges = false;
    }
}

export class Rows {
    rows: Map<number, Row>;
    hasChanges: boolean = false;
    pages: number = 0;
    pageSize: number = 0;

    constructor() {
        this.rows = new Map();
    }

    parse(fileData: FlowObjectData, pageSize: number) {
        this.pageSize = pageSize;
        this.rows = new Map();
        (fileData.properties['Entries'].value as FlowObjectDataArray).items.forEach((row: FlowObjectData) => {
            this.rows.set(row.properties['Index'].value as number, new Row(row));
        });
        this.pageSize = pageSize;
        this.pages = Math.ceil(this.rows.size / pageSize);
    }

    setValue(rowId: number, columnName: string, newValue: string): boolean {
        const causedChanges: boolean = this.rows.get(rowId).setValue(columnName, newValue);
        this.hasChanges = this.hasChanges || causedChanges;
        return this.hasChanges;
    }

    saved() {
        this.rows.forEach((row: Row) => {
            row.saved();
        });
        this.hasChanges = false;
    }

    getPage(pageNumber: number): Row[] {
        if (pageNumber > this.pages) {
            pageNumber = this.pages;
        }
        if (pageNumber < 1) {
            pageNumber = 1;
        }
        const results: Row[] = [];
        let startIndex: number = 1 + ((pageNumber - 1) * this.pageSize);
        const endIndex: number = startIndex + (this.pageSize - 1);
        for (startIndex ; startIndex < endIndex ; startIndex++) {
            if (this.rows.has(startIndex)) {
                results.push(this.rows.get(startIndex));
            }
        }

        return results;
    }
}
