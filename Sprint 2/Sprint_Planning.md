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
    
3.  Create a user account
    
    1.  After successful user creation, must take them back to the login page automatically.
        
    2.  Have a confirm password field.
        
    3.  Buttons to either create the user or cancel.
        
        1.  Cancel button should have a pop up (ask in RE for specifics but prof said to do something like "Are you sure you want to cancel" or similar message), and have the option to cancel the cancel, and to confirm the cancel. When confirming the cancel button, the user should be taken back to the login page.
            
    4.  Login Page needs a link to Create Account (button not quite needed on Create Account since we should have the Cancel button already).
        
    5.  Error conditions (do RE for this).
        
        1.  Username exists (ask in RE if for login, create, or both).
            
        2.  If you haven't entered the second version of the password (confirm password), give some sort of error message.
            
        3.  If passwords don't match on Create Account.
            
        4.  Password does not have at least one upper case, one lower case, and one number.
            
        5.  RE: Prof didn't explicitly say anything about password length, ask CP!
            
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
 
11.  Architecture: React client-side and SpringBoot server-side.

## List of Items on this Sprint's Backlog
1. Create a user account (feature 3) (Chetan)
2. Is secure and protects users’ data (feature 9) (Chetan)
3. Attractive User Interface (feature 10) (Nicholas)
4. Search for a park to visit based on various attributes (feature 1) (Jainee)
5. Update and review a favorite park list (feature 4) (Mahum)
6. Compare favorite park list with friends (feature 5) (Anika)


## Explanation for Sprint Backlog Selection
Paragraph, no more than 300 words, explaining how and why the sprint backlog items were chosen by the team
The create account functionality was incomplete from last sprint. I chose to complete the create account feature with all necessary subfeatures and to also work on feature 9 to secure user data. This would complete two features from the feature list. Additionally, we chose to start working on feature 4, updating and reviewing a favorite park list. We chose this feature so that we can start implementing some of the main intended functionalities of this web application, while other high-level features such as accessibility can be addressed in future sprints. We chose to implement feature 5 for this sprint because it will be needed to complete the sub feature for “suggesting a park to visit among a group of friends,” as well as other subfeatures that will be required for the next sprint. We also chose to begin to implement feature 1 for this sprint. We want to start understanding the subfeatures required for this feature, and this feature would get me thinking about which different attributes we wanted for each park, how exactly search would work, etc, which are all key aspects of our project. Additionally, we chose to implement sub-requirements of feature 10 because it’s something that can be achieved relatively quickly and we have no current blockers to achieve it.


## Task Chart
Embed screenshot of the initial task chart
![image](https://github.com/CSCI310-20241/project-team-20/assets/89752707/e7156662-f965-46ec-bb51-92d18c7ac9a1)





