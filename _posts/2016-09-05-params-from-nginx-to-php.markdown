---
layout: post
title:  "Passing custom parameters from Nginx to PHP"
date:   2016-09-05 13:45:00 +0000
---

So nearly 1 year after I put this site back online I'm finally writing a new post. Yeah I kinda suck at keeping a personal site up to date. Even worse when I told myself to stick it on Github and use Jekyll, "Stick on there and into GIT, I said. It'll be easier and I'll be more likely to update it I said". Well I was wrong!

That aside, I AM going to try and make a better effort now, recently I've been making little notes and saving little snippets of code and stuff I've been working on that I thought was cool, especially if it was something that I'd only just learnt myself.

As part of my job at Aiir, over the coming months we're looking at improving our frontend server and code architecture to make sure we're making the most out of Amazons AWS and hopefully make it all more responsive when dealing with high traffic.

One of things we're looking at doing is changing around the layout of our actual codebase and this lead to looking into our nginx configurations and whether it was possible to pass parameters to the PHP. This was essentially to save our PHP having to process the domain name and attempting to work out which site the code is having to load.

In looking at this I found out that doing something like this was possible:

	server {
		server_name: example.com
		root: /var/www/
		index index.php
		
		location ~ \.php$ {
			fastcgi_param  SITE_ID 123;
			# rest of nginx config
		}
	}
	
Previously I thought you could only set reserved params there, I was totally unaware that you can actually set custom data there and have it pass through to PHP.
	
We have to create a server block for each client anyway and doing this allows us to pass in the site id within our system, we can then in the PHP access the variable from within `$_SERVER`.

	echo $_SERVER['SITE_ID']; // 123
	
This saves alot of processing and database calls especially with a high traffic site as it means we instantly have the site id without having to process the domain name!

I'm possibily late to the game with this information and everyone in the world probably already knows this, but better late than never!