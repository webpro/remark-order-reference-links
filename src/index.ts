import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';
import type { Root, Definition, ImageReference, LinkReference } from 'mdast';

const _isNaN = (value: string) => isNaN(Number(value));
const encodeBrackets = (value: string) => value.replace(/\[/g, '%5B').replace(/]/g, '%5D');

function orderDefinitions() {
  return transformer;
}

function transformer(tree: Root) {
  let id = 0;
  const refs: (LinkReference | ImageReference)[] = [];
  const defs: Definition[] = [];
  const store: Definition[] = [];

  visit(tree, ['linkReference', 'imageReference', 'definition'], node => {
    if (node.type === 'linkReference' || node.type === 'imageReference') refs.push(node);
    if (node.type === 'definition') defs.push(node);
  });

  refs.forEach(ref => {
    const def = defs.find(d => d.identifier === ref.identifier);
    if (def) {
      const url = encodeBrackets(def.url);
      const reusableDef = store.find(d => d.url === url);
      if (reusableDef) {
        ref.identifier = reusableDef.identifier;
        ref.label = reusableDef.identifier;
      } else {
        const identifier = _isNaN(ref.identifier) ? ref.identifier : String(++id);
        ref.identifier = identifier;
        ref.label = identifier;
        store.push({
          type: 'definition',
          title: def.title,
          url,
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

function definitionSorter({ identifier: a }: Definition, { identifier: b }: Definition) {
  return Number(!isNaN(+b)) - Number(!isNaN(+a)) || +a - +b || a.localeCompare(b);
}

export default orderDefinitions;
