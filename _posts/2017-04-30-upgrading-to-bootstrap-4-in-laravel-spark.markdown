---
layout: post
title:  "Upgrading to Bootstrap 4 in Laravel Spark"
date:   2017-04-30 22:00:00 +0000
---

This is a post I've been meaning to write for a while however a recent post on the Laravel Slack channel gave me the nudge to actually do it!

Over the last few months I've been building myself on Spark a "Personal Planner", allowing me to add notes and tasks and most recently Projects and assigning the notes / tasks to a project. Ridiculously simple stuff and there are many like it, but this one is mine (yes, I just quoted Full Metal Jacket). It also serves the purpose for me to learn new things with Laravel, VueJS and Bootstrap 4!

The Bootstrap 4 bit however comes with a slight problem in that Spark ships with Bootstrap 3 and it's not a straight swap! So here are the steps that I had to take, these may not be the correct way to do it however this is how I got Laravel Spark running on Bootstrap 4. It's also worth noting that this will **NOT** port the default Spark skin and it's assumed you will modify Spark design / colours to suit your own needs.

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

Spark as default uses LESS, the new Bootstrap ships with SASS as it's default css processer of choice, so within `resources/assets` create a `scss` folder. Within the scss folder create `_variables.scss` and `app.scss`. Use the `_variables.scss` file to overwrite any default bootstrap variables to change brand colours, padding, typography etc... Inside the `app.scss` file add the following lines:

	@import "variables";
	@import "bower_components/bootstrap/scss/bootstrap";
	@import "bower_components/font-awesome/scss/font-awesome";

Next you will need to open up the Laravel Mix config file found in the root of Spark called `webpack.mix.js`. The first line of Mix config in this file should read

	mix.less('resources/assets/less/app.less', 'public/css')

Change this to

	mix.sass('resources/assets/scss/app.scss', 'public/css')

Then add `'bower_components'` to the `webpackConfig` method underneath `node_modules`:

	.webpackConfig({
	    resolve: {
	        modules: [
	            path.resolve(__dirname, 'vendor/laravel/spark/resources/assets/js'),
	            'node_modules',
	            'bower_components'
	        ],
	        alias: {
	            'vue$': 'vue/dist/vue.js'
	        }
	    }
	});

This let's WebPack know the folder exists as a place to load files from. Once that has been done, run `npm run dev` within your command line to recompile your frontend assets.

That will replace the default Spark css with a plain css file with Bootstrap 4. At this point the layout will likely break as we will have now lost Spark styling. Either start styling to suit your needs now or follow on to finish the port before styling!

The above only amends Bootstrap CSS, Bootstrap also comes with loads of JS goodies. To swap out the Bootstrap JS file we need to redefine a Spark bootstrap file.

Copy out the file found at `spark/resources/assets/js/spark-bootstrap.js` and paste it into `resources/assets/js/spark-bootstrap.js` and open it. Find the line `require('bootstrap/dist/js/npm');` (around L41) and replace it with `require('bootstrap/dist/js/bootstrap.min');`.

Next open up `resources/assets/js/app.js` and modify `require('spark-bootstrap');` by prepending ./ to spark-bootstrap, so it reads `require('./spark-bootstrap');`. Once complete run `npm run dev` to recompile the JS.

At this point the CSS / JS switch is pretty much complete, from here you should be able to start building your own theme for Spark in Bootstrap 4. There are some compatibility changes required however for the prebuilt Spark sections such as user settings and Kiosk due to changes between Bootstrap 3 and 4.

## Compatability Changes

First thing to note is "panels" are no longer a thing within Bootstrap 4 so you will need to amend every instance of a panel within the default Spark templates.

I'll post one example change below, this is from the `update-extra-billing-information.blade.php` file.

	<spark-update-extra-billing-information :user="user" :team="team" :billable-type="billableType" inline-template>
	    <div class="panel panel-default">
	        <div class="panel-heading">Extra Billing Information</div>

	        <div class="panel-body">
	            <!-- Information Message -->
	            <div class="alert alert-info">
	                This information will appear on all of your receipts, and is a great place to add your full
	                business name, VAT number, or address of record. Do not include any confidential or
	                financial information such as credit card numbers.
	            </div>

	            <!-- Success Message -->
	            <div class="alert alert-success" v-if="form.successful">
	                Your billing information has been updated!
	            </div>

	            <!-- Extra Billing Information -->
	            <form class="form-horizontal" role="form">
	                <div class="form-group" :class="{'has-error': form.errors.has('information')}">
	                    <div class="col-md-12">
	                        <textarea class="form-control" rows="7" v-model="form.information" style="font-family: monospace;"></textarea>

	                        <span class="help-block" v-show="form.errors.has('information')">
	                            @{{ form.errors.get('information') }}
	                        </span>
	                    </div>
	                </div>

	                <!-- Update Button -->
	                <div class="form-group m-b-none">
	                    <div class="col-md-offset-4 col-md-8 text-right">
	                        <button type="submit" class="btn btn-primary" @click.prevent="update" :disabled="form.busy">
	                            Update
	                        </button>
	                    </div>
	                </div>
	            </form>
	        </div>
	    </div>
	</spark-update-extra-billing-information>

Within my project, this became

	<spark-update-extra-billing-information :user="user" :team="team" :billable-type="billableType" inline-template>
	    <div class="card card-info">
	        <h5 class="card-header text-white">Extra Billing Information</h5>

	        <div class="card-block">
	            <!-- Information Message -->
	            <div class="alert alert-info">
	                This information will appear on all of your receipts, and is a great place to add your full
	                business name, VAT number, or address of record. Do not include any confidential or
	                financial information such as credit card numbers.
	            </div>

	            <!-- Success Message -->
	            <div class="alert alert-success" v-if="form.successful">
	                Your billing information has been updated!
	            </div>

	            <!-- Extra Billing Information -->
	            <form class="form-horizontal" role="form">
	                <div class="form-group" :class="{'has-error': form.errors.has('information')}">
	                    <div class="col-md-12">
	                        <textarea class="form-control" rows="7" v-model="form.information" style="font-family: monospace;"></textarea>

	                        <span class="help-block" v-show="form.errors.has('information')">
	                            @{{ form.errors.get('information') }}
	                        </span>
	                    </div>
	                </div>

	                <!-- Update Button -->
	                <div class="form-group m-b-none">
	                    <div class="col-md-offset-4 col-md-8 text-right">
	                        <button type="submit" class="btn btn-primary" @click.prevent="update" :disabled="form.busy">
	                            Update
	                        </button>
	                    </div>
	                </div>
	            </form>
	        </div>
	    </div>
	</spark-update-extra-billing-information>

It's worth noting here as well, that Cards now change the colour of everything within the Card. Previously specifying `panel-danger` would only change the panel header and border colours. With cards, specifying `card-danger` will change the card header and body. If you want to revert back to a more panel like setup, below is the SASS that I used to accomplish this, you may need to modifying it to suit your needs. I simply placed this within my `app.scss` file under the last _@import_.

	.card.card-primary,
	.card.card-success,
	.card.card-danger,
	.card.card-warning,
	.card.card-info {
	    .card-block,
	    .card-footer {
	        background-color: #fff;
	    }
	}

I repeated this for all the panels within the settings area, simply changing the card "type" to get different coloured cards for my settings.

Next change was amending the grid. Previously `col-xs-X` would specify a column size on the smallest screen size, this is no longer in use, simply use `col-X`, where _X_ is the number of columns. The main places these are in, are within the `update-payment-method-stripe.blade.php` file for the card expiration dates.

For the settings menu, the list group can now sit as a direct child of the card element and use the `list-group-flush` class.

	<div class="card card-success">
	    <h5 class="card-header misc text-white">Settings</h5>

	    <div class="spark-settings-tabs">
	        <ul class="list-group list-group-flush" role="tablist">
	            <li class="list-group-item" role="presentation">
	                <a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">
	                    <i class="fa fa-fw fa-btn fa-edit"></i>Profile
	                </a>
	            </li>

	            <!-- Teams Link -->
	            @if (Spark::usesTeams())
	                <li class="list-group-item" role="presentation">
	                    <a href="#{{str_plural(Spark::teamString())}}" aria-controls="teams" role="tab" data-toggle="tab">
	                        <i class="fa fa-fw fa-btn fa-users"></i>{{ ucfirst(str_plural(Spark::teamString())) }}
	                    </a>
	                </li>
	            @endif

	            <!-- Security Link -->
	            <li class="list-group-item" role="presentation">
	                <a href="#security" aria-controls="security" role="tab" data-toggle="tab">
	                    <i class="fa fa-fw fa-btn fa-lock"></i>Security
	                </a>
	            </li>

	            <!-- API Link -->
	            @if (Spark::usesApi())
	                <li class="list-group-item" role="presentation">
	                    <a href="#api" aria-controls="api" role="tab" data-toggle="tab">
	                        <i class="fa fa-fw fa-btn fa-cubes"></i>API
	                    </a>
	                </li>
	            @endif
	        </ul>
	    </div>
	</div>

For the last HTML change, the structure of dropdown menus has also changed. This example is taken from my personal project, so it's missing a few of the default links that Spark comes with but it should give you the idea. The biggest change is the way the dropdown-menu elements are written:

    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="/" id="userMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-user hidden-md-down"></i> {{ Auth::user()->name }}
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userMenu">
            <a class="dropdown-item" href="/settings">Settings</a>
            <a class="dropdown-item" href="/logout">Logout</a>

            <div class="dropdown-divider"></div>

            <a class="dropdown-item" href="#" @click.prevent="addModal">
                New Project
            </a>
            <a class="dropdown-item" href="#">
                Manage Projects
            </a>
        </div>
    </li>

The last amend I had to make involved amending some more VueJS components. Bootstrap changed where the `active` class sits within a list. In Bootstrap 3 the "li" of a list group has the active class, whereas in 4 in sits on the "a" tag itself. This causes problems with some of the Spark tab switching code.

Again there are a few files to copy from Spark and amend, the first one is simply copied so we can modify the mixin that is attached.

Copy `spark/resources/assets/js/settings/settings.js` into `resources/assets/js/spark/settings/settings.js`. Next copy `spark/resources/assets/js/mixins/tab-state.js`into `resources/assets/js/mixins/tab-state.js` and open it.

This is the main mixin that handles the switching of tabs within Spark. Find the following method

	removeActiveClassFromTabs() {
	    $(`${this.pushStateSelector} li`).removeClass('active');
	},

and amend the "li" to "a" like so

	removeActiveClassFromTabs() {
	    $(`${this.pushStateSelector} a`).removeClass('active');
	},

Finally, open `resources/assets/js/spark-components/settings/settings.js` and amend the very top line `var base = require('settings/settings');` to read `var base = require('./../../spark/settings/settings');`. This will make Vue / JS load up the settings file we duplicated above, which in turn will load the modified tab-state mixin file!

Re-run `npm run dev` to recompile the JS changes and that should be the port complete. Simply carry on and build / skin Spark as you need for your application.

Apologies if anything was missed from this guide, I didn't think to write a lot of this down at the time when I first did all this so a lot has come from memory and playing with a new Spark installation.

If you're lazy like me, you will find within this [GitHub Repository](https://github.com/mikebarlow/spark-bootstrap-4-settings), a copy of my Settings area blade templates. Some of these templates were converted to Bootstrap 4 and although there has been numerous sections removed or modified for use within my Spark application, it will at least serve as a basis with the majority of the panels and grid columns amended!

Any questions I shall do my best to answer, you can find me on twitter [@mikebarlow](http://twitter.com/mikebarlow).