Feature: Compare favorite park list with friends (#5)
  # Navigation (credit awarded for all already)
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
  Scenario: Add 1 friend to group successfully if they have a public list
    Given I am on the Compare page
    And I have "Nicko_CTMP1" registered
    And "Nicko_CTMP1" has a "public" park list
    When I enter "Nicko_CTMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_CTMP1 to your group of friends"

#  #Verified
  Scenario: User B cannot be added if they do not have a public list
    Given I am on the Compare page
    And I have "Nicko_CTMP1" registered
    And "Nicko_CTMP1" has a "private" park list
    When I enter "Nicko_CTMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Error: User cannot be added due to them having a private favorite park list"

  #Verified
  Scenario: Fail to add friend to group if their account does not exist
    Given I am on the Compare page
    When I enter "Nicko_CTMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Error: Username does not exist"

  #Verified
  Scenario: Clicking on compare button will display compared parks in ranked order
    Given I am on the Compare page
    And I have "Nicko_CTMP1" registered
    And "Nicko_CTMP1" has a "public" park list
    And I have park with id "grte" favorited
    And I have park with id "wrst" favorited
    And I have park with id "yell" favorited
    And "Nicko_CTMP1" has park with id "grte" favorited
    When I enter "Nicko_CTMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_CTMP1 to your group of friends"
    And I click on the element with id "compareBtn"
    Then I should see "Grand Teton National Park"
    And I should see "Yellowstone National Park"
    And I should see "Wrangell"

  # Verified
  Scenario: Each compared park shows a ratio
    Given I am on the Compare page
    And I have "Nicko_CTMP1" registered
    And "Nicko_CTMP1" has a "public" park list
    And I have park with id "grte" favorited
    And I have park with id "yell" favorited
    And "Nicko_CTMP1" has park with id "grte" favorited
    When I enter "Nicko_CTMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_CTMP1 to your group of friends"
    And I click on the element with id "compareBtn"
    Then I should see "Grand Teton National Park"
    And I should see "2 / 2"
    And I should see "Yellowstone National Park"
    And I should see "1 / 2"

  #Verified
  Scenario: Clicking on park ratio displays accounts that favorited the park
    Given I am on the Compare page
    And I have "Nicko_CTMP1" registered
    And "Nicko_CTMP1" has a "public" park list
    And I have park with id "grte" favorited
    And I have park with id "yell" favorited
    And "Nicko_CTMP1" has park with id "grte" favorited
    When I enter "Nicko_CTMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_CTMP1 to your group of friends"
    And I click on the element with id "compareBtn"
    Then I should see "Grand Teton National Park"
    And I should see "Yellowstone National Park"
    And I click on text "2 / 2" with id "pid-0"
    Then I should see "NickoOG_CTMP"
    Then I should see "Nicko_CTMP1"
    And I click on text "2 / 2" with id "pid-0"
    And I click on text "1 / 2" with id "pid-1"
    Then I should see "NickoOG_CTMP"

  # Verified
  Scenario: Clicking on compared park within the list displays detail window
    Given I am on the Compare page
    And I have "Nicko_CTMP1" registered
    And "Nicko_CTMP1" has a "public" park list
    And I have park with id "grte" favorited
    And I have park with id "wrst" favorited
    And I have park with id "yell" favorited
    And "Nicko_CTMP1" has park with id "grte" favorited
    When I enter "Nicko_CTMP1" into element with id "usernameQuery"
    And I click on the element with id "addUserBtn"
    Then I should see "Successfully added Nicko_CTMP1 to your group of friends"
    And I click on the element with id "compareBtn"
    Then I should see "Grand Teton National Park"
    And I should see "Yellowstone National Park"
    And I should see "Wrangell"
    And I click on the first park
    Then I should see details about the park
