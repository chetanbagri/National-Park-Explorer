Feature: test the search page
  Scenario: Default search by park name
    Given I am on the search page
    When the user enters "Yellowstone" into the search box
    And I press the Search button
    Then the search results for Yellowstone should be displayed

  Scenario: Enter empty park name
    Given I am on the search page
    When the user enters "" into the search box
    And I press the Search button
    Then the search results for Alcatraz Island should be displayed

  Scenario: Search by state
    Given I am on the search page
    When the user enters "CA" into the search box
    And I press the "State" radio button
    And I press the Search button
    Then the search results for "CA" should be displayed

  Scenario: Search by activity
    Given I am on the search page
    When the user enters "stargazing" into the search box
    And I press the "Activity" radio button
    And I press the Search button
    Then the search results for "stargazing" should be displayed

  Scenario: Search by amenity
    Given I am on the search page
    When the user enters "elevator" into the search box
    And I press the "Amenities" radio button
    And I press the Search button
    Then the search results for "elevator" should be displayed


  Scenario: View more results
    Given I am on the search page
    When the user enters "Park" into the search box
    And I press the Search button
    Then clicks the "load more results" button
    Then 10 more results should be appended to the list

