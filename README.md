# DC Universe Unlimited List Maker  

The goal of this application is to be able to easily share, import, and export lists from DC Universe Unlimited.

## Planned features / Where they are implemented

### Front-End (src / Front-End)

- [] Importing a list
- [] Exporting a list
- [] Pushing a new list to DC Universe Unlimited
- [] Updating an old list to DC Universe Unlimited
- [] Login functionality
- [] Comic browser ( ideally easily filterable )

### Back-End (src / Back-End)

- [] Get all / update DB script that can be ran nightly 
- [] Necessary API calls for front end to work (likely move API to separate project and import as library)
- [] Estimating what the user meant if the imported file is just text, i.e. Batman #50 could return a bunch of different issues

## Why do I need to login / do you save my password

You need to login if you want to be able to get access to your lists, or push your created lists to DC Universe Unlimited, there isn't any way around that. Saying that though, this application does not store your login information, here is the planned process for logging in.


1. you submit the credentials
2. the application logs in using the same request that happens when you login to DC Universe Unlimited, and the password is then forgotten
3. Assuming success, the request returns a token, and this token is saved for your session, locally on your browser, and the token is sent to the backend to do work

note that this is cleared upon refreshing the site/leaving so you will have to login again

