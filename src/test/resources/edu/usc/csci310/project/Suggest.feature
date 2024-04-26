Feature: Suggest a Park to Visit Among a Group of Friends
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

  # Verified
  Scenario: Clicking the suggest button will show the best park based on group favorites
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
    And I have "Nicko_STMP3" registered
    And I have "Nicko_STMP4" registered
    And "Nicko_STMP3" has a "public" park list
    And "Nicko_STMP4" has a "public" park list
    And I have park with id "yell" favorited
    And "Nicko_STMP3" has park with id "grte" favorited
    And "Nicko_STMP4" has park with id "grte" favorited
    When I enter "Nicko_STMP3" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP3 to your group of friends"
    When I enter "Nicko_STMP4" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP4 to your group of friends"
    And I click on the element with id "suggestBtn"
    Then the most common park should be displayed
    And I should see "Grand Teton National Park"
    And I should see "Moose, WY"
    And I should see 3 photos

  Scenario: Once suggested display is clicked, a park detail window appears
    Given I am on the Compare page
    And I have "Nicko_STMP5" registered
    And I have "Nicko_STMP6" registered
    And "Nicko_STMP5" has a "public" park list
    And "Nicko_STMP6" has a "public" park list
    And I have park with id "yell" favorited
    And "Nicko_STMP5" has park with id "grte" favorited
    And "Nicko_STMP6" has park with id "grte" favorited
    When I enter "Nicko_STMP5" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP5 to your group of friends"
    When I enter "Nicko_STMP6" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_STMP6 to your group of friends"
    And I click on the element with id "suggestBtn"
    Then the most common park should be displayed
    And I should see "Grand Teton National Park"
    And I should see "Moose, WY"
    And I should see 3 photos
    When I click on the suggested park
    Then I should see details about the park

    #  Scenario: If a tie occurs, suggest best park based on highest ranking among all group members
#    Given I am on the Compare page
#    And I have selected friends "Annie, Bob, Mary"
#    When I click the 'Suggest the Best Park' button
#    And no common park is found in the favorite lists
#    Then a randomly selected park should be displayed
#    And three park photos, park name, and location should be displayed

#  Scenario: Display a randomly suggested park if no common favorites are found
#    Given I am on the Compare page
#    And I have "Nicko_STMP7" registered
#    And "Nicko_STMP7" has a "public" park list
#    And I have park with id "yell" favorited
#    And "Nicko_STMP7" has park with id "grte" favorited
#    When I enter "Nicko_STMP7" into element with id "usernameQuery"
#    And I click on the element with id "addUserBtn"
#    Then I should see "Successfully added Nicko_STMP7 to your group of friends"
#    And I click on the element with id "suggestBtn"
#    Then the most common park should be displayed
#    And I should see "Grand Teton National Park"
#    And I should see "Moose, WY"
#    And I should see 3 photos
