Feature: Compare favorite park list with friends (#5)
  # Navigation
  Scenario: Navigate from this page to Search page
    Given I am on the "compare" page
    When I click on the nav button with id "nav-search"
    Then I should be redirected to the "search" page
    And see that the page title is "Search Parks"

  Scenario: Navigate from this page to Favorites page
    Given I am on the "compare" page
    When I click on the nav button with id "nav-favorites"
    Then I should be redirected to the "Favorites" page
    And see that the page title is "My Favorite Parks"

  Scenario: Logout from this page and go to Login page
    Given I am on the "compare" page
    When I click on the nav button with id "nav-logout"
    Then I should be redirected to the "login" page
    And see that the page title is "Login"

  # Add users to group
  Scenario: Add 1 friend to group successfully
    Given I am on the Compare page
    And I have "Nicko_1" registered
    When I enter "Nicko_1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added NickoOG1 to your group of friends"


  Scenario: Add 1 friend to group successfully if user B has a public list

  Scenario: Add 2 friends to group successfully

  Scenario: Fail to add friend if they are already in the user's group

  Scenario: Fail to add friend to group if the user attempts to add themselves
    
  Scenario: Fail to add friend to group if their username does not exist

  Scenario: Fail to compare if user A does not have at least one other user in their group

  Scenario: Compared parks appear in ranked order based members having it favorited

  Scenario: Each compared park shows a ratio in the number of people that have it favorited over the total group

  Scenario: All compared parks displayed are on at least one group member's favorites list

  # Verified
  Scenario: Fail to add to group if user B does not have a public list

  Scenario: Clicking on compared park list displays detail window to display similar to search page

