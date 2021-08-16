## Cinema Circle: 
### A movie-based social media site
---

#### The Problem: 
There are a lot of movies and shows to watch out there. It can be hard to keep track. And in an age where hanging out with your friends to go to the cinema is not always an option, it can be quite lonely to find time to watch what you'd like. It would be nice if you could share your movie experiences with friends, in a 'feed' format that you could check in your downtime.
---
#### The Solution:
Enter Cinema Circle. Built on top of the OMDB API, this end-to-end web application will allow users to look up information about movies and tv shows, write short-form reviews (comparable to an extended tweet) for titles they've seen, and follow their friends to see what they've been up to, silver screen-wise.
---
#### The Stack:
As mentioned before, this will be an end-to-end web application.
The Backend of the app will use the following:
- Node.js & Express.js to build our site's API.
> I anticipate most of the requests to the OMDB API will be done on the backend as well. I plan on using axios for this.
- Use of bcrypt and JWTs for server-side authentication. 
- A PostgreSQL database, and the node 'pg' package as a SQL driver.
> Our endpoints should be serving information given to us by the OMDB API, but also should be querying our database, and giving back information from the API. The response our frontend gets on an endpoint like 'movies/:someId' might look like this:
```
{
    "query": {
        "reviews": {
            'someUserId': 'reviewBody',
            'etc': 'etc'
        },
        "ratings": {
            'someUserId': 10,
            'otherUserId': 4.5
        }
    },
    "data": {
        "title": "movie1",
        "genre": "movie",
        "etc, etc"
    }
}
```

- The Frontend of the app will be built with React.js, axios, react-router, and possibly Bootstrap.

- The focus of this project will be fullstack functionality.

#### Target Users:
The main users I anticipate using this app are casual to serious moviegoers and tv viewers. Obviously, that's quite a large group. Realistically, it would probably be more related to people who are willing to give another social app a try, so I anticipate people of all kinds, likely under 50 years of age. 

#### End Goal:
The idea presented in the above solution is pretty simple:
- Connect users by interest in movies
- Allow people to discover new media from their friends
- Keep people engaged by encouraging SHORTER posts about movies, as to not make it a chore. 
- Provide a base level reference resource i.e. make movie/tv data available in general, not just reviews for movie/tv shows.