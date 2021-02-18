---
layout: post
title:  "Introducing Aldrumo"
date:   2021-02-18 09:00:00 +0000
---

So technically I've already introduced and mentioned Aldrumo in previous blog posts but this is finally a dedicated post about it.

## What is it

Aldrumo is a brand new [TALL Stack](https://tallstack.dev) CMS and has risen out the ashes of a previous side project called Travito. This was a website builder for owners of holiday homes. While it didn't feature a full "Drag and Drop" WYSIWYG editor, it did feature a full page WYSIWYG editor that allowed a user to select a template and edit define blocks of content within that template.

As well as having a great WYSIWYG experience, I wanted Aldrumo to be a great developer experience. All to often, apps like this get built upon frameworks but then to get something working they modify part of the framework. Then to get something else working they modify another part and so on and so on. 

With that in mind, Aldrumo has been built as separate packages so it can be easily included into a completely vanilla Laravel / Livewire setup. No modification to these (outside of some config changes) is necessary for Aldrumo to work, meaning if you know Laravel, you know Aldrumo!

It has also been built with the same thoughts regarding the page editors, so Aldrumo does not have a "Drag and Drop" editor that allows a user to create their own templates. Instead it's up to the Theme creators to define templates that look and fit great with the design they are building. Once those templates are created, they can then define the editable areas using the tags from the Blocks package as mentioned below!

## Modular

The name Aldrumo is actually an Anagram of "Modular". I chose this as I wanted A) Something to stand out on its own and be "Google-able", and B) I liked the idea of the CMS being Modular.

Not necessarily, "Modular", in the sense that you can swap out the Theme Manager for your own Theme manager. But Modular in the sense that, if you wanted to add a Theme Manager to your own Laravel Application, you could use Aldrumo's.

A side benefit to this is unit tests! While not all the packages have tests yet, forcing myself to build them in such a modular fashion has forced me to build them in a way that makes unit testing dead easy so as time goes on, unit tests will be added further improving the developer experience and confidence in the packages.

## The Modules

While not every package that makes up Aldrumo could be taken out and used in another application, there are a few that could be helpful to people!

### Theme Manager

As it sounds, the package is used to manage the selected theme, there are a few features that need to be added to make this truly useful to other people but it's definitely a good start (and also the first package I finished for Aldrumo). But in conjunction with the Theme Installer package, this will allow you to drop themes into a Themes folder or include them via composer and this package will handle the rest.

While the Theme Manager has a method that sets the "active theme", the Theme Manager is not responsible for actually storing this anywhere, so bear that in mind if you are considering looking into this package.

```php 
resolve(ThemeManager::class)->activeTheme('MyTheme');
```

### Settings

So leading on from Theme Manager, this package is VERY bare bones and is essentially just a model and a repository at the moment. This however is perfect in combination with the above Theme Manager, as this can be used to actually store the active theme somewhere. Taken from Aldrumo core, this is how we set the active theme.

```php 
resolve(ThemeManager::class)->activeTheme(
    resolve(SettingsContract::class)->get('activeTheme')
);
```

The eventual goal for this is to bundle an "admin area" with it, that would be able to integrate with your apps admin area. I'm also tempted to integrate it with Laravels Config repository, this would allow you to use the `config()` method bundled with Laravel to get settings. That's for a future release though.

### Route Loader

This package may be less useful people but I've bundled it as a package nonetheless. The purpose of this package is to simply create the routes for all the pages. I found this approach to be better than setting a "wildcard" / "catch-all" route which I would then have to search the database for a matching slug.

Instead, on page management, the Route Loader package recompiles the routes into a file that gets included into the main routes files. Here's that file from the Aldrumo website.

```php 
use Illuminate\Support\Facades\Route;

Route::get('/', 'Aldrumo\Core\Http\Controllers\PageController')->name('route-1');
Route::get('features', 'Aldrumo\Core\Http\Controllers\PageController')->name('route-2');
Route::get('demo', 'Aldrumo\Core\Http\Controllers\PageController')->name('route-3');
```

The other thing of note here is that all the routes resolve to the same page controller with an invoke method. This is because the name of each route contains the page ID that we are loading. This way, I let Laravels route package handle the "deciding which page to show", I can then grab the page ID from the request and simply query for the page on the primary key, rather than a wildcard lookup on a string "slug" column.

```php 
protected function findPageId(Request $request) : int
{
    return str_replace('route-', '', $request->route()->getName());
}
```

### Blocks

This last package is the main bulk of the content management within Aldrumo. Sadly on its own, I'm not sure how much use people will get out of it, but I've bundled it in a package to help with the testing aspects but also in the hope that I might be able to bundle Aldrumo's WYSIWYG editor into a package at some point.

The blocks package however, has made great use of Laravel's View Components, introduced in recent versions. They've allowed me to easily define the editable areas of content and also specify a default value in a simple way.

```php 
<x-Blocks::renderer key="hero-title">
    A great new product
</x-Blocks::renderer>
```

The biggest issue I've faced so far, is knowing where and how best to define the blocks. The WYSIWYG editors generate html themselves so if you define the html outside of the block like I have in the example above, it makes it harder to do what you want to do in the editor.

But on the flip side, using Tailwind means there's a ton of classes on certain elements to give them the style required for the design. Without adding "style" options to the editor, it's difficult to maintain that look when the editor starts changing the html. e.g. Here's the full example for the hero title.

```php 
<h1 class="mb-6 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
    <x-Blocks::renderer key="hero-title">
        A great new product
    </x-Blocks::renderer>
</h1>
```

I really need to assign all those classes a single class that can be added to the editor's dropdown style menus or assign them all to the H1 within css. Either way, it's a learning curve!

## Wrapping up

That covers the packages so far that I'm defining as "modular" and they will likely have their own dedicated section in the docs for developers wanting to use them outside of Aldrumo. I'm hoping to officially release the first Alpha of Aldrumo in the next few days after this post goes out but if you're feeling really brave, the installation docs can be found in markdown format [here](https://github.com/Aldrumo/docs/blob/0.x/installation.md).

You can also checkout the main bulk of the source code [here](https://github.com/Aldrumo/), or view the themes [here](https://github.com/Aldrumo-themes).  

