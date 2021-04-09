[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![Node.JS version][node-version]][node-url]


# fast-string-compare

This is a (much) faster version of [String.prototype.localeCompare()][mdn-localecompare] to compare two strings, useful for [Array.prototype.sort()][mdn-sort] or for ordering strings in trees.

This is **not equivalent** to `localeCompare`, and does **not** return the same result. `localeCompare` respects the current *locale* (language), and orders e.g. both 'a' and 'A' before 'b'. See [Intl.Collator][mdn-collator].

The function exported by this package - `compare` - returns a pure **binary comparison**, and is therefore just as stable and useful if *some* deterministic order is needed, but not necessarily a *human friendly* order.


# API

```ts
import { compare } from 'fast-string-compare'

[ 'c', 'a', 'B' ].sort( compare ); // 'B', 'a', 'c'
```


# Benchmark

Running this under a system heavily slowing down user code (e.g. Jest, with or without coverage), it will run much slower than `localeCompare()`. This is misleading, and not the case when not running in a test environment.

Look at the benchmark code and run it using `yarn benchmark`.

In these benchmarks, the fast compare is ~2-3x faster than `localeCompare`, but a large part of the benchmark is logic *around* the actual comparison, so the difference is likely larger for the pure comparison.

<details style="padding-left: 32px; border-left: 4px solid gray;">
<summary>Benchmark results (the exported compare function is the 'fast' method):</summary>
<p>

```
❯ yarn -s benchmark
Benchmarking raw comparison algorithms...

Running test of: raw compare
fast           x 12,190,097 ops/sec ±0.50% (91 runs sampled)
fast double    x 11,263,299 ops/sec ±0.44% (91 runs sampled)
fast and slice x 7,343,412 ops/sec ±0.62% (91 runs sampled)
fast codepoint x 11,552,827 ops/sec ±0.67% (87 runs sampled)
Intl.Collator  x 6,341,841 ops/sec ±1.12% (86 runs sampled)
localeCompare  x 5,599,850 ops/sec ±1.01% (90 runs sampled)

Benchmarking comparison algorithms for sort...

Running test of: english words
fast           x 2.15 ops/sec ±3.61% (10 runs sampled)
fast double    x 2.04 ops/sec ±5.87% (10 runs sampled)
fast and slice x 1.36 ops/sec ±2.53% (8 runs sampled)
fast codepoint x 1.74 ops/sec ±2.18% (9 runs sampled)
Intl.Collator  x 0.87 ops/sec ±0.82% (7 runs sampled)
localeCompare  x 0.78 ops/sec ±4.24% (6 runs sampled)

Running test of: english words reversed
fast           x 2.12 ops/sec ±5.38% (10 runs sampled)
fast double    x 2.11 ops/sec ±1.76% (10 runs sampled)
fast and slice x 1.39 ops/sec ±3.90% (8 runs sampled)
fast codepoint x 1.79 ops/sec ±1.79% (9 runs sampled)
Intl.Collator  x 0.89 ops/sec ±0.28% (7 runs sampled)
localeCompare  x 0.79 ops/sec ±3.82% (7 runs sampled)

Running test of: english words randomized
fast           x 2.12 ops/sec ±7.95% (10 runs sampled)
fast double    x 2.13 ops/sec ±1.59% (10 runs sampled)
fast and slice x 1.42 ops/sec ±0.55% (8 runs sampled)
fast codepoint x 1.81 ops/sec ±0.53% (9 runs sampled)
Intl.Collator  x 0.88 ops/sec ±3.13% (7 runs sampled)
localeCompare  x 0.80 ops/sec ±2.20% (7 runs sampled)

Running test of: data type words
fast           x 10,857 ops/sec ±0.74% (92 runs sampled)
fast double    x 9,770 ops/sec ±0.76% (93 runs sampled)
fast and slice x 6,135 ops/sec ±0.44% (94 runs sampled)
fast codepoint x 8,212 ops/sec ±0.89% (93 runs sampled)
Intl.Collator  x 3,778 ops/sec ±0.47% (94 runs sampled)
localeCompare  x 3,434 ops/sec ±0.87% (92 runs sampled)

Running test of: data type words reversed
fast           x 10,731 ops/sec ±1.09% (94 runs sampled)
fast double    x 9,643 ops/sec ±0.72% (92 runs sampled)
fast and slice x 6,109 ops/sec ±0.46% (92 runs sampled)
fast codepoint x 8,158 ops/sec ±1.34% (93 runs sampled)
Intl.Collator  x 3,800 ops/sec ±0.47% (93 runs sampled)
localeCompare  x 3,438 ops/sec ±0.41% (92 runs sampled)

Running test of: data type words randomized
fast           x 10,776 ops/sec ±1.26% (92 runs sampled)
fast double    x 9,789 ops/sec ±0.38% (93 runs sampled)
fast and slice x 6,177 ops/sec ±0.32% (96 runs sampled)
fast codepoint x 8,202 ops/sec ±1.04% (93 runs sampled)
Intl.Collator  x 3,786 ops/sec ±0.39% (93 runs sampled)
localeCompare  x 3,431 ops/sec ±0.50% (94 runs sampled)

Benchmarking comparison algorithms for trees...

Running test of: english words
fast           x 0.40 ops/sec ±2.35% (5 runs sampled)
fast double    x 0.36 ops/sec ±1.33% (5 runs sampled)
fast and slice x 0.28 ops/sec ±1.56% (5 runs sampled)
fast codepoint x 0.32 ops/sec ±2.45% (5 runs sampled)
Intl.Collator  x 0.24 ops/sec ±4.09% (5 runs sampled)
localeCompare  x 0.22 ops/sec ±0.87% (5 runs sampled)

Running test of: english words reversed
fast           x 0.38 ops/sec ±1.87% (5 runs sampled)
fast double    x 0.36 ops/sec ±2.17% (5 runs sampled)
fast and slice x 0.28 ops/sec ±5.81% (5 runs sampled)
fast codepoint x 0.32 ops/sec ±1.70% (5 runs sampled)
Intl.Collator  x 0.24 ops/sec ±0.98% (5 runs sampled)
localeCompare  x 0.22 ops/sec ±0.86% (5 runs sampled)

Running test of: english words randomized
fast           x 0.38 ops/sec ±1.03% (5 runs sampled)
fast double    x 0.36 ops/sec ±1.42% (5 runs sampled)
fast and slice x 0.28 ops/sec ±1.35% (5 runs sampled)
fast codepoint x 0.33 ops/sec ±4.34% (5 runs sampled)
Intl.Collator  x 0.24 ops/sec ±0.79% (5 runs sampled)
localeCompare  x 0.22 ops/sec ±1.07% (5 runs sampled)

Running test of: data type words
fast           x 2,688 ops/sec ±0.69% (91 runs sampled)
fast double    x 2,386 ops/sec ±0.77% (95 runs sampled)
fast and slice x 1,653 ops/sec ±0.44% (95 runs sampled)
fast codepoint x 1,898 ops/sec ±0.52% (93 runs sampled)
Intl.Collator  x 1,259 ops/sec ±0.38% (93 runs sampled)
localeCompare  x 1,143 ops/sec ±0.48% (94 runs sampled)

Running test of: data type words reversed
fast           x 2,728 ops/sec ±0.84% (92 runs sampled)
fast double    x 2,389 ops/sec ±0.45% (94 runs sampled)
fast and slice x 1,654 ops/sec ±0.38% (94 runs sampled)
fast codepoint x 1,913 ops/sec ±0.34% (95 runs sampled)
Intl.Collator  x 1,272 ops/sec ±0.39% (94 runs sampled)
localeCompare  x 1,143 ops/sec ±0.54% (93 runs sampled)

Running test of: data type words randomized
fast           x 2,723 ops/sec ±0.73% (94 runs sampled)
fast double    x 2,399 ops/sec ±0.39% (95 runs sampled)
fast and slice x 1,639 ops/sec ±0.56% (93 runs sampled)
fast codepoint x 1,919 ops/sec ±0.44% (93 runs sampled)
Intl.Collator  x 1,272 ops/sec ±0.38% (93 runs sampled)
localeCompare  x 1,140 ops/sec ±0.89% (91 runs sampled)
```

</p>
</details>


[npm-image]: https://img.shields.io/npm/v/fast-string-compare.svg
[npm-url]: https://npmjs.org/package/fast-string-compare
[downloads-image]: https://img.shields.io/npm/dm/fast-string-compare.svg
[build-image]: https://img.shields.io/github/workflow/status/grantila/fast-string-compare/Master.svg
[build-url]: https://github.com/grantila/fast-string-compare/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/fast-string-compare/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/fast-string-compare?branch=master
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/fast-string-compare.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/fast-string-compare/context:javascript
[node-version]: https://img.shields.io/node/v/fast-string-compare
[node-url]: https://nodejs.org/en/

[mdn-localecompare]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
[mdn-sort]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[mdn-collator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator
