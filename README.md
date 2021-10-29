# Acamp Gallery

The gallery used at [Acamp](https://acamp.com/), now available for your pages!

![Demo](/assets/example.gif)

Try out a demo [here](https://judithsirera.github.io/acamp-gallery/)

## Install

```js
npm i @judsirera/acamp-gallery
```

## Props

| Prop            | type                  | Description                                                                                                             | Default Value                                                  |
| --------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `images`        | `Array`               | Array of image URL                                                                                                      | `[]`                                                           |
| `initialImage`  | `Number`              | The index of the active image on mount                                                                                  | `0`                                                            |
| `height`        | `Number`              | The height of the wrapper component (in px)                                                                             | `460`                                                          |
| `columnGutter`  | `Number`              | The margin between slides (in px)                                                                                       | `20`                                                           |
| `columnWidth`   | `Number`              | The width of the non-active slides (in px)                                                                              | `75`                                                           |
| `sideColumns`   | `Number`              | The number of side columns considering only one side.                                                                   | `2`                                                            |
| `containImage`  | `String`              | Whether the gallery should render the image with full height. Possible values: `"contain"`, `"contain_active"`, `"off"` | `"off"`                                                        |
| `activeOnHover` | `Boolean`             | Set to true if you want to active an image on hover                                                                     | `false`                                                        |
| `navigation`    | `Boolean` or `Object` | Sets the properties for navigation. Accepts `true`, `false` or `{ className: '', showWhenOneImageOrLess: ''}`           | `true`. When there's less than one image, navigation is hidden |
| `loaderElement` | `node`                | The node element to render when loading at start                                                                        | `null`                                                         |

## Style Import

```js
import '@judsirera/acamp-gallery/styles/css/acamp-gallery.css';

import '@judsirera/acamp-gallery/styles/scss/acamp-gallery.scss';
```

or as link in the head of your html

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@judsirera/acamp-gallery/styles/css/acamp-gallery.css"
/>

<link
  rel="stylesheet"
  href="https://unpkg.com/@judsirera/acamp-gallery/styles/scss/acamp-gallery.scss"
/>
```

## Example

```js
const IMAGES = Array.from(Array(5), () => 'https://via.placeholder.com/300x200');

<AcampGallery
  images={IMAGES}
  height={460}
  columnGutter={20}
  columnWidth={75}
  sideColumns={2}
  containImage={AcampGallery.CONTAIN_OFF}
  activeOnHover={false}
  navigation={{
    className: 'your-navigation-classname',
    showWhenOneImageOrLess: false
  }}
  className='your-gallery-wrapper-classname'
/>;
```

## Credits

Designed by [Marija Vitasovic](https://marija.lynxdev.io/) and implemented by [Judith Sirera](http://judithsirera.com/) while working at [Acamp](https://www.acamp.com/)
