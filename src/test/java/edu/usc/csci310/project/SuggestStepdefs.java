package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class SuggestStepdefs {
    private static final String ROOT_URL = "http://localhost:8080/";

    private final WebDriver driver = new ChromeDriver();

    private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    public void waitForTextToAppearInPageSource(WebDriver driver, String textToAppear, int timeoutInSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
        wait.until((WebDriver d) -> d.getPageSource().contains(textToAppear));
    }
    @Autowired
    private UserService userService;
    @Given("I am on the Compare page")
    public void iAmOnTheComparePage() {
        String username = "NickoOG_TMP";
        String password = "Happy1";
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
    @After
    public void afterScenario() {
        driver.quit();
    }
    @And("I have selected friends {string}")
    public void iHaveSelectedFriends(String friendsList) {
        String[] friends = friendsList.split(", ");
        for (String friend : friends) {
            driver.findElement(By.id("usernameQuery")).sendKeys(friend);
            driver.findElement(By.id("addUserBtn")).click();
        }
    }

    @When("I click the {string} button")
    public void iClickTheButton(String buttonId) {
        driver.findElement(By.id(buttonId)).click();
    }

    @Then("the best park based on common favorites should be displayed")
    public void theBestParkBasedOnCommonFavoritesShouldBeDisplayed() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("suggestedPark")));
        assertTrue(driver.findElement(By.id("suggestedPark")).isDisplayed());
    }

    @And("three park photos, park name, and location should be displayed")
    public void threeParkPhotosParkNameAndLocationShouldBeDisplayed() {
        assertTrue(driver.findElements(By.className("park-photo")).size() == 3);
        assertTrue(driver.findElement(By.className("park-name")).isDisplayed());
        assertTrue(driver.findElement(By.className("park-location")).isDisplayed());
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
}
