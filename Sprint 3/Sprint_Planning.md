# Sprint Planning Meeting 
The required contents of this file are described in the *Sprint Planning* section of the Project Manual. In case of a discrepancy between this file and the manual, the requirements in the manual take priority.

## List of Meeting Participants
1. Nicholas Schumacher (Present)
2. Chetan Bagri (Present)
3. Anika Patel (Present)
4. Jainee Shah (Present)
5. Mahum Syed (Present)

## List of Items on Product Backlog
1.  Search for a park to visit based on various attributes

    1.  Should access real park info.

    2.  On search, results are arranged vertically underneath the search box (should be 10 results displayed).

    3.  Have a button at the bottom that loads more results (displays 10 more), and repeat that as many times as we wish. Should be on the same page and if I display more results, those results should be appended to the end of the results list.

    4.  Should at least display park names after search query (no other requirements for initial search query display).

    5.  If the user clicks the park name, should show certain things through an inline display window that pops up (ask in RE for what details to show, don't redirect to another page).

    6.  Search should be customizable with radio buttons for specific search terms (park names, amenities like camping/cookout, state like California, activities like canoeing/hiking).

    7.  When loading up the search page, should initially display the search bar and options. Default option should be the park name.

2.  Obtain details about the various parks
    - What specific details about each park should be provided to the user?
    - Name of the park
    - Location - city or county
    - Clickable park url
    - Entrance fee for park
    - A representative picture of the park
    - Short description of the park
    - Amenities provided by the park
    - Activities provided at the park
    - Whether or not the park is already on the user’s park favorite list
    - Are there any requirements for how we should display them? Like a format?
    No; as long as all are contained within the park details window
    - Should there be a popup box or should the details be appended to the screen? Or should we redirect to a separate page?
    - Should cause an inline window to appear that will contain all the information
    - Should the details show up on search or should they only show up when you click it for more details?
    - Only show up when they click on the park
    - When the user hovers on the detail box, should anything happen?
    - Hover across entirely of park detail window is the same as the hover for each individual result on the search
    - I.e. when hovering, a plus sign will appear, and when you click it, favorite…
    - When the user clicks on the detail box, should anything happen?
    - Clicking on amenities/activity/location - trigger new park search with clicked on info serving as search term
    - Ex clicking on location -> new search with that state as the search term -> should replace the current search term and should be set to the correct type of search
    - Are there any interactive elements, such as photo galleries or maps, that should be included on the page?
    - Only interactive part is if i click on the name of the park, in the list, that will minimize the park detail window to the prior parent’s and allow user to resume interacting with search page


4.  Update and review a favorite park list

5.  Compare favorite park list with friends

6.  Suggest a park to visit among a group of friends

7.  Accessible for people with disabilities

8.  Works on Chrome browser and mobile devices

    1.  Show that all functionality on all pages can gracefully resize.

        1.  Check around 600x400, 640x360.

        2.  Can manually demonstrate stuff like this (no tests needed).

9.  Is secure and protects users' data.

    1.  Give an Account Blocked message if the user does 3 incorrect logins within 1 minute.

    2.  After the account is blocked, do not allow login attempts for 30 seconds.

    3.  After the account is blocked, do not allow login attempts for 30 seconds. After the 30 seconds, the blocked status should expire and have the user try again (do successful and unsuccessful feature just to be safe).

    4.  Check for 3 consecutive login attempts but not within a minute (ask in RE what resulting behavior should be).

    5.  Cannot access pages in the app until you're logged in.

        1.  If not logged in, can only access login / create account.

        2.  Can default to either page if the user isn't logged in (our choice).

    6.  Only logged in users can access any functionality except for the login page and the account creation page of the application (ask in RE what behavior should be if an attempt is made while logged in).

    7.  (Not a feature): Just username and password for login is required.

10.  Attractive user interface
     - Login Page features app name “Lets Go Camping!” in a prominent, colorful, and attractive way (make it big).
     - Should be similar on all other pages but less prominent than the login page (also make it consistent with the main login page).
     - Header and footer of all pages must contain a team number with a text color that contrasts well with the background (no exclusions).
     - Should be able to navigate from page to page (ask in RE for specifics other than navbar not being explicitly needed).
     - Questions for RE:
       - What information should the header and footer each have on every page, excluding our team number?
         - All pages header and footer
         - Team name i.e “team 20” in header or footer
         - Contrast against a background
     - Where should site navigation be generally located outside of the create/login page? Should it be within the header, on a specific corner, or somewhere else?


11.  Architecture: React client-side and SpringBoot server-side.

## List of Items on this Sprint's Backlog
1. Feature 1: Search for a park to visit based on various attributes
write appropriate scenarios in feature file
accessibility
2. Feature 2: Obtain details about various parks
write appropriate scenarios in feature file
accessibility
3. Feature 4: Update and review a favorite park list - (Mahum)
finish the frontend implementation and testing
4. Compare favorite park list (Chetan)
4. Feature 6: Suggest a park to visit among a group of friends (Nicholas)


## Explanation for Sprint Backlog Selection
Paragraph, no more than 300 words, explaining how and why the sprint backlog items were chosen by the team
The create account functionality was incomplete from last sprint. I chose to complete the create account feature with all necessary subfeatures and to also work on feature 9 to secure user data. This would complete two features from the feature list.
Additionally, we chose to start working on feature 4, updating and reviewing a favorite park list. We chose this feature so that we can start implementing some of the main intended functionalities of this web application, while other high-level features such as accessibility can be addressed in future sprints.
We chose to implement feature 5 for this sprint because it will be needed to complete the sub feature for “suggesting a park to visit among a group of friends,” as well as other subfeatures that will be required for the next sprint.
We also chose to begin to implement feature 1 for this sprint. We want to start understanding the subfeatures required for this feature, and this feature would get me thinking about which different attributes we wanted for each park, how exactly search would work, etc, which are all key aspects of our project.
Additionally, we chose to implement sub-requirements of feature 10 because it’s something that can be achieved relatively quickly and we have no current blockers to achieve it.


## Task Chart
Embed screenshot of the initial task chart





