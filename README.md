# June 2018 Update

This update involves making both the Jekyll project and compiled _site folder run using Gulp. It also includes the recent inclusion of Bootstrap 4 to the base template. It also removes Bower and introduces yarn for package management (At this stage for dev dependencies). The Jekyll build is managed by Gulp as well as introducing sourcemaps for easier development and finding the location of Sass affecting an element in Chrome dev tools. It also introduces watch tasks and uses browser sync to see changes instantly in the browser. The following is needed to run the project:

* Clone this repo/pull this branch and checkout to this branch
* Ensure you have node, npm, ruby, bundler and yarn installed globally
* Cd to repo and run yarn (All gulp dev dependencies are in the package.json file)
* Run bundle install
* Run gulp

Your project should build and browser sync should work. Making changes to Sass, JS or HTML pges should automatically update the _site and reload the page. To run Gulp on the _site folder, copy the _site folder to another location and rename it. Then cd to this new folder, run yarn and then gulp. This should behave the same way as the Jekyll project with watch tasks and browser sync enabled on HTML, Sass and JS.

## Plugin installation

There is a new Gulp setup to install a plugin that runs tasks to complete the following:

* Clone plugin repo to project
* Copy folders from selected plugin to _data, _includes, _scss, css/imgs, gulp_config and js
* Write necessary lines to _plugins.scss, gulp_config/plugins.js array and _data/plugins.yml
* Delete the frontend plugins repo

To run the task run gulp download_plugin --plugin plugin-name. e.g. download_plugin --plugin affiliates-list

Run gulp and your plugin should be installed