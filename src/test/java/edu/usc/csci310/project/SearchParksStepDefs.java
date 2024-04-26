package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest

public class SearchParksStepDefs {
    private static final String ROOT_URL = "https://localhost:8080/search"; // Adjust this to your search page URL
    private static final String ROOT_URL2 = "https://localhost:8080/"; // Adjust this to your search page URL

    private final WebDriver driver;
    private final WebDriverWait wait;



    public SearchParksStepDefs() {
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        this.driver = new ChromeDriver(options);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    }

    @After
    public void afterScenario() {
        driver.quit();
    }

    @Given("I am on the search page")
    public void iAmOnTheSearchPage() {

        driver.get(ROOT_URL);
    }

    @When("the user enters {string} into the search box")
    public void theUserEntersIntoTheSearchBox(String query) {
        driver.findElement(By.id("searchQuery")).sendKeys(query);
    }

    @And("I press the Search button")
    public void iPressTheSearchButton() {

        driver.findElement(By.id("search")).click();
        wait.until(webDriver -> driver.findElements(By.cssSelector(".search-result")).size() > 0);
    }
    public void waitForTextToAppearInPageSource(WebDriver driver, String textToAppear, int timeoutInSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
        wait.until((WebDriver d) -> d.getPageSource().contains(textToAppear));
    }


    @Then("the search results for Yellowstone should be displayed")
    public void theSearchResultsForShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Grand Teton National Park", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("Yellowstone"));
    }
    @Then("10 search results for \"Picnic Table\" should be displayed")
    public void theSearchResultsForAmenityShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Arlington House, The Robert E. Lee Memorial", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("Picnic Table"));

        resultsWillBeDisplayed();
    }
    @Then("10 search results for \"CA\" should be displayed")
    public void theSearchResultsForStateShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Alcatraz Island", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("CA"));

        resultsWillBeDisplayed();
    }
    @Then("10 search results for \"stargazing\" should be displayed")
    public void theSearchResultsFoActivityrShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Abraham Lincoln Birthplace National Historical Park", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("stargazing"));

        resultsWillBeDisplayed();
    }

    @Then("{int} more results should be appended to the list")
    public void theSearchResultsShouldShowMoreThanParks(int expectedNumber) {
        waitForTextToAppearInPageSource(driver, "American Memorial Park", 5);
    }

    @Then("clicks the \"load more results\" button")
    public void theUserClicksTheLoadMoreResultsButton() {
        waitForTextToAppearInPageSource(driver, "Load More Results", 5);
        WebElement loadMoreButton = driver.findElement(By.id("loadMoreResults"));
        loadMoreButton.click();
    }
    @And("I press the {string} radio button")
    public void iPressTheRadioButton(String radioButtonId) {
        String lowercaseRadioButtonId = radioButtonId.toLowerCase();
        WebElement radioButton = driver.findElement(By.id(lowercaseRadioButtonId));
        if (!radioButton.isSelected()) {
            radioButton.click();
        }
    }
    @Given("the user has already performed a search for {string}")
    public void theUserHasAlreadyPerformedASearchFor(String arg0) {
        waitForTextToAppearInPageSource(driver, "Alcatraz Island", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("CA"));
    }

    @Then("the search results for Alcatraz Island should be displayed")
    public void theSearchResultsForAlcatrazIslandShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Alcatraz Island", 5); // Adjust the timeout as needed
    }

//    @After
//    public void tearDown() {
//        driver.quit();
//    }

    @Given("I'm on search and I enter some kind of search")
    public void iMOnSearchAndIEnterSomeKindOfSearch() {
        iAmOnTheSearchPage();
        theUserEntersIntoTheSearchBox("park");
        iPressTheSearchButton();
    }

    @Then("10 results will be displayed")
    public void resultsWillBeDisplayed() {
        List<WebElement> searchResults = driver.findElements(By.cssSelector(".search-result")); // Adjust the selector to match your HTML structure
        assertEquals(10, searchResults.size());
    }

    @And("I hit the enter key")
    public void iHitTheEnterKey() {
        WebElement searchInput = driver.findElement(By.id("searchQuery")); // Adjust if your input has a different id or selector
        searchInput.sendKeys(Keys.ENTER);
        wait.until(webDriver -> driver.findElements(By.cssSelector(".search-result")).size() > 0);
    }

    @When("the user presses the favorites button at the top")
    public void theUserPressesTheFavoritesButtonAtTheTop() {
        // //*[@id="root"]/div/div/header/div[1]/a[2]
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div[1]/a[2]")).click();
    }

    @Then("the user is navigated to the favorites page")
    public void theUserIsNavigatedToTheFavoritesPage() {
        waitForTextToAppearInPageSource(driver, "Favorites", 5); // Adjust the timeout as needed
    }

    @When("I click on the compare and suggest button")
    public void iClickOnTheCompareAndSuggestButton() {
        // //*[@id="root"]/div/div/header/div[1]/a[3]
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div[1]/a[3]")).click();
    }

    @Then("the user is navigated to the compare and suggest screen")
    public void theUserIsNavigatedToTheCompareAndSuggestScreen() {
        waitForTextToAppearInPageSource(driver, "Add A Friend to Your Group", 5); // Adjust the timeout as needed
        userService.removeUser("Bob");
    }
    @Autowired
    private UserService userService;
    @Given("I'm logged in")
    public void iMLoggedIn() {
        driver.get(ROOT_URL2);

        userService.registerUser("Bob", "Happy1", "Happy1");

        String username = "Bob";
        String password = "Happy1";
        WebElement usernameInput = driver.findElement(By.id("username"));
        WebElement passwordInput = driver.findElement(By.id("password"));
        usernameInput.click();
        usernameInput.sendKeys(username);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        passwordInput.click();
        passwordInput.clear();
        wait.until((WebDriver d) -> passwordInput.getAttribute("value").isEmpty());

        passwordInput.sendKeys(password);

        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();

        WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait2.until(ExpectedConditions.urlToBe("https://localhost:8080/search"));
        assertEquals("https://localhost:8080/search", driver.getCurrentUrl());
    }

    @And("I click on the first result")
    public void iClickOnTheFirstResult() {
        List<WebElement> searchResults = driver.findElements(By.cssSelector(".search-result-button"));
        if (searchResults.size() > 0) {
            searchResults.get(0).click(); // Clicks the first result
        } else {
            fail("No search results found to click.");
        }

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".detailsBox"))); // Adjust the selector to the details box
    }

    @Then("an inline window showing the details of the park is appended")
    public void anInlineWindowShowingTheDetailsOfTheParkIsAppended() {
        List<WebElement> detailsBox = driver.findElements(By.cssSelector(".detailsBox")); // Adjust the selector to the details box
        assertTrue(detailsBox.size() > 0, "The details of the park were not displayed inline.");

        WebElement detailElement = detailsBox.get(0).findElement(By.tagName("h3")); // Adjust based on actual content, e.g., park name header
        assertNotNull(detailElement, "Park details content is missing.");
    }

    @And("I hit the tab button once and then enter once")
    public void iHitTheTabButtonOnceAndThenEnterOnce() {
        new Actions(driver)
                .sendKeys(Keys.TAB)
                .pause(Duration.ofMillis(500)) // Pause briefly to ensure the UI can react to the tab action
                .sendKeys(Keys.ENTER)
                .build()
                .perform();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".detailsBox"))); // Adjust as needed
    }

    @When("I click on the search result again")
    public void iClickOnTheSearchResultAgain() {
        List<WebElement> searchResults = driver.findElements(By.cssSelector(".search-result button")); // Adjust the selector as needed
        if (!searchResults.isEmpty()) {
            searchResults.get(0).click(); // Clicks the first result again to close the details
        } else {
            fail("No search results found to click.");
        }
    }

    @Then("the inline window is closed")
    public void theInlineWindowIsClosed() {
        List<WebElement> detailsBox = driver.findElements(By.cssSelector(".detailsBox")); // Adjust the selector as needed
        if (!detailsBox.isEmpty()) {
            boolean isClosed = detailsBox.stream().noneMatch(WebElement::isDisplayed);
            assertTrue(isClosed, "The details window is still visible.");
        }

        boolean isAbsent = new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".detailsBox")));
        assertTrue(isAbsent, "The details window was not removed from the DOM.");
    }

    @Then("the details window has the full name of the park")
    public void theDetailsWindowHasTheFullNameOfThePark() {
        WebElement detailsWindow = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".detailsBox")));

        String expectedFullName = "Abraham Lincoln Birthplace National Historical Park"; // Example: "Yellowstone National Park"

        WebElement fullNameElement = detailsWindow.findElement(By.cssSelector(".park-full-name")); // Adjust your selector

        assertNotNull(fullNameElement, "Full name element not found in the details window.");
        assertEquals(expectedFullName, fullNameElement.getText().trim(), "The park's full name does not match the expected value.");
    }

    @Then("the details window has the location of the park")
    public void theDetailsWindowHasTheLocationOfThePark() {
        WebElement locationElement = driver.findElement(By.cssSelector(".park-location")); // Adjust the selector
        assertNotNull(locationElement, "Location element not found.");
        assertTrue(locationElement.getText().length() > 0, "Park location is missing or empty.");
    }

    @Then("the details window has a Clickable park url")
    public void theDetailsWindowHasAClickableParkUrl() {
        WebElement parkUrlElement = driver.findElement(By.cssSelector(".park-url")); // Adjust the selector
        assertNotNull(parkUrlElement, "Park URL element not found.");
        assertTrue(parkUrlElement.getAttribute("href").startsWith("http"), "Park URL is not valid.");
    }

    @Then("the details window has the park's entrance fee")
    public void theDetailsWindowHasTheParksEntranceFee() {
        WebElement entranceFeeElement = driver.findElement(By.cssSelector(".park-entrance-fee")); // Adjust the selector
        assertNotNull(entranceFeeElement, "Entrance fee element not found.");
        assertTrue(!Objects.equals(entranceFeeElement.getText(), ""), "Entrance fee is missing or not formatted correctly.");
    }

    @Then("the details window has a representative picture of the park")
    public void theDetailsWindowHasARepresentativePictureOfThePark() {
        WebElement pictureElement = driver.findElement(By.cssSelector(".park-picture")); // Adjust the selector
        assertNotNull(pictureElement, "Park picture element not found.");
        assertTrue(pictureElement.getAttribute("src").length() > 0, "Park picture URL is missing or empty.");
    }
    @Then("the details window has a short description of the park")
    public void theDetailsWindowHasAShortDescriptionOfThePark() {
        WebElement descriptionElement = driver.findElement(By.cssSelector(".park-description")); // Adjust the selector
        assertNotNull(descriptionElement, "Description element not found.");
        assertTrue(descriptionElement.getText().length() > 0, "Park description is missing or empty.");
    }

    @Then("the details window lists the amenities provided by the park")
    public void theDetailsWindowListsTheAmenitiesProvidedByThePark() {
        List<WebElement> amenitiesList = driver.findElements(By.cssSelector(".park-amenities")); // Adjust the selector
        assertFalse(amenitiesList.isEmpty(), "Amenities list is missing or empty.");
    }
    @Then("the details window lists the activities provided by the park")
    public void theDetailsWindowListsTheActivitiesProvidedByThePark() {
        List<WebElement> activitiesList = driver.findElements(By.cssSelector(".park-activities")); // Adjust the selector
        assertFalse(activitiesList.isEmpty(), "Activities list is missing or empty.");
    }

    public void scrollToViewByElement(WebDriver driver, By by) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.presenceOfElementLocated(by));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        try {
            Thread.sleep(500);  // Adjust this delay as necessary for your application
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Thread was interrupted, failed to complete operation");
        }
    }

    @And("I click on one of the amenities")
    public void iClickOnOneOfTheAmenities() {
        scrollToViewByElement(driver, By.xpath("//*[@id=\"root\"]/div/div/ul/li[1]/div[2]/p[5]/span[1]"));
        WebElement amenitiesElement = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/ul/li[1]/div[2]/p[5]/span[1]")); // Adjust the selector

        String clickedAmenity = amenitiesElement.getText();
        driver.manage().addCookie(new Cookie("clickedAmenity", clickedAmenity));

        amenitiesElement.click(); // Click the first amenity in the list.
    }
    @Then("new park search triggered with clicked on amenity as search term")
    public void newParkSearchTriggeredWithClickedOnAmenityAsSearchTerm() {
        String clickedAmenity = driver.manage().getCookieNamed("clickedAmenity").getValue();

        WebElement searchInput = driver.findElement(By.id("searchQuery")); // Adjust the selector
        assertEquals(clickedAmenity, searchInput.getAttribute("value"), "Search term does not match the clicked amenity.");
    }

    @And("search type will be amenity")
    public void searchTypeWillBeAmenity() {
        // Assuming there's a way to verify the current search type, perhaps via a selected radio button or other UI indicator. Adjust the selector accordingly.
        WebElement amenityRadioButton = driver.findElement(By.id("amenities")); // Adjust the selector
        assertTrue(amenityRadioButton.isSelected(), "Search type is not set to amenity.");
    }


    @And("I click on one of the activities")
    public void iClickOnOneOfTheActivities() {
        scrollToViewByElement(driver, By.xpath("//*[@id=\"root\"]/div/div/ul/li[1]/div[2]/p[4]/span[1]"));
        WebElement activitiesElement = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/ul/li[1]/div[2]/p[4]/span[1]")); // Adjust the selector

        String clickedAmenity = activitiesElement.getText();
        driver.manage().addCookie(new Cookie("clickedActivity", clickedAmenity));

        activitiesElement.click();
    }
    @Then("new park search triggered with clicked on activity as search term")
    public void newParkSearchTriggeredWithClickedOnActivityAsSearchTerm() {
        String clickedActivity = driver.manage().getCookieNamed("clickedActivity").getValue();

        WebElement searchInput = driver.findElement(By.id("searchQuery")); // Adjust the selector
        assertEquals(clickedActivity, searchInput.getAttribute("value"), "Search term does not match the clicked activity.");
    }

    @And("search type will be activity")
    public void searchTypeWillBeActivity() {
        WebElement activityRadioButton = driver.findElement(By.id("activity")); // Adjust the selector
        assertTrue(activityRadioButton.isSelected(), "Search type is not set to activity.");
    }



    @And("I click on the park's location")
    public void iClickOnTheParksLocation() {
        scrollToViewByElement(driver, By.xpath("//*[@id=\"root\"]/div/div/ul/li[1]/div/div[1]/p"));
        WebElement locationElement = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/ul/li[1]/div/div[1]/p")); // Adjust the selector

        String clickedLocation = locationElement.getText();
        driver.manage().addCookie(new Cookie("clickedLocation", clickedLocation));

        locationElement.click();
    }
    @Then("new park search triggered with clicked on location as search term")
    public void newParkSearchTriggeredWithClickedOnLocationAsSearchTerm() {
        String clickedLocation = driver.manage().getCookieNamed("clickedLocation").getValue();

        WebElement searchInput = driver.findElement(By.id("searchQuery")); // Adjust the selector
        assertEquals("KY", searchInput.getAttribute("value"), "Search term does not match the clicked activity.");
    }

    @And("search type will be state")
    public void searchTypeWillBeState() {
        WebElement activityRadioButton = driver.findElement(By.id("state")); // Adjust the selector
        assertTrue(activityRadioButton.isSelected(), "Search type is not set to state.");
    }


    @And("favorite the first result")
    public void favoriteTheFirstResult() {
        WebElement firstSearchResult = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".search-result:first-child .park-button")));

        Actions actions = new Actions(driver);
        actions.moveToElement(firstSearchResult).perform();

        WebElement favoriteIcon = new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".search-result:first-child .add-to-favorites")));
        favoriteIcon.click();
    }


    @And("I click on the first result which is on the user's favorite list")
    public void iClickOnTheFirstResultWhichIsOnTheUsersFavoriteList() {
        WebElement firstSearchResult = driver.findElement(By.cssSelector(".search-result:first-child .park-button"));
        firstSearchResult.click();
        new WebDriverWait(driver, Duration.ofSeconds(10)).until(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".detailsBox"))
        );
    }

    @Then("the details window shows and says the park is on the user's fave list")
    public void theDetailsWindowDisplaysAndSaysTheParkIsOnTheUsersFaveList() {
        WebElement detailsBox = driver.findElement(By.cssSelector(".detailsBox"));
        WebElement favoriteStatusMessage = detailsBox.findElement(By.cssSelector(".favorite-status"));
        assertTrue(favoriteStatusMessage.getText().contains("This park is in your favorites list"));
    }

    @And("I click on the first result which is not on the user's favorite list")
    public void iClickOnTheFirstResultWhichIsNotOnTheUsersFavoriteList() {
        List<WebElement> searchResults = driver.findElements(By.cssSelector(".search-result-button"));
        if (searchResults.size() > 0) {
            searchResults.get(9).click(); // 9th probably not on the user's favorite list
        } else {
            fail("No search results found to click.");
        }

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".detailsBox"))); // Adjust the selector to the details box
    }


    @Then("the details window displays, says the park isnt on user's fav list")
    public void theDetailsWindowDisplaysSaysTheParkIsntOnUserSFavList() {
        WebElement detailsBox = driver.findElement(By.cssSelector(".detailsBox"));
        WebElement favoriteStatusMessage = detailsBox.findElement(By.cssSelector(".favorite-status"));
        assertTrue(favoriteStatusMessage.getText().contains("This park is not in your favorites list"));
    }

    @And("I should see a plus sign while hovering on details widget")
    public void iShouldSeeAPlusSignWhileHoveringOnDetailsWidget() {
        WebElement firstSearchResult = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".search-result:first-child .park-button")));

        Actions actions = new Actions(driver);
        actions.moveToElement(firstSearchResult).perform();

        WebElement favoriteIcon = new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".search-result:first-child .add-to-favorites")));

        assertTrue(favoriteIcon.isDisplayed());
    }

    @When("the user hovers over the name of the park {string}")
    public void theUserHoversOverTheNameOfThePark(String parkName) {
        WebElement parkElement = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), '" + parkName + "')]")));
        Actions action = new Actions(driver);
        action.moveToElement(parkElement).perform();
    }

    @Then("a plus sign should appear")
    public void aPlusSignShouldAppear() {
        WebElement plusSign = new WebDriverWait(driver, Duration.ofSeconds(5))
                .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".add-to-favorites")));
        assertTrue(plusSign.isDisplayed());
    }

    @Then("the user should see {string} in Favorites list")
    public void theUserShouldSeeInFavoritesList(String parkName) {
        navigateToFavoritesPage();
        WebElement favoritesList = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.id("favorites-list")));
        assertTrue(favoritesList.getText().contains(parkName));
    }

    private void navigateToFavoritesPage() {
        WebElement navFavorites = driver.findElement(By.id("nav-favorites"));
        navFavorites.click();
    }
//
//    @And("the search results for Alcatraz Island are displayed")
//    public void theSearchResultsForAlcatrazIslandAreDisplayed() {
//        driver.get("http://localhost:8080/search?query=Alcatraz+Island");
//        assertTrue(driver.findElement(By.id("searchResults")).getText().contains("Alcatraz Island"));
//    }
//
//
//
//    @When("the user clicks the plus sign")
//    public void theUserClicksThePlusSign() {
//        WebElement plusSign = driver.findElement(By.className("add-to-favorites"));
//        plusSign.click();
//    }
//
//    @Then("a success message should be displayed")
//    public void aSuccessMessageShouldBeDisplayed() {
//        WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("successMessage")));
//        assertTrue(successMessage.isDisplayed());
//    }
//
//    @And("{string} is already in the user's favorites")
//    public void isAlreadyInTheUserSFavorites(String parkName) {
//        driver.get("http://localhost:8080/favorites");
//        assertTrue(driver.getPageSource().contains(parkName));
//    }
//
//    @Then("an error message should be displayed")
//    public void anErrorMessageShouldBeDisplayed() {
//        WebElement errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("errorMessage")));
//        assertTrue(errorMessage.isDisplayed());
//    }
//
//    @And("the user has added {string} to their favorites")
//    public void theUserHasAddedToTheirFavorites(String parkName) {
//        driver.get("http://localhost:8080/search?query=" + parkName);
//        WebElement plusSign = driver.findElement(By.className("add-to-favorites"));
//        plusSign.click();
//        WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("successMessage")));
//        assertTrue(successMessage.getText().contains("added to favorites"));
//    }
//
//    @When("the user navigates to the Favorites page")
//    public void theUserNavigatesToTheFavoritesPage() {
//        WebElement favoritesNav = driver.findElement(By.id("nav-favorites"));
//        favoritesNav.click();
//    }
//
//    @Then("the user should see \"Alcatraz Island\" in Favorites list")
//    public void theUserShouldSeeInFavoritesList() {
//        WebElement favoritesList = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("favorites-list")));
//        assertTrue(favoritesList.getText().contains("Alcatraz Island"), "Alcatraz Island should be visible in the favorites list but was not found.");
//    }
//
//
//



}