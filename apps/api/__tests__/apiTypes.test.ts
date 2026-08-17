import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderApiTypes } from '../src/codegen/renderApiTypes';

const generatedFile = resolve(__dirname, '../../../packages/shared/src/generated/api-types.ts');

describe('generated API types', () => {
  it('are up to date with the Zod schemas (run `npm run generate:types`)', () => {
    expect(readFileSync(generatedFile, 'utf8')).toBe(renderApiTypes());
  });
});
