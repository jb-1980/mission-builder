Mission Builder
===================

## About
I built mission builder as a method to quickly create content 
pages to import into our school's LMS. It features the ability
to import a mission from Khan Academy, add and rearrange
skills, and then create an zip file with the files necessary
to build the course in our LMS. It also has the option to
import all the assignments from a Khan Academy course you have
created in your Khan Academy coach account.

If you are interested in extending this for personal use, you will probably want to change the files in `server/mission` to produce the output that will work with your system.

## Usage
The repository was bootstrapped with create-react-app. So after cloning from Github, you can get it running with `yarn install` and then `yarn start`.

```
> git clone git@github.com:jb-1980/mission-builder.git
```

Then you will have to update the contents of `.env.dist` and rename to `.env` to have the correct environment variables
before running the app. After setting up `.env`, you can start your app.
```
> cd mission-builder
mission-builder> yarn install && yarn start
```

Change the files in `server/mission` to create an output that works for you. Once you are ready to build your app, you can do it with `yarn build`.
