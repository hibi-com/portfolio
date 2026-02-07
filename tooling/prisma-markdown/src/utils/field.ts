import type { DMMF } from "@prisma/generator-helper";
import { prisma } from "./prisma.js";

export interface FieldUtil {
    format(formatString?: string): string;
    data(): FieldData;
}

export const field = (field: DMMF.Field, isFK?: boolean): FieldUtil => {
    return new Field(field, isFK);
};

export interface FieldData {
    type: string;
    name: string;
    format: null | string;
    nativeType: null | string;
    size: null | number;
    constraint: null | string;
    nullable: boolean;
}

class Field implements FieldUtil {
    constructor(
        private readonly field: DMMF.Field,
        private readonly isFK?: boolean,
    ) {}

    format(formatString?: string): string {
        if (!formatString) return this.field.type;

        const data = this.data();

        return formatString.replaceAll(/[tsdnkr]/g, (match) => {
            switch (match) {
                case "t":
                    return this.field.type;
                case "s":
                    return `${data.size ?? ""}`;
                case "d":
                    return data.nativeType || this.field.type;
                case "n":
                    return data.name;
                case "k":
                    return `${data.constraint ?? ""}`;
                case "r":
                    return data.nullable ? `"nullable"` : "";
                default:
                    return "";
            }
        });
    }

    data(): FieldData {
        const spec: FieldData = {
            type: "",
            name: "",
            format: null,
            nativeType: null,
            size: null,
            constraint: null,
            nullable: false,
        };

        spec.type = this.field.type;

        if (prisma.tagValues("format")(this.field).length > 0) {
            spec["format"] = prisma.tagValues("format")(this.field)[0] ?? null;
        }

        spec["nativeType"] = this.field.nativeType?.[0] ?? null;

        spec["size"] = this.field.nativeType?.[1]?.[0] ? Number.parseInt(this.field.nativeType?.[1]?.[0] ?? "0") : null;

        const keys = [];
        if (this.field.isId) keys.push("PK");
        if (this.isFK) keys.push("FK");
        if (this.field.isUnique) keys.push("UK");
        spec["constraint"] = keys.join(",");

        spec["nullable"] = !this.field.isRequired;
        spec["name"] = this.field.dbName ?? this.field.name;

        return spec;
    }
}
