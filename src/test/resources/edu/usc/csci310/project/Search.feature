#Feature: Search for a park to visit based on various attributes
#  Scenario: Search page initially displays a search bar, 4 search options (park name, amenities, state, activity), and a search button
#    Given I am on the Search page
#    Then I should see a search bar, 4 search options (park name, amenities, state, activity), and a search button
#
#  Scenario: Search by park name by default
#    Given I am on the Search page
#    When I enter "Abraham Lincoln Birthplace National Historical Park" into the search bar
#    And I press the Search submit button
#    Then I should see a park name with "Abraham Lincoln Birthplace National Historical Park" displayed
#
#  Scenario: Search by park name after clicking on other all options (1 option at a time)
#    Given I am on the Search page
#
#  Scenario: Search by amenities
#    Given I am on the Search page
#
#  Scenario: Search by state
#    Given I am on the Search page
#
#  Scenario: Search by activity/activities
#    Given I am on the Search page
#
#  Scenario: Show maximum of 10 results
#    Given I am on the Search page
#
#  Scenario: Show 10 results, then load more results to show maximum of 10 more parks
#    Given I am on the Search page
#
#  Scenario: Show 10 results, then load 20 more results
#    Given I am on the Search page

#  Scenario: No parks found #optional I think

