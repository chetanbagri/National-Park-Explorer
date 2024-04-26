package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class NavigationStepdefs {

    private static final String ROOT_URL = "https://localhost:8080/"; // Adjust this to your search page URL

    private WebDriver driver = null;
    public NavigationStepdefs() {
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        this.driver = new ChromeDriver(options);
    }

    private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

    @Autowired
    private UserService userService;

    @After
    public void afterScenario() {
        driver.quit();
    }

    @Given("I am on the {string} page")
    public void iAmOnThePage(String arg0) {
        userService.registerUser("NickoOG_NAVIGATE", "Happy1", "Happy1");
        // Need to login user so they have the session storage filled in (to not get booted off general pages)
        driver.get(ROOT_URL + "login");
        driver.findElement(By.id("username")).click();
        driver.findElement(By.id("username")).sendKeys("NickoOG_NAVIGATE");
        driver.findElement(By.id("password")).click();
        driver.findElement(By.id("password")).sendKeys("Happy1");
        driver.findElement(By.id("loginBtn")).click();
        wait.until(ExpectedConditions.urlToBe("https://localhost:8080/search"));
        driver.findElement(By.id("nav-" + arg0)).click();
    }

    @When("I click on the nav button with id {string}")
    public void iClickOnTheNavButtonWithId(String arg0) {
        driver.findElement(By.id(arg0)).click();
    }

    @Then("I should be redirected to the {string} page")
    public void iShouldBeRedirectedToThePage(String arg0) {
        wait.until(ExpectedConditions.urlToBe("https://localhost:8080/" + arg0));
        assertEquals("https://localhost:8080/" + arg0, driver.getCurrentUrl());
    }

    @And("see that the page title is {string}")
    public void seeThatThePageTitleIs(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
        userService.removeUser("NickoOG_NAVIGATE");
    }



}
