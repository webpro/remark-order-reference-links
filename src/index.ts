import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';
import type { Root, Definition, ImageReference, LinkReference } from 'mdast';

const _isNaN = (value: string) => isNaN(Number(value));

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
      const reusableDef = store.find(d => d.url === def.url);
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
  if (_isNaN(a.identifier) && !_isNaN(b.identifier)) return 1;
  if (!_isNaN(a.identifier) && _isNaN(b.identifier)) return -1;
  if (!_isNaN(b.identifier) && !_isNaN(a.identifier)) return Number(a.identifier) - Number(b.identifier);
  return a.identifier.localeCompare(b.identifier);
}

export default orderDefinitions;
