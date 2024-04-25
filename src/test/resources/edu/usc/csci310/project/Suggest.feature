Feature: Suggest a Park to Visit Among a Group of Friends

  Scenario: Display must include three photos of the park, the park name, and location
    Given I am on the Compare page
    And I have selected friends "Annie, Bob, Mary"
    When I click the 'Suggest the Best Park' button
    Then the best park based on common favorites should be displayed
    And three park photos, park name, and location should be displayed

  Scenario: Suggest the best park based on group favorites
    Given I am on the Compare page
    And I have selected friends "Annie, Bob, Mary"
    When I click the 'Suggest the Best Park' button
    Then the best park based on common favorites should be displayed
    And three park photos, park name, and location should be displayed

  Scenario: Display the most common park if no common favorites are found
    Given I am on the Compare page
    And I have selected friends "Annie, Bob, Mary"
    When I click the 'Suggest the Best Park' button
    And no common park is found in the favorite lists
    Then the most common park should be displayed
    And three park photos, park name, and location should be displayed


  Scenario: Display a randomly selected park if no common favorites are found
    Given I am on the Compare page
    And I have selected friends "Annie, Bob, Mary"
    When I click the 'Suggest the Best Park' button
    And no common park is found in the favorite lists
    Then a randomly selected park should be displayed
    And three park photos, park name, and location should be displayed

  Scenario: Interacting with the suggested park details
    Given a park has been suggested
    When I click on the park name
    Then the details window of the park is displayed inline
    And three park photos, park name, and location should be displayed

  Scenario: Once display is clicked a park detail window should appear
    Given I am on the Compare page
    And I have selected friends "Annie, Bob, Mary"
    When I click the 'Suggest the Best Park' button
    Then the best park based on common favorites should be displayed
    And three park photos, park name, and location should be displayed
    When I click the display, a park detail window should appear

