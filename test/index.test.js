import { remark } from 'remark';
import test from 'node:test';
import assert from 'node:assert/strict';
import orderDefinitions from '../lib/index.js';

test('should sort named references', () => {
  const input = `This [remark](https://remark.js.org) plugin orders [reference links][ref] and
![image](./logo.svg) references. Then renders the definitions ordered: numbers
first and [named references][named] last.

[ref]: https://refs.biz

[named]: https://named.com
`;

  const actual = remark().use(orderDefinitions).processSync(input).toString();

  const expected = `This [remark](https://remark.js.org) plugin orders [reference links][ref] and
![image](./logo.svg) references. Then renders the definitions ordered: numbers
first and [named references][named] last.

[named]: https://named.com

[ref]: https://refs.biz
`;

  assert.equal(actual, expected);
});

test('should short numbered and named references in content and definitions', () => {
  const input = `This [remark][2] plugin orders [reference links][ref] and
![image][1] references. Then renders the definitions ordered: numbers
first and [named references][named] last.

[ref]: https://refs.biz

[1]: ./logo.svg

[named]: https://named.com

[2]: https://remark.js.org
`;

  const actual = remark().use(orderDefinitions).processSync(input).toString();

  const expected = `This [remark][1] plugin orders [reference links][ref] and
![image][2] references. Then renders the definitions ordered: numbers
first and [named references][named] last.

[1]: https://remark.js.org

[2]: ./logo.svg

[named]: https://named.com

[ref]: https://refs.biz
`;

  assert.equal(actual, expected);
});
