import { visit } from 'unist-util-visit';
import { is } from 'unist-util-is';
import { remove } from 'unist-util-remove';
import type { Root, Definition, ImageReference, LinkReference } from 'mdast';

const isNum = (value: string) => isNaN(Number(value));

function orderDefinitions() {
  return transformer;
}

function transformer(tree: Root) {
  let id = 0;
  const refs: (LinkReference | ImageReference)[] = [];
  const defs: Definition[] = [];
  const store: Definition[] = [];

  visit(tree, ['linkReference', 'imageReference', 'definition'], node => {
    if (is<LinkReference | ImageReference>(node, ['linkReference', 'imageReference'])) refs.push(node);
    if (is<Definition>(node, 'definition')) defs.push(node);
  });

  refs.forEach(ref => {
    const def = defs.find(d => d.identifier === ref.identifier);
    if (def) {
      const reusableDef = store.find(d => d.url === def.url);
      if (reusableDef) {
        ref.identifier = reusableDef.identifier;
        ref.label = reusableDef.identifier;
      } else {
        const identifier = !isNum(ref.identifier) ? ref.identifier : String(++id);
        ref.identifier = identifier;
        ref.label = identifier;
        store.push({
          type: 'definition',
          title: def.title,
          url: def.url,
          identifier,
          label: identifier
        });
      }
    }
  });

  remove(tree, 'definition');

  store.sort(definitionSorter).forEach(def => {
    tree.children.push(def);
  });
}

function definitionSorter(a: Definition, b: Definition) {
  if (!isNum(a.identifier) && isNum(b.identifier)) return 1;
  if (isNum(a.identifier) && !isNum(b.identifier)) return -1;
  if (isNum(b.identifier) && isNum(a.identifier)) return Number(a.identifier) - Number(b.identifier);
  return a.identifier.localeCompare(b.identifier);
}

export default orderDefinitions;
