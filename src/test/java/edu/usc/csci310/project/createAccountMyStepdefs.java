package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.Duration;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class createAccountMyStepdefs {
    private final WebDriver driver = new ChromeDriver();

    @Autowired
    private UserService userService;

    @Given("I am on the create account page")
    public void iAmOnTheCreateAccountPage() {
        driver.get("http://localhost:8080/create-account");
    }

    @Given("I start at the login page")
    public void iStartAtTheLoginPage() {
        driver.get("http://localhost:8080/login");
    }

    @When("I enter the username {string}")
    public void iEnterTheUsername(String username) {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys(username);
    }

    @And("I enter the password {string}")
    public void iEnterThePassword(String password) {
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys(password);
    }

    @And("I confirm the password {string}")
    public void iConfirmThePassword(String confirmPassword) {
        WebElement confirmPasswordInput = driver.findElement(By.id("confirmPassword"));
        confirmPasswordInput.sendKeys(confirmPassword);
    }

    @And("I press the Create User button")
    public void iPressTheCreateUserButton() {
        WebElement createAccountButton = driver.findElement(By.id("submission"));
        createAccountButton.click();
    }

    @Then("I should get a {string} message")
    public void iShouldGetAMessage(String message) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("error")));
        WebElement messageElement = driver.findElement(By.id("error"));
        assertEquals(message, messageElement.getText());
    }

    @Then("I should be redirected to the Login Page")
    public void iShouldBeRedirectedToTheLoginPage() {
        driver.get("http://localhost:8080/login");
    }


    @And("I press the Cancel button")
    public void iPressTheCancelButton() {
        WebElement createAccountButton = driver.findElement(By.id("cancel"));
        createAccountButton.click();
    }

    @And("I press the Yes button")
    public void iPressTheYesButton() {
        WebElement createAccountButton = driver.findElement(By.id("yes"));
        createAccountButton.click();
    }

    @And("I press the No button")
    public void iPressTheNoButton() {
        WebElement createAccountButton = driver.findElement(By.id("no"));
        createAccountButton.click();
    }

    @Then("I should be on the create account page")
    public void iShouldBeBackOnTheCreateAccountPage() {
        String currentUrl = driver.getCurrentUrl();
        assertEquals("http://localhost:8080/create-account", currentUrl);
        userService.removeUser("Alice");
    }

    @And("I should see the username field filled with the name {string}")
    public void iShouldSeeTheUsernameFieldFilledWithTheName(String arg0) {
        WebElement usernameInput = driver.findElement(By.id("username"));
        String actualUsername = usernameInput.getAttribute("value");

        assertEquals(arg0, actualUsername);
    }

    @After
    public void tearDown() {
        driver.quit();
    }

    @And("I click the create account link")
    public void iClickTheCreateAccountLink() {
        WebElement createAccountLink = driver.findElement(By.id("create-account"));
        createAccountLink.click();
    }
}
