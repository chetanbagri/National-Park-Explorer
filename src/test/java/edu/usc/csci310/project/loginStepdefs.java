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

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class loginStepdefs {

    private static final String ROOT_URL = "http://localhost:8080/login";

    private final WebDriver driver = new ChromeDriver();

    private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

    @After
    public void After(){
        driver.quit();
    }

    @Given("I am on the login page")
    public void iAmOnTheLoginPage() { driver.get(ROOT_URL); }

    @When("I enter the username {string} on login page")
    public void iEnterTheUsernameOnLoginPage(String arg0) {
        driver.findElement(By.id("username")).sendKeys(arg0);
    }

    @And("I enter the password {string} on login page")
    public void iEnterThePasswordOnLoginPage(String arg0) {
        driver.findElement(By.id("password")).sendKeys(arg0);
    }

    @And("I press the Login button")
    public void iPressTheLoginButton() {
        // wait.until(ExpectedConditions.presenceOfElementLocated(By.id("loginBtn")));
        driver.findElement(By.id("loginBtn")).click();
    }

    @Then("I should see {string}")
    public void iShouldGetAMessageDisplayed(String arg0) {
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("response"), arg0));
        assertTrue(driver.getPageSource().contains(arg0));
    }

//    @And("I have tried unsuccessfully to log in on the previous attempt")
//    public void iHaveTriedUnsuccessfullyToLogInOnThePreviousAttempt() {
//        driver.findElement(By.id("username")).sendKeys("Tommy");
//        driver.findElement(By.id("password")).sendKeys("Trojan");
//        driver.findElement(By.id("login-submit")).click();
//        driver.findElement(By.id("username")).clear();
//        driver.findElement(By.id("password")).clear();
//    }
//
//    @And("I have tried unsuccessfully to log in the two previous attempts")
//    public void iHaveTriedUnsuccessfullyToLogInTheTwoPreviousAttempts() {
//
//    }
//
//    @And("I have tried unsuccessfully to log in the three previous attempts")
//    public void iHaveTriedUnsuccessfullyToLogInTheThreePreviousAttempts() {
//
//    }

//    @Then("I should be redirected to the Account Blocked page")
//    public void iShouldBeRedirectedToTheAccountBlockedPage() {
//        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("response"), "Too many login attempts."));
//        assertTrue(driver.getPageSource().contains("Too many login attempts."));
//    }
}
