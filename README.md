# grunt-asset-render

> injects assets into templates

[![Build Status](https://travis-ci.org/kagia/grunt-asset-render.png?branch=v2.0.0)](https://travis-ci.org/kagia/grunt-asset-render)

[![NPM](https://nodei.co/npm/grunt-asset-render.png?downloads=true)](https://nodei.co/npm/grunt-asset-render/)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-asset-render --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asset-render');
```

## The "asset_render" task

### Quick Start!
Lets assume you want to link scripts into your HTML.

  1. start by creating an entry in your Gruntfile.
    ```js
    grunt.initConfig({
      asset_render: {
        link_my_scripts: {
          cwd: '../../path/to/my/website',
          src: ['js/*.js', 'js/vendor/*.js'],
          dest: '../path/to/my/website/index.html'
        }
      }
    });
    ```

    it's important to set your `cwd` to the path you want your resources to be relative to.

  2. next we need a template. here's mine `templates/scripts.handlebars`.
    ```handlebars
    {{#files}}
    <script src="{{file}}"></script>
    {{/files}}
    ```

  3. lets update our configuration.
    ```js
    grunt.initConfig({
      asset_render: {
        link_my_scripts: {
          options: {
            template: 'templates/scripts.handlebars',
            inject: true,
          },
          cwd: '../../path/to/my/website',
          src: ['js/*.js', 'js/vendor/*.js'],
          dest: '../path/to/my/website/index.html'
        }
      }
    });
    ```

  4. That's it. now you can do this.
    ```shell
    grunt asset_render:link_my_scripts
    ```

  5. Assuming you've included the `<!-- START -->` and `<!-- END -->` tags in your html, your html will now look like:
     ```html
     <html>
      <head>
        <!-- START -->
        <script src="js/myscript.js"></script>
        <script src="js/vendor/script.js"></script>
        <!-- END -->
      </head>
     <body>....</body>
     </html>
     ```

     For more customization options, and mind-blowing features see below!
    
=====

### Options

#### options.template (required)
Type: `String`

the path to your handlebars template.

#### options.inject
Type: `Boolean`
Default value: `false`

if this is true, templates will be merged into the destination file rather than overwriting it.
Useful for linking assets (i.e, stylesheets, scripts, e.t.c)

#### options.promotions
Type: `Array`
Default value: `[]`

useful if certain assets need to be prioritized over others.
Read the section on [promotions](#promotions) below.

### Injection options.
The options below are only used when `options.inject` is `true`
Read the sction on [injection](#injection) below.

#### options.delimiters
Type: `String`
Default value: `'<!-- -->'`

the injection engine uses these to locate opening and closing tags.
**note** they are space separated.

#### options.start_word
Type: `String`
Default value: `'START'`

the injection engine uses this to validate an opening tag.

#### options.end_word
Type: `String`
Default value: `'END'`

the injection engine uses this to validate a closing tag.

## Usage Examples

#### Rendering templates
In this example, we use a template to render several files.

Our template

`templates/list_assets.handlebars`
```handlebars
<ul>
{{#files}}
    <li>{{file}}</li>
{{/files}}
</ul>
```


Our Task Configuration

`Gruntfile.js`
```js
asset_render: {
  render_to_file: {
    options: {
      template: 'templates/list_assets.handlebars'
    },

    files: {
      'dest/my_scripts.html': 'js/**/*.js',
      'dest/my_images.html': 'img/**/*{jpg,png,jpeg}',
      'dest/my_documents.html': [
                              'docs/budget/june2013.xls',
                              'docs/statements/*.pdf',
                              '!docs/statements/*2012.pdf'
                              ],
    }
  },
},
```


With the above configuration, the task will create several files. Lets look at one of them:

`dest/my_images.html`
```html
<ul>
  <li>img/me/myface.jpg</li>
  <li>img/icanhazcheezeburger.png</li>
</ul>
```

## Injection
Rendering templates is already cool, but usually we want to include our templates into other files.

We can use the injection feature to achieve this. The injection engine examines the destination file for opening and closing
tags, by default `'<!-- START -->'` and `'<!-- END -->'`. The injection engine will replace the content of these tags with your template.

First we define our destination file.

`dest/index.html`
```html
<html>
  <head>
    <title>my image gallery</title>
    <style>
    .thumbnail {float:left;}
    </style>
  </head>
  <body>
    <!-- START -->
    <!-- END -->
  </body>
</html>
```

Then our template.

`templates/thumbnails.handlebars`
```handlebars
{{#files}}
  <div class="thumbnail">
    <img src="{{file}}">
  </div>
{{/files}}
```

And finally remember to activate the `inject` option.

`Gruntfile.js`
```js
asset_render: {
  my_cat_gallery: {
    options: {
      template: 'templates/thumbnails.handlebars',
      inject: true,
    },

    files: {
      'dest/index.html': 'gallery/cats/**/*'
    }
  },
}
```

The result is that our rendered template will be merged into the destination file, so:
```html
<html>
  <head>
    <title>my image gallery</title>
    <style>
    .thumbnail {float:left;}
    </style>
  </head>
  <body>
    <!-- START -->
    <div class="thumbnail">
      <img src="gallery/cats/socks_sleeping.jpg">
    </div>
    <div class="thumbnail">
      <img src="gallery/cats/socks_turning_away.jpg">
    </div>
    <!-- END -->
  </body>
</html>
```

## Promotions
Sometimes the order that assets are rendered is important. For example if you are using a javascript library (i.e JQuery), you would like it to be added to your page before your script or plugins. Or if one stylesheet should override another. You get the idea.

Here is an example using JQuery.
```js
asset_render: {
  scripts: {
    options: {
      template: 'templates/scripts_include.handlebars',
      inject: true,
      promotions: ['**/jquery.js', '**/jquery.*']
    },

    files: {
      'index.html': 'js/**/*.js'
    }
  }
}
```

In the above example we have two promotions.
  1. `'**/jquery.js'` this promotes JQuery
  2. `'**/jquery.*'` this promotes JQuery plugins (i.e 'jquery.fittext.js')

This means that Jquery will be promoted to the top, _then_ it's plugins, and _finally_ all other scripts will come after.

### Globing

you can use all the syntax you use to define source files. You can even do this:

```js
asset_render: {
  my_target: {
    options: {
      promotions: [
        ['js/vendor/**/*.js', '!js/vendor/indipendent.js']
      ] 
    },

    // files
  }
},
```
In the above case we want vendor styles to be priorotized but there's one that doesn't need to be prioritized; perhaps it runs on it's own. Just remember to enclose everything in an array `[]`.

Have fun, and keep it simple!

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/). All your work should be in the development branch.

## Release History
#### v1.0 presenting grunt-asset-render!

#### v1.0.1 fixes
  - fixed versioning
  - updated docs

#### v2.0.0 new features
  - now you can inject templates into other files
  - support for asset re-ordering
  - **template context has changed**
    - `urls` is now `files`
    - `url` is now `file`

#### v2.0.1 better documentation
  - fixed several typos
  - added badges incicating health of the project