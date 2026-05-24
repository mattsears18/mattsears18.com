/**
 * Remark plugin: drop the YAML frontmatter node parsed by `remark-frontmatter`.
 *
 * Frontmatter is consumed by gray-matter in `lib/posts.ts` and `lib/work.ts`,
 * not exported from the MDX module — without this filter the parsed `yaml`
 * node renders as a literal `title: ...` paragraph at the top of every post
 * and project body.
 *
 * Lives in its own module (CJS) because @next/mdx + Turbopack require loader
 * options to be serializable; an inline arrow in `next.config.js` fails the
 * "plain JavaScript objects and values" check.
 */
module.exports = function remarkStripFrontmatter() {
  return (tree) => {
    tree.children = tree.children.filter((node) => node.type !== 'yaml');
  };
};
