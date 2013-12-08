# grunt-asset-render

> injects assets into templates

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

### Overview
In your project's Gruntfile, add a section named `asset_render` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  asset_render: {
    options: {
      template: 'path/to/template.handlebars',
    },
    your_target: {
      files: {
        'dest/output.txt' : ['css/**/*.css', 'img/file.jpg']
      }
    },
  },
});
```

### Options

#### options.template (required)
Type: `String`

the path to your handlebars template.

#### options.inject
Type: `Boolean`
Default value: `false`

if this is true, templates will be merged into the destination file rather than overwriting it.
Useful for linking assets (i.e, stylesheets, scripts, e.t.c)

### Injection options.
The options below are only used when `options.inject` is `true`

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
      'dest/index.html: 'gallery/cats/**/*'
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


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/). All your work should be in it's own branch, which inturn should be a branch of the development branch.

## Release History
### v1.0 presenting grunt-asset-render!
