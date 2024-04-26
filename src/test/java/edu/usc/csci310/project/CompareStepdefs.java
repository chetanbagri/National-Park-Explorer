package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import jakarta.transaction.Transactional;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CompareStepdefs {
    private static final String ROOT_URL = "http://localhost:8080/"; // Adjust this to your search page URL

    private final WebDriver driver = new ChromeDriver();

    private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

    @Autowired
    private UserService userService;

    public void waitForTextToAppearInPageSource(WebDriver driver, String textToAppear, int timeoutInSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
        wait.until((WebDriver d) -> d.getPageSource().contains(textToAppear));
    }

    private List<String> usernames = new ArrayList<>();

    @After
    public void afterScenario() {
        for(String u : usernames){
            userService.removeUser(u);
        }
        usernames.clear();
        driver.quit();
    }

    @Given("I am on the Compare page")
    public void iAmOnTheComparePage() {
        String username = "NickoOG_CTMP";
        String password = "Happy1";
        usernames.add(username);
        userService.registerUser(username, password, password);
        // Need to login user so they have the session storage filled in (to not get booted off general pages)
        driver.get(ROOT_URL + "login");
        driver.findElement(By.id("username")).click();
        driver.findElement(By.id("username")).sendKeys(username);
        driver.findElement(By.id("password")).click();
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.id("loginBtn")).click();
        wait.until(ExpectedConditions.urlToBe("http://localhost:8080/search"));
        driver.findElement(By.id("nav-compare")).click();
    }

    @And("I have {string} registered")
    public void iHaveRegistered(String arg0) {
        String password = "Happy1";
        usernames.add(arg0);
        userService.registerUser(arg0, password, password);
    }

    @When("I enter {string} into element with id {string}")
    public void iEnterIntoElementWithId(String arg0, String arg1) {
        driver.findElement(By.id(arg1)).clear();
        driver.findElement(By.id(arg1)).sendKeys(arg0);
    }

    @And("I click on the element with id {string}")
    public void iClickOnTheElementWithId(String arg0) {
        driver.findElement(By.id(arg0)).click();
    }

    @Then("I should see {string}")
    public void iShouldSee(String arg0) {
        waitForTextToAppearInPageSource(driver, arg0, 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @Transactional // Note: Transactional is necessary to avoid org.hibernate.LazyInitializationException
    @And("I have park with id {string} favorited")
    public void iHaveParkWithIdFavorited(String arg0) {
        userService.addFavorite("NickoOG_CTMP", arg0);
    }

    @Transactional // Note: Transactional is necessary to avoid org.hibernate.LazyInitializationException
    @And("{string} has park with id {string} favorited")
    public void hasParkWithIdFavorited(String arg0, String arg1) {
        userService.addFavorite(arg0, arg1);
    }

    @And("I click on text {string} with id {string}")
    public void iClickOnTextWithId(String arg0, String arg1) {
        waitForTextToAppearInPageSource(driver, arg0, 5); // Adjust the timeout as needed
        driver.findElement(By.id(arg1)).click();
    }

    @And("I click on the first park")
    public void iClickOnTheFirstPark() {
        List<WebElement> searchResults = driver.findElements(By.cssSelector(".search-result-button"));
        if (!searchResults.isEmpty()) {
            searchResults.get(0).click(); // Clicks the first result
        } else {
            fail("No search results found to click.");
        }
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".detailsBox"))); // Adjust the selector to the details box
    }

    @Then("I should see details about the park")
    public void iShouldSeeDetailsAboutThePark() {
        // Location of park is shown
        WebElement locationElement = driver.findElement(By.cssSelector(".park-location")); // Adjust the selector
        assertNotNull(locationElement, "Location element not found.");
        assertFalse(locationElement.getText().isEmpty(), "Park location is missing or empty.");

        // Clickable park URL shown
        WebElement parkUrlElement = driver.findElement(By.cssSelector(".park-url")); // Adjust the selector
        assertNotNull(parkUrlElement, "Park URL element not found.");
        assertTrue(parkUrlElement.getAttribute("href").startsWith("http"), "Park URL is not valid.");

        // Entrance fee shown
        WebElement entranceFeeElement = driver.findElement(By.cssSelector(".park-entrance-fee")); // Adjust the selector
        assertNotNull(entranceFeeElement, "Entrance fee element not found.");
        assertNotEquals("", entranceFeeElement.getText(), "Entrance fee is missing or not formatted correctly.");

        // Shows representative picture of park
        WebElement pictureElement = driver.findElement(By.cssSelector(".park-picture")); // Adjust the selector
        assertNotNull(pictureElement, "Park picture element not found.");
        assertTrue(pictureElement.getAttribute("src").length() > 0, "Park picture URL is missing or empty.");

        // Short description of park
        WebElement descriptionElement = driver.findElement(By.cssSelector(".park-description")); // Adjust the selector
        assertNotNull(descriptionElement, "Description element not found.");
        assertTrue(descriptionElement.getText().length() > 0, "Park description is missing or empty.");

        // Shows amenities
        List<WebElement> amenitiesList = driver.findElements(By.cssSelector(".park-amenities")); // Adjust the selector
        assertFalse(amenitiesList.isEmpty(), "Amenities list is missing or empty.");

        // Shows activities
        List<WebElement> activitiesList = driver.findElements(By.cssSelector(".park-activities")); // Adjust the selector
        assertFalse(activitiesList.isEmpty(), "Activities list is missing or empty.");
    }

    @And("{string} has a {string} park list")
    public void hasAParkList(String arg0, String arg1) {
//        if(Objects.equals(arg1, "private") && userService.isFavPrivate() == true) return;
//        else if(Objects.equals(arg1, "private") && userService.isFavPrivate() == false) userService.toggleFavoritesPrivacy(arg0);
//        else if(Objects.equals(arg1, "public") && userService.isFavPrivate() == true) return;
//        else userService.toggleFavoritesPrivacy(arg0); // set arg0's TRACKER to arg0, or a boolean
    }


    // Suggest Step Defs
    @Then("the best park based on common favorites should be displayed")
    public void theBestParkBasedOnCommonFavoritesShouldBeDisplayed() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("suggestedPark")));
        assertTrue(driver.findElement(By.id("suggestedPark")).isDisplayed());
    }

    @And("no common park is found in the favorite lists")
    public void noCommonParkIsFoundInTheFavoriteLists() {
    }

    @Then("the most common park should be displayed")
    public void theMostCommonParkShouldBeDisplayed() {
    }

    @Then("a randomly selected park should be displayed")
    public void aRandomlySelectedParkShouldBeDisplayed() {
    }

    @Given("a park has been suggested")
    public void aParkHasBeenSuggested() {
    }

    @When("I click on the park name")
    public void iClickOnTheParkName() {
        driver.findElement(By.className("park-name")).click();
    }

    @Then("the details window of the park is displayed inline")
    public void theDetailsWindowOfTheParkIsDisplayedInline() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("parkDetails")));
        assertTrue(driver.findElement(By.id("parkDetails")).isDisplayed());
    }

    @When("I click the display, a park detail window should appear")
    public void iClickTheDisplayAParkDetailWindowShouldAppear() {
        driver.findElement(By.id("suggestedPark")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("parkDetails")));
        assertTrue(driver.findElement(By.id("parkDetails")).isDisplayed());
    }

    @And("I should see {int} photos")
    public void iShouldSeePhotos(int arg0) {
        assertEquals(driver.findElements(By.className("suggestedImage")).size(), arg0);
    }

    @When("I click on the suggested park")
    public void iClickOnTheSuggestedPark() {
        List<WebElement> searchResults = driver.findElements(By.cssSelector(".suggestedParkBox"));
        if (!searchResults.isEmpty()) {
            searchResults.get(0).click(); // Clicks the first result
        } else {
            fail("No suggested result found to click.");
        }
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".detailsBox"))); // Adjust the selector to the details box
    }
}
