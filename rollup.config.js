import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import copy from "rollup-plugin-copy";
import css from 'rollup-plugin-css-only';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import sveltePreprocess from 'svelte-preprocess';
import fs from 'fs';
import posthtml from 'posthtml';
import { hash } from 'posthtml-hash';
import rimraf from 'rimraf';
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;
const OUT_DIR = 'public';
const OUT_FILE = `${OUT_DIR}/index.html`;

const hashStatic = () => ({
  name: 'hash-static',
  writeBundle: () => {
    posthtml()
      .use(hash({ path: OUT_DIR }))
      .process(fs.readFileSync(OUT_FILE, 'utf-8'))
      .then(result => fs.writeFileSync(OUT_FILE, result.html));
  },
});

const preprocess = sveltePreprocess({
  scss: {
    includePaths: ['src'],
  },
  postcss: {
    plugins: [require('autoprefixer')],
  },
});

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: `${OUT_DIR}/bundle.[hash].js`,
  },
  plugins: [
    rimraf.sync(OUT_DIR),
    copy({ targets: [{ src: "static/*", dest: 'public' }] }),
    scss(),
    svelte({
      compilerOptions: {
        dev: !production
      },
      preprocess,
    }),
    css({ output: 'bundle.[hash].css' }),
    json(),
    commonjs(),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    !production &&
      serve({
        contentBase: [OUT_DIR],
        port: 3000,
      }),
    !production && livereload({ watch: OUT_DIR }),
    production && terser(),
    production && hashStatic(),
  ],
  onwarn: function ({ message }) {
    if ( /Circular dependency/.test(message)) return;

    console.error(message);
  },
  watch: {
    clearScreen: false
  }
};
