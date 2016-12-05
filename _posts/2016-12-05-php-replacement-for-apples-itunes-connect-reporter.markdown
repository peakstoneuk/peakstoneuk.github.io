---
layout: post
title:  "PHP replacement for Apples iTunes Connect Reporter"
date:   2016-12-05 22:00:00 +0000
---
So as of tomorrow (6th December 2016) Apple will be turning off its AutoIngestion Tool which is used by loads of people to get the stats for the apps in the App Store. To their credit they have given plenty of warning and made sure there was a replacement tool. The only downside is the replacement tool (Reporter) is a java based script that returns data to you either as text or xml and simply downloads any CSV files to the same working directory as the script!

This setup was impractical for us at Aiir, we have our stats loading in via a PHP script which processes the days and the accounts we need to download. This would then mean passing this through to a system / exec method to call a Java app to then capture any XML output or open up a CSV file which would be saved into the working directory seemed an absolute nightmare!

After a search around it became apparent that there was no PHP port of this Reporter tool, only a Python one. After inspecting the Python script and decompiling the official Java app it became clear that it would be fairly easy to create a PHP port which would be easy to work with to get the data needed and also easy to then process the results. Obviously we wanted this package to be composer based but we also wanted to make sure it was easy to use and had proper unit tests!

Thus, [this package](http://github.com/mikebarlow/itc-reporter) was born. The read me should cover all uses of it but below is a simply getting started guide for it. First make sure you bring the package in via composer with `composer require snscripts/itc-reporter`. Then instantiate the object with the Guzzle Client as a dependency:

    $Reporter = new \Snscripts\ITCReporter\Reporter(
        new \GuzzleHttp\Client
    );

Once you have the object you can set your Apple ID and password like so:

    $Reporter->setUserId('me@example.com')
        ->setPassword('MyAppleIDP4ssword!');

Before any reports can be retrieved you will need account numbers and vendor numbers. To set an account number (you will have to store this manually in your database), you can use the following method:

    $Reporter->setAccountNum('1234567');

An array of vendors available to that account number can be retrieved with the simple call to:

    $Reporter->getSalesVendors()

This returns an array of VendorIds that be used to get sales reports for, these sales reports include the downloads / updates for all your apps. To get the report you will need to specify a range of data, the example below is to get the sales data for one day, this will include info on the App and the category it belongs to as well as the customers Currency code and country code and finally the download / update information. To get this data use the following method:

    $Reporter->getSalesReport(
        1234567, // VendorId
        'Sales', // type
        'Summary', // sub-type
        'Daily', // frequency
        '20161205' // date
    );

This will return the CSV report as an easy to use PHP array making your life (hopefully) 100x easier! The only thing you will then need to do is process the "Product Type Identifier" column to work out whether the current row is an install or an update, and then finally add the quantity found within the "Units" column to the correct variable in your script. For information on the different identifiers and what the codes mean see this [link](http://help.apple.com/itc/appssalesandtrends/#/itc2c006e6ff).

While the tests aren't fully comprehensive the package does come with Unit Tests that provide 100% code coverage and hopefully the read me describes in better detail all the steps necessary and the functionality available. If you are using it and spot anything then please do create an Issue or a Pull-Request and I shall fix or merge in as needed!
