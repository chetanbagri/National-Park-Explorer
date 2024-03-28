package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SearchParksStepDefs {
    private static final String ROOT_URL = "http://localhost:8080/search"; // Adjust this to your search page URL

    private final WebDriver driver = new ChromeDriver();

    private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

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
    @Then("the search results for \"elevator\" should be displayed")
    public void theSearchResultsForAmenityShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Ellis Island Part of Statue of Liberty National Monument", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("elevator"));
    }
    @Then("the search results for \"CA\" should be displayed")
    public void theSearchResultsForStateShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Alcatraz Island", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("CA"));
    }
    @Then("the search results for \"stargazing\" should be displayed")
    public void theSearchResultsFoActivityrShouldBeDisplayed() {
        waitForTextToAppearInPageSource(driver, "Abraham Lincoln Birthplace National Historical Park", 5); // Adjust the timeout as needed
        assertTrue(driver.getPageSource().contains("stargazing"));
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

    @After
    public void tearDown() {
        driver.quit();
    }

}