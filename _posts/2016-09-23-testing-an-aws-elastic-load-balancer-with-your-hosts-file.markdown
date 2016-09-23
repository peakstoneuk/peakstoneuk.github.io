---
layout: post
title:  "Testing an AWS Elastic Load Balancer"
date:   2016-09-23 21:00:00 +0000
---
So recently I was faced with a problem with needing to test an AWS Elastic Load Balancer (ELB) that was serving multiple domains and I needed to test this before the domains was transfered over. This is normally ok as you can simply edit your hosts file and add something similar to

	# IP DOMAIN
	127.0.0.1 example.com


However in the case of Amazons ELB, it gives you an A record to point your domain to, which when it comes to testing can be a pain as the A record will look something like `my-elb-label-1234567890.us-east-1.elb.amazonaws.com`. 
	
This however does not work with the simple hosts file edit above (unless I've missed a trick, in which case the rest of this post is useless!). I found a way round this however by "pinging" the ELB url and getting its physical IP address! You can run a ping command similar to this

	ping my-elb-label-1234567890.us-east-1.elb.amazonaws.com
	
You should get an output similar to this:

	PING my-elb-label-1234567890.us-east-1.elb.amazonaws.com (12.123.12.123): 56 data bytes
	64 bytes from 12.123.12.123: icmp_seq=0 ttl=232 time=103.764 ms
	64 bytes from 12.123.12.123: icmp_seq=1 ttl=232 time=104.238 ms
	
This essentially sends a message to the given address and records the time taken for the response and it also returns the IP address of the response which in this case is the ELB! So in the example above `12.123.12.123` is the IP address of our ELB, and this means we can fire up our hosts file and add it so we are now able to test using our domains with our hosts file like so.

	12.123.12.123 example1.com
	12.123.12.123 example2.com
	12.123.12.123 example3.com
	
We are then able to not only test our load balancer but then also test any apache vhosts / nginx server blocks (or any other vhost type setups). Once testing is complete, simply remove the lines from your hosts file and it will fall back to the default settings for your domain!

One note however, I did find that when I set it up again the following day, the IP address for my ELB had changed, whether this happens all the time or whether it was something internal and Amazon had to change some servers around I don't know but it's something to bear in mind!

Hope thats of use to some people, certainly made my life easier and was definitely a lot simpler then some of the other suggestions around!
