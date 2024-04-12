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
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

    @After
    public void afterScenario() {
        driver.quit();
    }

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

    @And("I have {string} registered")
    public void iHaveRegistered(String arg0) {
        String password = "Happy1";
        userService.registerUser(arg0, password, password);
    }

    @When("I enter {string} into element with id {string}")
    public void iEnterIntoElementWithId(String arg0, String arg1) {
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
}
