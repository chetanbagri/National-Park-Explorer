# Sprint Planning Meeting 
The required contents of this file are described in the *Sprint Planning* section of the Project Manual. In case of a discrepancy between this file and the manual, the requirements in the manual take priority.

## List of Meeting Participants
1. Nicholas Schumacher (Present)
2. Chetan Bagri (Present)
3. Anika Patel (Present)
4. Jainee Shah (Present)
5. Mahum Syed (Present)

## List of Items on Product Backlog
1. Feature 2: Obtain details about the various parks
2. Feature 4: Update and review a favorite park list
3. Feature 5: Compare favorite park list with friends
4. Feature 6: Suggest a park to visit among a group of friends
5. Feature 7: Accessible for people with disabilities
6. Feature 8: Works on Chrome browser and mobile devices
7. Feature 9: Is secure and protects users’ data.
8. Feature 10: Attractive user interface
9. Feature 11: Architecture: React client-side and SpringBoot server-side.

## List of Items on this Sprint's Backlog
1. Feature 2: Obtain details about various parks 
   1. Need use case for hover always appearing when opening search favorites details
         widget (we have this implemented but no use case defined).
   2. ^^^^ Last thing we need!
2. Feature 4: Update and review a favorite park list
   1. Need a use case specifying to navigate to favorites page from any page (search
   recommended), and once navigated there, I’m presented with a list of favorite
   parks (at least 1) in a list-like format (exactly like search page).
   2. Need to specify “Then the user should see “Alcatraz Island” in a list-like format”.
   We’re very close with a commented out feature.
   3. On hover, display up/down arrow near minus sign on favorites. Have use case for
   up and different use case for down.
   4. Need use case for persistent favorites list (add 2 to favorites, go to favorites,
   move the 2nd one to be number 1, go off to some other page, then navigate
   back to favorites, and the order should be the same).
   5. Need to handle cases of favorites page such have a button that allows you to
   mark a user’s favorite as a public or private (3 use cases).
   6. Navigate to favorites, favorites list is set to private by default.
   7. On favorites, set my entire favorites list to public.
   8. On favorites, after setting it to public, navigate to other page, go back to favorites
   page, and it is still public.
   9. Need use case for hover always appearing when opening search and favorites
   details widget (we have this implemented but no use case).
3. Feature 5: Compare favorite park list
   1. Replace add 1 friend use case with add 1 friend if they have a public list.
   2. Replace the word “username” with “account” in all use cases.
   3. Need an explicit button to click and then does the comparison
      1. Include “I click a compare button”.
   4. If I click OR hover on the ratio (1 use case total), then I need to show which users
   have it favorited.
   5. Need an explicit button that causes the system to make the best park match to
   appear.
4. Feature 6: Suggest a park to visit among a group of friends
   1. Need use case for clicking a button and displaying the best park.
   2. Once I suggested the best park, a certain thing should appear with details and
   clicking any of that will display the park window. Specific use case is that clicking
   on it displays the inline window of the best park.
   3. That should be it for suggest park with the feasibility analysis fixed.
      1. We were denied the feasibility analysis due to the wording of “If we are
         unable to find a common park between all users, we would simply display
         a message stating ‘no suitable parks to suggest' “.
5. Feature 7: Accessible for people with disabilities manually checked)
   1. Alt labels, tabbing to elements, other accessibility lecture stuff on all pages
   needed.
   2. Never have positive tabIndex values (have 0 instead of like 1, 2, 3, 4, 5). Just
   needs to be reachable.
   3. Done on search page, but need it on details widget (because our inline window
   uses a span element and by default, span elements aren’t accessible).
   4. All park URLs are accessible by default if in “a” and “button” tags but divs and
   spans aren’t, so need to do it with tabIndex (add it!).
6. Feature 8: Works on Chrome browser and mobile devices
7. Feature 9: Is secure and protects users’ data.
   1. 1 use case for each page to only be accessible via SSL (https:// to access it).
   Make it so the user is denied access if they fail (don’t need a success case).
      1. In other words, make a use case FOR EACH PAGE that fails to let the
      user access it if they don’t use https://
   2. A user session should only last for 60 seconds of inactivity. At 61 seconds of
   inactivity, I need to be logged out and taken to the login page. Just 1 use case on
   any general page (not for each page).
   3. Manually show that all info is hashed or encrypted, and that all user info is not
   stored on a third-party.
8. Feature 10: Attractive user interface
   1. Need an attractive app (subjective). PRETTIFY IT. Have a picture or color or
   center or something.
      1. Login and create an account page is good.
      2. Rest of the pages aren’t. Not worth much pts though (like 12).
      3. Get rid of the horizontal bar on the search page.
9. Feature 11: Architecture: React client-side and SpringBoot server-side.

## Explanation for Sprint Backlog Selection
Paragraph, no more than 300 words, explaining how and why the sprint backlog items were chosen by the team
We chose these items as they were issues brought up by our Stakeholder during the Sprint 3 Review. We also knew subfeatures discovered from previous RE Meetings that we have not yet fully implemented. This sprint, we plan to finish every subfeature previously discovered through the RE meetings and Sprint 3 Review so we can maximize our implementation score. Some of our features are nearly complete such as the details feature, while other features have a lot more work needed or depend on the completion of other features. An example is that the accessibility feature primarily depends on a particular page/feature being completed before accessibility can be taken into consideration. We also wrote specific use cases and practices that should be completed this sprint to maximize client satisfaction (and our point gain).

## Task Chart
Embed screenshot of the initial task chart
![image](https://github.com/CSCI310-20241/project-team-20/assets/89752707/6ee07283-e612-465f-b15a-fc9a749b869f)





