---
layout: post
title:  "Creating expressive API responses in Laravel"
date:   2021-04-11 19:30:00 +0000
---

Sometimes simple is better and seeing the number of stars on this package of mine is testament to that. 

Writing a post about my [Laravel Response Helpers](https://github.com/mikebarlow/laravel-response-helpers) has been something on my todo list for a while but such a simple package, it never seemed worth the time. While only a small number, at the time of writing, it currently has 34 stars on Github but this is already the "most popular" package I've created. 

With zero advertising, other than a submission to [Laravel News links](https://laravel-news.com/links) section, people have still managed to find it, resulting in it getting stars on and off ever since I first published.

## What is it?

At its core, it's essentially a wrapper around the default `response()` function that Laravel provides, but it allows you to expressively define the responses for your Laravel APIs.

In your API controllers, the following response examples may be familiar.

```php
public function updateItem(Request $request, int $id)
{
    if (! Str::contains(strtolower($request->header('Content-Type')), 'application/json')) {
        return response(
            [
                'error' => 'Your request must have a valid content type set.',
            ],       
            \Illuminate\Http\Response::HTTP_BAD_REQUEST,
            [
                'Content-Type' => 'application/json',
                'x-foo'        => 'bar',
            ]
        );   
    }

    $myItem = Item::find($id);
    if ($myItem === null) {
        return response(
            [
                'error' => 'Item was not found.',
            ],       
            \Illuminate\Http\Response::HTTP_NOT_FOUND,
            [
                'Content-Type' => 'application/json',
                'x-foo'        => 'bar',
            ]
        );
    }
    
    try {
        $myItem->foobar = $request->input('foobar');
        $myItem->save();
    } catch (\Exception $e) {
        return response(
            [
                'error' => 'Something went wrong saving the update.',
            ],       
            \Illuminate\Http\Response::HTTP_INTERNAL_SERVER_ERROR,
            [
                'Content-Type' => 'application/json',
                'x-foo'        => 'bar',
            ]
        );
    }
      
    return response(
        [
            'error' => 'Item Saved!',
        ],       
        \Illuminate\Http\Response::HTTP_OK,
        [
            'Content-Type' => 'application/json',
            'x-foo'        => 'bar',
        ]
    );
}
```

Yes, that isn't a perfect way of handling an update request, but hopefully some of it looks familiar with having different response methods dotted throughout, all with different HTTP codes being sent.

I encounted this last year while building out the API for [Showhost](https://showhost.co) in my day job and after a few endpoints it was starting to get tiresome. Especially when coming to debug endpoints, fix bugs, add new features etc... That I thought there had got to be a way to make this easier to read and scan through.

Introducing my [Laravel Response Helpers](https://github.com/mikebarlow/laravel-response-helpers), as mentioned at the beginning of this post, they are essentially just a wrapper for the response methods above but they can make your controllers / endpoints much more expressive and easier to read when revisiting the code at a later date. 

Using the helpers, the above example can become this:

```php
public function updateItem(Request $request, int $id)
{
    if (! Str::contains(strtolower($request->header('Content-Type')), 'application/json')) {
        return badRequest(
            [
                'error' => 'Your request must have a valid content type set.',
            ],
            [
                'Content-Type' => 'application/json',
                'x-foo'        => 'bar',
            ]
        );   
    }

    $myItem = Item::find($id);
    if ($myItem === null) {
        return notFound(
            [
                'error' => 'Item was not found.',
            ], 
            [
                'Content-Type' => 'application/json',
                'x-foo'        => 'bar',
            ]
        );
    }
    
    try {
        $myItem->foobar = $request->input('foobar');
        $myItem->save();
    } catch (\Exception $e) {
        return internalServerError(
            [
                'error' => 'Something went wrong saving the update.',
            ],
            [
                'Content-Type' => 'application/json',
                'x-foo'        => 'bar',
            ]
        );
    }
      
    return ok(
        [
            'error' => 'Item Saved!',
        ],
        [
            'Content-Type' => 'application/json',
            'x-foo'        => 'bar',
        ]
    );
}
```

Instantly having the response code / status as part of the response function name, I found, makes it so much easier to scan down the file and instantly know what that response is going to return!

I created a whole host of wrappers for (I think), the most common response types that will be needed when creating an API. Please do create a PR or log and issue if you feel like I've missed some obvious ones!

Some other useful helpers are:

```php
created($content = '', array $headers = []);

movedPermanently($newUrl, array $headers = []);

temporaryRedirect($tempUrl, array $headers = []);

unauthorized($content = '', array $headers = []);

unprocessableEntity($content = '', array $headers = []);
```

## Eloquent: API Resources

The `$content` variables in the wrappers, essentially map directly to the `$content` within the default `response()` function. This means, anything you would have previously passed into the response function, you can pass into the wrappers.

This includes Eloquent's API resources, Laravel will automatically detect an API resource and run some extra formatting on it, this includes moving the data into a sub "data" element in the JSON and adding meta data for pagination. The response helpers replicate this so the following two responses would result in the same response!

```php 
return MyApiResource::collection($items);

return ok(MyApiResource::collection($items));
```

Hopefully you'll also find some use in this and be able to make your controller responses more expressive and easier to create and maintain! Check them out at [github.com/mikebarlow/laravel-response-helpers/](https://github.com/mikebarlow/laravel-response-helpers/)

