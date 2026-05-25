# bug-bounty-challenge-osapiens

Small React + TypeScript app from osapiens with a handful of bugs to find and
fix. Originally a CodeSandbox starter (`react-scripts@4.0.3`, MUI 5, MobX,
react-router 5, i18next).

## Running it

```
npm install
npm start
```

Then open http://localhost:3000. The HashRouter sends you to `/#/home`.

A few setup notes baked into the repo so this Just Works on any Node version
and on CodeSandbox:

- `.npmrc` sets `legacy-peer-deps=true` — the dep tree has a few unresolvable
  peer ranges (MUI 5 wanting React 18 while we're on 17, mostly), so without
  this npm 7+ refuses to install.
- The `start` / `build` / `test` scripts wrap `react-scripts` in
  `cross-env NODE_OPTIONS=--openssl-legacy-provider`. `react-scripts@4` ships
  webpack 4, which uses the old OpenSSL provider that was removed in Node 17.
  Without the flag Node 17+ blows up with `ERR_OSSL_EVP_UNSUPPORTED` the
  moment webpack tries to hash a module.
- `.codesandbox/tasks.json` tells the new CodeSandbox Devbox runtime to run
  `npm install` then `npm start` and forward port 3000.

## Bugs fixed

Listed in the order I hit them:

- `urser` typo in `UserStore.getOwnUser` was assigning to the wrong field, so
  the avatar never appeared even though the fetch "succeeded".
- `AvatarMenu` was a plain function component but `<Grow>` wraps it and needs a
  ref to do its enter animation. The ref came back null and MUI tried to read
  `scrollTop` on it, which threw and unmounted the whole tree (this is what was
  showing the white page — the splashscreen sits on top at z-index 1000 and
  never gets removed if the React tree crashes). Wrapped it in `forwardRef`
  and attached the ref to the root div. Did the same for `AppHeader`, which
  had the same problem with `<Slide>`.
- The `setInterval` in `AppHeader` had no cleanup, so each remount/HMR added
  another timer — that's the "countdown sometimes runs too fast" glitch.
- Missing `key` on the issue list in `pages/Home`.
- `home.intro` contains `<b>known</b>` literally, but it was being rendered
  with `t()` so the tags showed up as text. Switched to `<Trans>` with a `b`
  component so the HTML is interpreted, without changing the i18n string.
- `services/index.tsx` was doing `import User from "./User"` but that module
  only has named exports. Pulled `StoreProvider` instead.

## Other things I had to touch first

The dev server initially blew up with `Syntax error: Missing semicolon` on
every file that used `as Type`. That was misleading — the message looks like
a Babel parser error but it's actually `eslint-webpack-plugin` reformatting
ESLint's `Parsing error: ...`. The project had no `.eslintrc`, so ESLint fell
back to the baseline that ships with `react-scripts` (which uses
`babel-eslint` for everything). Added `"eslintConfig": { "extends":
"react-app" }` to `package.json` so the TypeScript override kicks in and ESLint
uses `@typescript-eslint/parser` for `.ts(x)` files.

After that the browser overlay started complaining about a wall of parse
errors inside `node_modules/@types/node`. `typescript@4.4.2` (the pinned
version) is from 2021 and can't parse the syntax in the much newer hoisted
type packages — `skipLibCheck` skips type-checking but not parsing. Bumped to
`typescript@4.9.5` (still inside react-scripts 4's `^3.2.1 || ^4` peer range)
and the lib parse errors went away, exposing the real source-code type
errors.

Also installed `@types/react-router-dom@5` since the project uses
react-router-dom 5 and `react-router-dom` itself ships no types.

## Optional bits

- Added a small `LanguageSwitcher` (`EN` / `DE`) in the app bar.
- Filled in `i18n/locales/de.json` (was an empty object) with German strings
  for everything, including the issue list, so the switcher actually does
  something visible.
