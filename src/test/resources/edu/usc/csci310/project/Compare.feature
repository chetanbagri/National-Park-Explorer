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
  # FIX THIS TO SET OR CHECK FOR PUBLIC LIST
  Scenario: Add 1 friend to group successfully if they have a public list
    Given I am on the Compare page
    And I have "Nicko_1" registered
    When I enter "Nicko_1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_1 to your group of friends"

  #Verified
  Scenario: User B cannot be added if they do not have a public list

#  Scenario: Add 2 friends to group successfully if both have a public list

#  Scenario: Fail to add friend if they are already in the user's group

#  Scenario: Fail to add friend to group if the user attempts to add themselves

  #verified
  Scenario: Fail to add friend to group if their account does not exist

    # Display error message still
#  Scenario: Fail to compare if user A does not have at least one other user in their group

  #Verified
  Scenario: Clicking on compare button will compare parks and display the parks in a ranked order

    # Verified
  Scenario: Each compared park shows a ratio

    # Implicitly covered already
#  Scenario: All compared parks displayed are on at least one group member's favorites list

  #Verified
  Scenario: Clicking/hovering on park ratio displays accounts that favorited the park

  # Verified

  # Verified
  Scenario: Clicking on compared park within the list displays detail window similar to search page

