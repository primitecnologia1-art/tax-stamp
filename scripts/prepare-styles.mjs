import postcss from 'postcss';
import selectors from 'postcss-selector-parser';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Keep every authored site rule. Only discard unused generated utility classes.
// The complete runtime is the safelist, including dialogs, tabs and motion states.
export async function prepareStyles(root, runtime, html) {
  const css = await readFile(path.join(root, 'public/_next/static/css/index.BLqIrIxb.css'), 'utf8');
  const ast = postcss.parse(css);
  const content = runtime + html;
  ast.walkAtRules('layer', layer => {
    if (layer.params !== 'utilities') return;
    layer.walkRules(rule => {
      const classes = [];
      selectors(list => list.walkClasses(node => classes.push(node.value))).processSync(rule.selector);
      const candidates = classes.filter(name => name !== 'group' && name !== 'peer');
      if (candidates.length && !candidates.some(name => content.includes(name))) rule.remove();
    });
    layer.walkAtRules(rule => { if (rule.nodes?.length === 0) rule.remove(); });
  });
  // Empty groups are safe to remove after walking their children.
  ast.walkAtRules(rule => { if (rule.nodes?.length === 0) rule.remove(); });
  const overrides = await readFile(path.join(root, 'public/local-overrides.css'), 'utf8');
  return ast.toString() + '\n' + overrides;
}
