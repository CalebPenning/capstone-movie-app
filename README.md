## Cinema Circle: 
### A movie-based social media site
---

#### The Problem: 
- There are a lot of movies and shows to watch out there. It can be hard to keep track. And in an age where hanging out with your friends to go to the cinema is not always an option, it can be quite lonely to find time to watch what you'd like. It would be nice if you could share your movie experiences with friends, in a 'feed' format that you could check in your downtime.
---
#### The Solution:
- Enter Cinema Circle. Built on top of the OMDB API, this end-to-end web application will allow users to look up information about movies and tv shows, write short-form reviews (comparable to an extended tweet) for titles they've seen, and follow their friends to see what they've been up to, silver screen-wise.
---

#### Use Cases:

1. Find Movie Information:
    - Actor: casual user
> Basic Flow:
- A casual user (may or may not have an account) wants to get info on a movie a friend mentioned to them.
- They hop on the homepage of our site, and use the search function to look up all or some of a movie's title
- The site returns a list of relevant matches, each a card with short descriptors, and with a link to a details page
- After the user clicks the link, they are brought to the details page for that title and has access to all kinds of info, i.e. critic scores sorted by source site, user reviews sorted by date, actors, writers, etc

2. Signing Up:
    - Actor: casual user
> Basic Flow:
- A new/new-ish user hits our homepage and decides they want to be able to use the app's full functionality. Our global navbar has options for non logged in users to either login, sign up, or return to the homepage.
- A user wanting to sign up clicks the corresponding link and is brought to a form.
- Our user fills out this information, and if valid, is successfully entered into the database as a new user, and is automatically logged in.
- From here, they are redirected to a home page with a welcome message, a search bar to explore the site, and a user-based global nav.


3. Review A Movie:
    - Actor: regular user
> Basic Flow:
- A logged in user is either ranting or raving about a new film, and MUST express their feelings to their friends.
- Our user, familiar with our application, navigates to this media's detail page.
- On the details page for this media, they can click a link to open a review form, which will have a field for a rating (number 1 - 10), and a field for a review body. 
- On submit, if valid, the review is posted on the movie details page, with their review appearing at the top of the reviews (since it is the most recent)
- Reviews will also have a tab on the user's profile, accessible from the navbar

4. View A User's Profile and Reviews:
    - Actor: regular user
> Basic Flow:
- A logged in user looks up the details page for a movie they are interested in, or already like.
- They start scrolling user reviews, and decide they like a post by a user.
- The post has a link to the user's profile, which our user clicks.
- On the user's page, our visiting user can view information about the other user, such as their profile information, reviews they've left, and users they are following

5. Following Users:
    - Actor: serious user
> Basic Flow:
- A logged in user finds themselves on a User's page, described in Case 4.
- On the User page that our User is visiting, there's a button to "follow" a user.
- If the user clicks, that user will now be following the user they are visiting, and the button will change theme and text to reflect that.
- While logged in, a user's home page will be a feed that will show all posts from the users they follow, sorted by most recently posted. 


#### The Stack:
- As mentioned before, this will be an end-to-end web application.
- The Backend of the app will use the following:
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
- The main users I anticipate using this app are casual to serious moviegoers and tv viewers. Obviously, that's quite a large group. Realistically, it would probably be more related to people who are willing to give another social app a try, so I anticipate people of all kinds, likely under 50 years of age. 

#### End Goal:
The idea presented in the above solution is pretty simple:
- Connect users by interest in movies
- Allow people to discover new media from their friends
- Keep people engaged by encouraging SHORTER posts about movies, as to not make it a chore. 
- Provide a base level reference resource i.e. make movie/tv data available in general, not just reviews for movie/tv shows.