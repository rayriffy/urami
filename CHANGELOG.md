# svelte-aio

## 1.0.2

### Patch Changes

- e655f63: documented `moduleResolution` as optional steps
- 2580f27: keywords tagging

## 1.0.1

### Patch Changes

- c18fb00: missing `publishConfig` in package.json

## 1.0.0

### Major Changes

- 1cef3ef: - **BREAKING CHANGES:** modification of `tsconfig.json` is required to properly resolve this module
  - **BREAKING CHANGES:** minimum version of svelte is now 4.0.0
  - many dependencies updated
  - image component props can now be extended via `{...$$restProps}` props
  - default image quality has been changed from 75 to 73 (thanks to @cubedhuang!)
