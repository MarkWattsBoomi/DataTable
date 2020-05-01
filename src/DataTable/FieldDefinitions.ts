import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';

export class FieldDefinition {
    fieldIndex: number;
    fieldName: string;
    fieldType: string;

    constructor(fieldDef: FlowObjectData) {
        this.fieldIndex = fieldDef.properties['Index'].value as number;
        this.fieldName = fieldDef.properties['Name'].value as string;
        this.fieldType = (fieldDef.properties['Type'].value as string).toUpperCase();
    }
}

export class FieldDefinitions {
    defs: Map<string, FieldDefinition>;

    constructor() {
        this.defs = new Map();
    }

    parse(fileData: FlowObjectData) {
        this.defs = new Map();
        (fileData.properties['FieldDefinitions'].value as FlowObjectDataArray).items.forEach((fieldDef: FlowObjectData) => {
            this.defs.set(fieldDef.properties['Name'].value as string, new FieldDefinition(fieldDef));
        });
    }
}
