import { z } from 'zod';
import { apiEnums, apiSchemas, type NamedEnum, type NamedSchema } from './apiTypeRegistry';

interface JsonSchema {
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: unknown[];
  const?: unknown;
  anyOf?: JsonSchema[];
}

export const GENERATED_HEADER = [
  '// DO NOT EDIT. This file is generated from the Zod schemas in apps/api/src/schemas',
  '// by apps/api/scripts/generate-api-types.ts. Run `npm run generate:types` to update it.',
].join('\n');

const INDENT = '  ';

function sameValues(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

function renderType(schema: JsonSchema, depth: number): string {
  if (schema.anyOf) return schema.anyOf.map((member) => renderType(member, depth)).join(' | ');
  if (Array.isArray(schema.type)) {
    return schema.type.map((type) => renderType({ ...schema, type }, depth)).join(' | ');
  }
  if (schema.const !== undefined) return JSON.stringify(schema.const);
  if (schema.enum) {
    const named = apiEnums.find((e) => sameValues(e.values, schema.enum as unknown[]));
    return named ? named.typeName : schema.enum.map((v) => JSON.stringify(v)).join(' | ');
  }
  switch (schema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'null':
      return 'null';
    case 'array': {
      const item = renderType(schema.items ?? {}, depth);
      return item.includes(' ') ? `Array<${item}>` : `${item}[]`;
    }
    case 'object':
      return renderObject(schema, depth);
    default:
      return 'unknown';
  }
}

function renderObject(schema: JsonSchema, depth: number): string {
  const required = new Set(schema.required ?? []);
  const pad = INDENT.repeat(depth + 1);
  const fields = Object.entries(schema.properties ?? {}).map(
    ([key, value]) => `${pad}${key}${required.has(key) ? '' : '?'}: ${renderType(value, depth + 1)};`,
  );
  return `{\n${fields.join('\n')}\n${INDENT.repeat(depth)}}`;
}

function renderEnum({ constName, typeName, values }: NamedEnum): string {
  const list = values.map((v) => `${INDENT}${JSON.stringify(v)},`).join('\n');
  return `export const ${constName} = [\n${list}\n] as const;\n\nexport type ${typeName} = (typeof ${constName})[number];`;
}

function renderSchema({ name, schema, io }: NamedSchema): string {
  const json = z.toJSONSchema(schema, { io, unrepresentable: 'any' }) as JsonSchema;
  return `export interface ${name} ${renderObject(json, 0)}`;
}

/** Renders the complete contents of packages/shared/src/generated/api-types.ts. */
export function renderApiTypes(): string {
  const sections = [GENERATED_HEADER, ...apiEnums.map(renderEnum), ...apiSchemas.map(renderSchema)];
  return `${sections.join('\n\n')}\n`;
}
