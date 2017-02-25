---
layout: post
title:  "Quickstart with Laravel Passport"
date:   2017-02-25 22:00:00 +0000
---

So for this post I wanted to show / point people in the right direction for setting up Laravel & Passport for use on a site where you are simply using it to authenticate users and authenticate them with the sites API so you can have a fancy JS frontend to give a nicer user experience.

For the purposes of learning Laravel I built myself a budget tracking web application just so I can track my money each month, see what I'm spending the most on and how much I've got set aside for a rainy day. However I quickly became stuck when I got to the documentation for Passport and was immediately confused as to what exactly I needed to set up and what I didn't. If you don't plan on having a 3rd party app that needs to authenticate users or anything fancy, then after looking at the docs you maybe surprised at how little you need to do.

Start to run through the documentation [here](https://laravel.com/docs/5.4/passport) until you reach the Frontend Quickstart section. Once completed, you are pretty much ready to go, yep that really is almost it! Next scroll down to the "[Consuming Your API With Javascript](https://laravel.com/docs/5.4/passport#consuming-your-api-with-javascript)" section and complete it. To complete, all you _should_ have to do is make sure the `CreateFreshApiToken` middleware is added to the `web` group within `app/Http/Kernal.php`.

	'web' => [
	    // Other middleware...
	    \Laravel\Passport\Http\Middleware\CreateFreshApiToken::class,
	],


That. Is. It. This is why people love and use Laravel. Your API should now be ready to go when people login to the site (assuming your frontend is done!)

As default, Laravel ships with some Javascript in place which deals with the API tokens assuming you are using the brilliant [VueJS](http://vuejs.org) framework. If you have already been playing with templates and javascript you will need to make sure the following code is present.

Within the head tags of your layout

    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>
    
Within `resources/assets/js/bootstrap.js` make sure the following is in place:

	window.axios = require('axios');
	
	window.axios.defaults.headers.common = {
	    'X-CSRF-TOKEN': window.Laravel.csrfToken,
	    'X-Requested-With': 'XMLHttpRequest'
	};
	
If it wasn't within that file then make sure you recompile frontend assests once saved.

With those checks done, you should be all set to start building your API and having your users consume the API automatically. During development however this may be difficult if you don't yet have a frontend. Follow the next section to see how to setup an access token to allow a REST client access.

## API Development

When developing an API, even to be just consumed by the site itself, I prefer to write the API and use a REST client such as Postman during development. This can obviously cause problems as the API key is refreshed regularly and tied to the account. Passport can help solve this.

In the middle section of the docs that we skipped is the "Personal Access Tokens" section. This allows you to setup long-lived tokens that you can use to authenticate your REST client with your API.

A prerequisite before proceeding, is to make sure the authentication is all setup as you will need to have a user account and be logged in before carrying on.

Next, simply set up a simple "token" route that will return a token for you (don't forget to delete or deny access to this route once you're done!). Create the following route within `routes/web.php`

	Route::get('/gen-token', function () {
	    $user = Auth::user();
	
	    return $user->createToken('restClient')->accessToken;
	});
	
Once created, login to your app and visit `http://your-app.com/gen-token`. This should display a long string on the page similar to

	eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU1MWRiNGI5YjRkYzMwMjZjODc2NDIyMjAyMGEzYjVhYjg2ODk1MmMxMDVlMzU1NjI2YjAzNjM3ZTBlOWMxZWM1MjdkNDliODhmYThmOTUwIn0.eyJhdWQiOiIxIiwianRpIjoiNTUxZGI0YjliNGRjMzAyNmM4NzY0MjIyMDIwYTNiNWFiODY4OTUyYzEwNWUzNTU2MjZiMDM2MzdlMGU5YzFlYzUyN2Q0OWI4OGZhOGY5NTAiLCJpYXQiOjE0ODgwNTg5ODQsIm5iZiI6MTQ4ODA1ODk4NCwiZXhwIjoxNTE5NTk0OTg0LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.Lyss1rMnH1cLf48S-uBb4Az2wNM0cWmfc2wIsBqxNptUCUxCDsBnsqAqXnjrNgPqcL5dmCUdSHsFuV0JErN2DXeoeN0EVfKRCnPbfsQMr8ECpWDJ_c3GMQjieOsZz4Nd-HwWKW1JWKC5PpmLJa0MAWXIHwKX7ZYEH0PizJeDl1uf-eGuezvc83TP-3TIVLMI4xmHICOrI-kWmo76sbE-yWLOp8n7fV34-p_ZCZti8JRmth-b_AWHf7U4xfhReH787GtgBbkKT7V4PjQq-NVh08Fsd15h07RzhrbL4SM_WGuujxPpWpWhX0gC35c2-crumoapKDD1HTMQxnPJERtjHAj5_w7sGCRHbFT_QMNV86AWN0lqPALlHkhWRZE7eZMHpoIcXO-NOXMzLkGGE1lweYQwAhkTRChD6qsnhdHpEXFmMvSrww_RcohGMdHmUquguyXFR83lAwIjJfkjLZrNktAgbFke1oPNUMM2R6lgC20iVpb-Jh9E3XvCc90RodTnUAOgVidx_1WF_EEwShGs0b0lnPIiFN-mc419EkQheLXp7_jBiaD4dNs2GxCPDAaKLvqIydVXrZbfat5FQ5B4CpB4bKldk36gkjEJEuO5fIG8P0pC_TbIvLbAi6hwOZ5Jg61v99urZsp584gzUY7YNtincrMaMzSxoy7gCkgSV6A	
	
That token can now be used within a REST client to develop the rest of your API. When testing an endpoint simply add an `authorization` header in the following format:

	Authorization: Bearer YOUR-KEY-HERE
	
This should allow your REST client access to your API allowing you to test and build the API without having to worry just yet about the frontend side of the development.

I hope this post was useful in pointing some people in the right direction, when learning myself I found myself bogged down in attempting to set up tokens I didn't even need!
