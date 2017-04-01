---
layout: post
title:  "Upgrading to Bootstrap 4 in Laravel Spark"
date:   2017-04-01 22:00:00 +0000
---

This is a post I've been meaning to write for a while however a recent post on the Laravel Slack channel gave me the nudge to actually do it!

Over the last few months I've been building myself on Spark a "Personal Planner", allowing me to add notes and tasks and most recently Projects and assigning the notes / tasks to a project. Ridiculously simple stuff and there are many like it, but this one is mine (yes, I just paraphrased Full Metal Jacket). It also serves the purpose for me to learn new things with Laravel, VueJS and Bootstrap 4!

The Bootstrap 4 bit however comes with a slight problem in that Spark ships with Bootstrap 3 and it's not a straight swap! So here are the steps that I had to take, these may not be the correct way to do it however this is how I got Laravel Spark running on Bootstrap 4.

## Frontend Assets

First step is to make sure `bower` is installed on your local development machine and create a bower.json file in the root of your project with the following contents:

	{
	  "name": "Spark-Bootstrap4",
	  "version": "1.0.0",
	  "author": "Mike Barlow <mike@mikebarlow.co.uk>",
	  "dependencies": {
	    "bootstrap": "bootstrap#v4.0.0-alpha.6",
	    "font-awesome": "fontawesome#^4.7.0"
	  }
	}

Then within your command line run `bower install`, this should create a `bower_components` folder in the root of your project.

Spark as default uses LESS, the new Bootstrap ships with SASS as it's default css processer of choice, within `resources/assets` create a `scss` folder. Within the scss folder create `_variables.scss` and `app.scss`. Use the `_variables.scss` file to overwrite any default bootstrap variables to change brand colours, padding, typography etc... Inside the `app.scss` file add the following lines:

	@import "variables";
	@import "bower_components/bootstrap/scss/bootstrap";
	@import "bower_components/font-awesome/scss/font-awesome";
	
Next you will need to open up the Laravel Mix config file found in the root of Spark called `webpack.mix.js`. The first line of Mix config in this file should read

	mix.less('resources/assets/less/app.less', 'public/css')
	
Change this to

	mix.sass('resources/assets/scss/app.scss', 'public/css')

Once that has been done, run `npm run dev` within your command line to recompile your frontend assets.

That will replace the default Spark css with a plain css file with Bootstrap 4, at this point you may notice the site still looks broken! Fear not there are more changes ahead.

The above only amends the style, Bootstrap also comes with loads of JS goodies, to swap out the Bootstrap JS file we need to redefine some more files.








