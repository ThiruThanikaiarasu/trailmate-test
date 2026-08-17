import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { renderApiTypes } from '../src/codegen/renderApiTypes';

const API_TYPES_PATH = resolve(__dirname, '../../../packages/shared/src/generated/api-types.ts');

mkdirSync(dirname(API_TYPES_PATH), { recursive: true });
writeFileSync(API_TYPES_PATH, renderApiTypes());
console.log(`Wrote ${API_TYPES_PATH}`);
