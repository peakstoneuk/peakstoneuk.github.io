---
layout: post
title:  "Using Timestamps with the DateTime class and timezones"
date:   2017-01-25 22:00:00 +0000
---

Welcome to 2017! This post may seem obvious to most but it's something that caught me out when recently dealing the DateTime class and DateTimeZone class.

When dealing with timezones in an application it's usually wise to store the date / timestamp converted into the UTC timezone. From here you can then transform it to whatever timezone a user needs to see when displaying on the screen. This is especially handy when dealing with multiple users in multiple timezones, you can simply retrieve the date from the database and you know it's in UTC timezone, you can then transform it into what you need. Whereas if you store it in the timezone of the user that entered the date, you are opening yourself to a massive world of pain with having to track a timezone with each date stored so you are able to correctly convert to and from the needed timezones.

Recently I've been workng on my open source calendar / event package [MyCal](http://github.com/mikebarlow/mycal) and in doing so I had a part of code where I had an instance of the DateTime class with an American timezone which you would setup like so

	$DateTime = new \DateTime(
		'2017-01-25 21:50:00',
		new \DateTimeZone(
			'American/New_York'
		)
	);
	
Once I had this, I was wanting to obtain the timestamp for this time to do some comparisons and this is where I was stumped at why it was failing. After some debugging and "echoing" out of dates I had something like this

	$DateTime = new \DateTime(
		'2017-01-25 21:00:00',
		new \DateTimeZone(
			'American/New_York'
		)
	);
	
	echo $DateTime->format('Y-m-d H:i'); 
	// '2017-01-25 21:00'
	
	echo date('Y-m-d H:i', $DateTime->getTimestamp()); 
	// '2017-01-26 02:00' 
	
*"Whaaaaaaa? how is the timestamp for the given date a good few hours out."* Was my first response. It's only when you take a step back, think about what's going on and realise that you are requesting the Unix Timestamp of the date that you notice that it's simply auto converted the timestamp back into UTC before returning it.

Once you beging to think about it, it makes perfect sense given it's a Unix Timestamp but at the time when I was in the "moment" it really threw me off as I was expecting the result from `$DateTime->format()` and `date()` to match.

The bonus of this, means it does make working with timezones in an application so much easier as when you are accepting dates from a registered user (one that has a timezone associated with them), you can quite easily get the UTC timestamp from their input ready to save in your data store with some code similar to this brief example.

	// ... sanitize $_POST['date_time'] before setting
	$selectedDate = $_POST['date_time']; 
	
	// And assuming all users settings have been retrieved and stored to $userSettings object
	
	$EventDate = new \DateTime(
		$selectedDate,
		new \DateTimeZone($userSettings->timezone)
	);
	
	$Statement = $PDO->prepare("INSERT INTO event(event_date) VALUES(:event_date)");
	$Statement->execute(['event_date' => $EventDate->getTimestamp()]);

Obviously that's a rough example but hopefully it conveys the idea and hopefully this post prevents someone else making the stupid mistake that I made!
	
	
	
	