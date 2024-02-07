1.Projects Page and Pagination:
The Projects page showcases the user's projects with a pagination system, displaying 2 records per page.

2. Sorting Functionality:
The records on the Projects page can be sorted based on recentness, username, category, and project title.

3. 404 Handling:
The application incorporates a GET method to handle 404 errors gracefully.

4. No Project Page:
When there are no projects to display, a dedicated "No Project" page is presented to the user.

5. Pagination with jQuery DataTable:
jQuery DataTable is employed for efficient pagination.
Sorting functionality is enhanced by utilizing values from the "Sort By" dropdown button. An onchange event triggers sorting when the dropdown value changes.

6. Login Page and Password Hashing:
The login functionality is implemented in index.html.
Due to password hashing, direct login with an existing user was not possible. As a workaround, I changed the password for an existing user (admin).

7. Request Handling with login.js:
The login.js file manages both GET and POST requests, handling user authentication.

8. Session Management:
Usernames are stored in the session using the express-session object, secured with a secret key.

9. Dependencies in Package.json:
The project dependencies are listed in package.json, including:
Body-parser for handling requests with query parameters.
EJS for rendering HTML templates.
Express for building the web application.
Express-session for managing user sessions.
MySQL for interfacing with the database.

10. Download and unzip the Auction Software folder. Run the command node login to run the server. Change the db connection credentials as per your dbms.