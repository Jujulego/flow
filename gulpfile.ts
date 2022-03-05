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

// Tasks
gulp.task('clean', () => del('dist'));

gulp.task('build:cjs', () => gulp.src(paths.src, { since: gulp.lastRun('build:cjs') })
  .pipe(sourcemaps.init())
  .pipe(babel({ envName: 'cjs' } as Parameters<typeof babel>[0]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/cjs'))
);

gulp.task('build:esm', () => gulp.src(paths.src, { since: gulp.lastRun('build:esm') })
  .pipe(sourcemaps.init())
  .pipe(babel({ envName: 'esm' } as Parameters<typeof babel>[0]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/esm'))
);

gulp.task('build:types', () => gulp.src(paths.src, { since: gulp.lastRun('build:types') })
  .pipe(sourcemaps.init())
  .pipe(tsProject()).dts
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/types'))
);

gulp.task('build', gulp.parallel('build:cjs', 'build:esm', 'build:types'));

gulp.task('watch', () => gulp.watch([paths.src, ...paths.deps], { ignoreInitial: false },
  gulp.parallel('build:cjs', 'build:esm', 'build:types')
));
