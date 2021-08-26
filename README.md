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
| Use Case:                 | Signing Up                                                                                                                                                                  | Logging In                                                                                                                                                                                                                                         | Searching For Data                                                                                                                                                                                                                                    | Leaving A Review                                                                                                                                                                                                                               |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Actor:                    | New User                                                                                                                                                                    | Returning User                                                                                                                                                                                                                                     | Any Site Visitor                                                                                                                                                                                                                                      | Registered user                                                                                                                                                                                                                                |
| Steps (action, response): | 1. User goes to home endpoint on our app. 1a. Server sends them our app, which lands on the homepage.                                                                       | 1. Registered, non-logged in user goes to the home endpoint. 1a. They are served the anonymous homepage.                                                                                                                                           | 1. User goes to home endpoint. 1a. They are served the user or anonymous homepage. Both homepages have a search component.                                                                                                                            | 1. User goes to home endpoint while logged in. 1a. They are served the homepage.                                                                                                                                                               |
|                           | 2. User clicks on "sign up" link in the navbar. 2a. User is brought to a form where they can enter information to sign up.                                                  | 2. User clicks "login" link on navbar. 2a. They are brought to a form where they can input their username and password.                                                                                                                            | 2. User types in some term and submits. 2a. A request is sent to our API, which will return some response.                                                                                                                                            | 2. User searches for some data with a valid search term 2a. A list of matching data is rendered                                                                                                                                                |
|                           | 3. User fills out the form and submits. 3a. If valid, the user is registered as a new account in our database,  is logged in automatically, and redirected to the homepage. | 3. User fills out forms with their information, and submits. 3a. API will verify that the password matches the input username, and if so, user is logged in and redirected to the homepage. Homepage and nav changes to reflect the user instance. | 3. If the response has Data, a list component is rendered, populated by cards with the data's details. A user clicks on one of these cards. 3a. The user is brought to a details page for this item, where all details about the item are listed out. | 3. User clicks on the card for an item they'd like to review. 3a. The details component for that item is rendered.                                                                                                                             |
|                           |                                                                                                                                                                             |                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                       | 4. User clicks "leave a review" button on page 4a. A form component is rendered for the user to fill out.                                                                                                                                      |
|                           |                                                                                                                                                                             |                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                       | 5. The user submits a valid review via the form. 5a. Our app sends a Post request to an endpoint on our API that handles reviews. If valid, it commits it to the database, and sends back some response, that confirms the review was created. |
|                           |                                                                                                                                                                             |                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                       | 6. If successful, our user is redirected to the former details page. Their review, assuming no other reviews were submitted in this time period,  will be displayed at the top of the reviews section on the page.                             |

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