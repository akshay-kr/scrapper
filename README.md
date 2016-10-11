**Scrapper**
===================
----------


Description
-------------

Scrapper is a node.js script which is designed  following the problem statement of **"Rentomojo Node.js Assignment"** described below hosted by **"Rentomojo"**. Scrapper efficiently fetches all hyperlinks in a website.

> **Problem Statement**

>Scrap popular blogging website https://medium.com  and find all possible hyperlinks present within  https://medium.com  website and generate a CSV output.
>You need to,

> - use Node.js for scripting.
> - throttle the requests made to medium.com at max 5 requests at a time.
> - use asynchronous nature of javascript as much as possible.
> - Using Git with proper commit and readme file is a plus.
> - Share two versions of the assignment - One using async library and the other without.
> 
> PS: 
> Don’t spam medium.com servers with too many requests, their server might ban your ip.

Table of contents
-------------
1. Dependencies
2. Setup


###Dependencies

1. Nodejs

##Setup

1. Install nodejs 
	* For mac and windows download the installer from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
	* For Linux run this command in terminal 
		
	        sudo apt-get install nodejs

2.  Clone the repository.
3. Move inside the project root path i.e, **"scrapper/"**.
4.  Run this command in terminal 

	    npm install 

	This will install all the **node** dependencies for the project.
5. Inside project root path edit the file **config.json** as
	

        {
    	"baseUrl":<target website address>, 
    	"domainName": <target website domain name>,
    	"csvFilePath":<path of csv file>
    	}

	Default to get started:
	
	    {
		"baseUrl": "https://medium.com",
		"domainName": "medium.com",
		"csvFilePath": "links.csv"
		}
6. Start the script. Inside project root path **"scrapper/"** run these commands in terminal,

	For script designed with async run,
	

	    node withAsync.js

	For script designed without async run,
	

	    node withoutAsync.js
7. In order to stop the script press **Enter** key while the script is running. The script will write the fetched urls in csv file and then exit.
		
