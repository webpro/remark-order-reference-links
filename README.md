# remark-order-reference-links

Orders reference links and images, starting with `1` as the first link in the
document. Renders the definitions ordered with numbers first, strings last.

Probably you want to use the [remark-reference-links][1] plugin as well. This
makes for a nice combo, resulting in readable prose with readable links.

**Before:**

```markdown
This [remark](https://remark.js.org) plugin orders [reference links][ref] and
![image](./logo.svg) references. Then renders the definitions ordered: numbers
first and [named references][named] last.

[ref]: https://refs.biz
[named]: https://named.com
```

**After:**

```markdown
This [remark][1] plugin orders [reference links][ref] and ![image][2]
references. Then renders the definitions ordered: numbers first and [named
references][named] last.

[1]: https://remark.js.org
[2]: ./logo.svg
[named]: https://named.com
[ref]: https://refs.biz
```

[1]: https://github.com/remarkjs/remark-reference-links
