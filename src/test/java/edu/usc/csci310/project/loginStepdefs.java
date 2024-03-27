package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class loginStepdefs {
    static WebDriver driver = new ChromeDriver();

   @Autowired
    private UserService userService;

    private static boolean initialized = false;
    private static boolean finalized = false;


    @Before
    public void setup(){
        if(!initialized) {
            ResponseEntity<?> response = userService.registerUser("Alice", "Happy1", "Happy1");
            initialized  = true;
        }

    }


    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        driver.get("http://localhost:8080/login");
    }

    @When("I enter the username {string} on login page")
    public void iEnterTheUsernameOnLoginPage(String username) {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys(username);
    }

    @And("I enter the password {string} on login page")
    public void iEnterThePasswordOnLoginPage(String password) {
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys(password);
    }

    @And("I press the Login button")
    public void iPressTheLoginButton() {
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
    }

    @Then("I should be redirected to the landing page")
    public void iShouldBeRedirectedToTheLandingPage() {
        assertEquals("http://localhost:8080/landing", driver.getCurrentUrl());
    }

    @Given("I have failed twice to log within the last 60 seconds")
    public void iHaveFailedTwiceToLogWithinTheLast60Seconds() {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys("Alice");
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("wrongPassword");
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
        loginButton.click();
    }

    @Then("I should get a login {string} message")
    public void iShouldGetAMessage(String expectedMessage) {
        WebElement messageElement = driver.findElement(By.id("error"));
        assertEquals(expectedMessage, messageElement.getText());
        if(expectedMessage.equals("Incorrect password. One more and you may get locked out"))
            finalized = true;
    }

    @Given("I have gotten locked out")
    public void iHaveGottenLockedOut() {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys("Alice");
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("wrongPassword");
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
        loginButton.click();
        loginButton.click();
    }

    @And("I wait 30 seconds")
    public void iWait30Seconds() throws InterruptedException {
        Thread.sleep(30000);
    }

    @Given("I have failed my second login in the last 61 seconds")
    public void iHaveFailedMySecondLoginInTheLast70Seconds() throws InterruptedException {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys("Alice");
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("wrongPassword");
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
        loginButton.click();
        Thread.sleep(61000);
    }

//    @After
//    public void tearDown() {
//        if(finalized) {
//            ResponseEntity<?> response = userService.removeUser("Alice");
//        }
//        driver.quit();
//    }
}
