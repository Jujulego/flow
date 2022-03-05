# @jujulego/flow
[![Version](https://img.shields.io/npm/v/@jujulego/flow)](https://www.npmjs.com/package/@jujulego/flow)
![Licence](https://img.shields.io/github/license/jujulego/flow)
[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

NodeJS Stream pipe sugar syntax.

# Installation
```shell
yarn add @jujulego/flow
```

# Usage
This package provides 2 utilities.
- `flow` will pipe each stream given in it's arguments and return the result stream
- `step` group some streams so they can be reused in many flows.

## Examples
### in a gulpfile
If we take the current project [gulpfile.ts](https://github.com/Jujulego/flow/blob/master/gulpfile.ts). It could be simplified: 

```typescript
import { flow, step } from '@jujulego/flow';
import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import ts from 'gulp-typescript';

// Config
const paths = {
  src: 'src/**/*.ts',
  deps: [
    '../../.pnp.*',
  ]
};

const tsProject = ts.createProject('tsconfig.json', {
  isolatedModules: false,
  declaration: true,
  emitDeclarationOnly: true
});

// Steps
const src = (task: string) => step(
  gulp.src(paths.src, { since: gulp.lastRun(task) }),
  sourcemaps.init()
);

const dest = (dir: string) => step(
  sourcemaps.write('.'),
  gulp.dest(dir),
);

// Tasks
gulp.task('clean', () => del('dist'));

gulp.task('build:cjs', () => flow(
  src('build:cjs'),
  babel({ envName: 'cjs' } as Parameters<typeof babel>[0]),
  dest('dist/cjs'),
));

gulp.task('build:esm', () => flow(
  src('build:esm'),
  babel({ envName: 'esm' } as Parameters<typeof babel>[0]),
  dest('dist/esm'),
));

gulp.task('build:types', () => flow(
  src('build:types'),
  tsProject().dts,
  dest('dist/types'),
));

gulp.task('build', gulp.parallel('build:cjs', 'build:esm', 'build:types'));

gulp.task('watch', () => gulp.watch([paths.src, ...paths.deps], { ignoreInitial: false },
  gulp.parallel('build:cjs', 'build:esm', 'build:types')
));

```
