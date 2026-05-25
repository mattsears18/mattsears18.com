import { describe, expect, it } from 'vitest';

import remarkStripFrontmatter from './remark-strip-frontmatter.js';

type Node = { type: string; value?: string };
type Tree = { children: Node[] };

describe('remarkStripFrontmatter', () => {
  it('removes yaml frontmatter nodes from the mdast tree', () => {
    const tree: Tree = {
      children: [
        { type: 'yaml', value: "title: 'Hello'" },
        { type: 'paragraph', value: 'body' },
      ],
    };

    const transform = remarkStripFrontmatter();
    transform(tree);

    expect(tree.children).toEqual([{ type: 'paragraph', value: 'body' }]);
  });

  it('leaves trees without a yaml node unchanged', () => {
    const tree: Tree = {
      children: [
        { type: 'heading', value: 'h1' },
        { type: 'paragraph', value: 'body' },
      ],
    };

    const transform = remarkStripFrontmatter();
    transform(tree);

    expect(tree.children).toEqual([
      { type: 'heading', value: 'h1' },
      { type: 'paragraph', value: 'body' },
    ]);
  });

  it('handles multiple yaml nodes (defensive — drops them all)', () => {
    const tree: Tree = {
      children: [
        { type: 'yaml', value: 'a: 1' },
        { type: 'paragraph', value: 'between' },
        { type: 'yaml', value: 'b: 2' },
      ],
    };

    const transform = remarkStripFrontmatter();
    transform(tree);

    expect(tree.children).toEqual([{ type: 'paragraph', value: 'between' }]);
  });
});
