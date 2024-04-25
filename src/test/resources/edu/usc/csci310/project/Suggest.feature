Feature: Suggest a Park to Visit Among a Group of Friends
  # Navigation
#  Scenario: Navigate from this page to Search page
#    Given I am on the "compare" page
#    When I click on the nav button with id "nav-search"
#    Then I should be redirected to the "search" page
#    And see that the page title is "Search Parks"
#
#  Scenario: Navigate from this page to Favorites page
#    Given I am on the "compare" page
#    When I click on the nav button with id "nav-favorites"
#    Then I should be redirected to the "Favorites" page
#    And see that the page title is "My Favorite Parks"
#
#  Scenario: Logout from this page and go to Login page
#    Given I am on the "compare" page
#    When I click on the nav button with id "nav-logout"
#    Then I should be redirected to the "login" page
#    And see that the page title is "Login"

  # Verified
  Scenario: Suggest the best park based on group favorites
    Given I am on the Compare page
    And I have "Nicko_STMP1" registered
    And I have "Nicko_STMP2" registered
    And "Nicko_STMP1" has a "public" park list
    And "Nicko_STMP2" has a "public" park list
    And I have park with id "yell" favorited
    And "Nicko_STMP1" has park with id "grte" favorited
    And "Nicko_STMP2" has park with id "grte" favorited
    When I enter "Nicko_STMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP1 to your group of friends"
    When I enter "Nicko_STMP2" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP2 to your group of friends"
    And I click on the element with id "suggestBtn"
    Then the most common park should be displayed

  Scenario: When park is suggested, display name, location, and 3 images
    Given I am on the Compare page
    And I have "Nicko_STMP1" registered
    And I have "Nicko_STMP2" registered
    And "Nicko_STMP1" has a "public" park list
    And "Nicko_STMP2" has a "public" park list
    And I have park with id "yell" favorited
    And "Nicko_STMP1" has park with id "grte" favorited
    And "Nicko_STMP2" has park with id "grte" favorited
    When I enter "Nicko_STMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP1 to your group of friends"
    When I enter "Nicko_STMP2" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP2 to your group of friends"
    And I click on the element with id "suggestBtn"
    Then the most common park should be displayed
    And I should see "Grand Teton National Park"
    And I should see "Moose, WY"
    And I should see 3 photos

#  Scenario: Display a random suggested park if no common favorites are found
#    Given I am on the Compare page
#    And I have selected friends "Annie, Bob, Mary"
#    When I click the 'Suggest the Best Park' button
#    And no common park is found in the favorite lists
#    Then the most common park should be displayed
#    And three park photos, park name, and location should be displayed
#
#
#  Scenario: Display a randomly selected park if no common favorites are found
#    Given I am on the Compare page
#    And I have selected friends "Annie, Bob, Mary"
#    When I click the 'Suggest the Best Park' button
#    And no common park is found in the favorite lists
#    Then a randomly selected park should be displayed
#    And three park photos, park name, and location should be displayed

#  Scenario: Interacting with the suggested park details
#    Given a park has been suggested
#    When I click on the park name
#    Then the details window of the park is displayed inline
#    And three park photos, park name, and location should be displayed

#  Scenario: Once display is clicked a park detail window should appear
#    Given I am on the Compare page
#    And I have selected friends "Annie, Bob, Mary"
#    When I click the 'Suggest the Best Park' button
#    Then the best park based on common favorites should be displayed
#    And three park photos, park name, and location should be displayed
#    When I click the display, a park detail window should appear

