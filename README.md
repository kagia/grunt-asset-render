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
      template: 'path_to_my_handlebars_template',
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.template (required)
Type: `String`

the path to your handlebars template.

#### options.delimiters
Type: `String`
Default value: `'{{ }}'`

delimiters for the template engine to use.

### Usage Examples

#### Default Options
In this example, the default options are used to write script tags.

```js
grunt.initConfig({
  asset_render: {
    options: {
      template: 'templates/scripts_include.handlebars',
    },
    files: {
      'dest/output.html': 'src/**/*.js',
    },
  },
});
```
our template `templates/scripts_include.handlebars` :
```
{{#urls}}
  <script src="{{url}}"></script>
{{/urls}}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
### v1.0 presenting grunt-asset-render!
The first release!

### v1.0.1 small fixes
fixed: vesrioning
updated: documentation
