## Cinema: 
### A movie-based social media site
---

#### The Problem: 
- There are a lot of movies and shows to watch out there. It can be hard to keep track. And in an age where hanging out with your friends to go to the cinema is not always an option, it can be quite lonely to find time to watch what you'd like. It would be nice if you could share your movie experiences with friends, in a 'feed' format that you could check in your downtime.
---
#### The Solution:
- Enter Cinema. Built on top of the OMDB API, this end-to-end web application will allow users to look up information about movies and tv shows, write short-form reviews (comparable to an extended tweet) for titles they've seen, and follow their friends to see what they've been up to, silver screen-wise.
---

##### Getting started: 
- download the code
- npm install
- run tests with 'jest'
- With psql installed run "createdb cinema"
- run db-schema, then db-seed.sql
- node/nodemon server.js
- By default runs on port 3001, can be configured to any port.

###### Routes:
- POST => /auth/register 
> Used to sign up new users. A valid body is a JSON object consisting like this:
> {username: "username", password: "password", firstName: "first", lastName: "last", email: "email@mail.com", bio: "hello world"}
> if successful, returns a 201 status code, as well as a JWT.

- POST => /auth/login
> Used to sign in returning users. A valid body looks like this:
> {username: "username", password: "password"}
> If successful, returns a valid token.

- GET => /movies/search
> Used to search for movies and other media. 
> Takes a query param 's', which is the search term. 
> Returns the first page of results. param 'page' can be passed in to get to other pages of results, defaults to 1.

- GET => /movies/:id
> Given a valid IMDB ID, return all information about a piece of media.

- GET => /movies/:id/reviews
> Given a valid IMDB ID, return all reviews that user's have posted for it.

- GET => /reviews/:id
> Given a valid id, return a single review. This route is not called by the client app directly at all, and is used mainly for debugging. It is called however, by the api on patch and delete. 

- POST => /reviews/
> Create a new review. JSON body should look like:
> { movieID: "someimdbid", userID: currentUserID, rating: some num 1-10, title: "title", body: "body"}
> If valid, returns a 201 status code, and a "created" object with the review contents.

- PATCH/DELETE => /reviews/:id
> On delete, if id is valid, review with that id will be deleted from database.
> On patch, users can update rating, title, and body, assuming the new data passed in is still considered valid.

GET => /users/:id
> Retrieves a single user object, given a valid id. If not valid, returns a 404 status code.

GET => /users/:id/reviews
> Retrieves all reviews by a single user. If there are no reviews by the user that corresponds to the route :id, an empty array is returned.

GET => /users/:id/following
> Retrieves a list of all users the corresponding user is following. If there aren't any, return an empty array.

POST => /users/:id/following
> Given a JSON body with the format { userToFollowID: 10 }, follow a user.
> if either the path :id is not valid, the id is the same as the body id, or the user already follows a user with the id passed, it will error out.
> If successful, you just followed a new user! Try the get method below to see your new followed users posts!

DELETE => /users/:id/following
> Given a JSON body with {userToUnfollowID}, unfollows the corresponding user. If the follow isn't found, errors. 

GET => /users/:id/following/posts
> Get an array of posts from users you follow, sorted by how recently they are posted (newest at the top)
> If no users are followed, returns an empty array

GET => /users/:id/followers
> Get an array of users that follow the corresponding user. If none, returns an empty array.

GET => /users/:id/likes
> Returns all posts that a user has liked, sorted by most recent date. If empty, returns an empty array

POST => /users/:id/likes
> Given a valid review ID, add that post to the user's likes.

DELETE => /users/:id/likes
> Given a valid review ID, remove that post from the users likes.

#### Use Cases:
| Use Case:                 | Signing Up                                                                                                                                                                  | Logging In                                                                                                                                                                                                                                                 | Searching For Data                                                                                                                                                                                                                                    | Leaving A Review                                                                                                                                                                                                                               | Following A User                                                                                                                                                                                                                                                                                                                                                               |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Actor:                    | New User                                                                                                                                                                    | Returning User                                                                                                                                                                                                                                             | Any Site Visitor                                                                                                                                                                                                                                      | Registered user                                                                                                                                                                                                                                | Registered user                                                                                                                                                                                                                                                                                                                                                                |
| Steps (action, response): | 1. User goes to home endpoint on our app. 1a. Server sends them our app, which lands on the homepage.                                                                       | 1. Registered, non-logged in user goes to the home endpoint. 1a. They are served the anonymous homepage.                                                                                                                                                   | 1. User goes to home endpoint. 1a. They are served the user or anonymous homepage. Both homepages have a search component.                                                                                                                            | 1. User goes to home endpoint while logged in. 1a. They are served the homepage.                                                                                                                                                               | 1. Logged in user is on an item's detail page reading a review. They click on the username of the user who posted it. 1a. A user details component is rendered.                                                                                                                                                                                                                |
|                           | 2. User clicks on "sign up" link in the navbar. 2a. User is brought to a form where they can enter information to sign up.                                                  | 2. User clicks "login" link on navbar. 2a. They are brought to a form where they can input their username and password.                                                                                                                                    | 2. User types in some term and submits. 2a. A request is sent to our API, which will return some response.                                                                                                                                            | 2. User searches for some data with a valid search term 2a. A list of matching data is rendered                                                                                                                                                | 2. On this page, a user can see all of the public details about another user. There is also an option to follow a user.                                                                                                                                                                                                                                                        |
|                           | 3. User fills out the form and submits. 3a. If valid, the user is registered as a new account in our database,  is logged in automatically, and redirected to the homepage. | 3. User fills out forms with their information, and submits. 3a. API will verify that the password matches the input username, and if so, user is logged in and redirected to the homepage. Homepage content and nav changes to reflect the user instance. | 3. If the response has Data, a list component is rendered, populated by cards with the data's details. A user clicks on one of these cards. 3a. The user is brought to a details page for this item, where all details about the item are listed out. | 3. User clicks on the card for an item they'd like to review. 3a. The details component for that item is rendered.                                                                                                                             | 3. The user clicks the follow button 3a. A request is sent to our api that makes sure that everything looks in  order, i.e. our users are both real, the one making the request is the user to follow this other user, etc. If so, the api will update the database to reflect that. The user will get some visual notifier to let them know they are now following this user. |
|                           |                                                                                                                                                                             |                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                       | 4. User clicks "leave a review" button on page 4a. A form component is rendered for the user to fill out.                                                                                                                                      | 4. Once our user gets the notifier, they go back to the home endpoint. 4a. An updated home screen adds posts from the new user they're following to their homepage.                                                                                                                                                                                                            |
|                           |                                                                                                                                                                             |                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                       | 5. The user submits a valid review via the form. 5a. Our app sends a Post request to an endpoint on our API that handles reviews. If valid, it commits it to the database, and sends back some response, that confirms the review was created. |                                                                                                                                                                                                                                                                                                                                                                                |
|                           |                                                                                                                                                                             |                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                       | 6. If successful, our user is redirected to the former details page. Their review, assuming no other reviews were submitted in this time period,  will be displayed at the top of the reviews section on the page.                             |                                                                                                                                                                                                                                                                                                                                                                                |

#### Database Models And Relationships:
![A crow's foot style diagram showing the relationships within our SQL database. It includes users, follows, likes, reviews, and movies](https://i.imgur.com/YElOJIO.png)

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
