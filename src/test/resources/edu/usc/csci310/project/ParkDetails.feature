Feature: test the search page details feature
  Background:
    Given I'm logged in

  Scenario: Details
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then an inline window showing the details of the park is appended

  Scenario: Details without using mouse
    Given I am on the search page
    And I hit the enter key
    And I hit the tab button once and then enter once
    Then an inline window showing the details of the park is appended

  Scenario: Closing details
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then an inline window showing the details of the park is appended
    When I click on the search result again
    Then the inline window is closed

  Scenario: Details about details 1
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window has the full name of the park

  Scenario: Details about details 2
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window has the location of the park

  Scenario: Details about details 3
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window has a Clickable park url

  Scenario: Details about details 4
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window has the park's entrance fee

  Scenario: Details about details 5
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window has a representative picture of the park

  Scenario: Details about details 6
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window has a short description of the park

  Scenario: Details about details 7
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window has a short description of the park

  Scenario: Details about details 8
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window lists the amenities provided by the park

  Scenario: Details about details 9
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    Then the details window lists the activities provided by the park

  Scenario: Details about details 10
    Given I am on the search page
    And I press the Search button
    And favorite the first result
    And I click on the first result
    Then the details window shows and says the park is on the user's fave list

  #Scenario: Details about details 10 - 2
  #  Given I am on the search page
  #  And I press the Search button
  #  And I click on the first result which is not on the user's favorite list
  #  Then the details window displays and says the park is not on the user's fave list

  Scenario: Clicking on an amenity
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    And I click on one of the amenities
    Then new park search triggered with clicked on amenity as search term
    And search type will be amenity

  Scenario: Clicking on an activity
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    And I click on one of the activities
    Then new park search triggered with clicked on activity as search term
    And search type will be activity

  Scenario: Clicking on location
    Given I am on the search page
    And I press the Search button
    And I click on the first result
    And I click on the park's location
    Then new park search triggered with clicked on location as search term
    And search type will be state