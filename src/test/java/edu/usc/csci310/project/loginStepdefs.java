package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.Duration;

@SpringBootTest
public class loginStepdefs {
    private final WebDriver driver;

   @Autowired
    private UserService userService;

    public loginStepdefs() {
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        this.driver = new ChromeDriver(options);
    }

    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        userService.registerUser("Bob", "Happy1", "Happy1");
        driver.get("https://localhost:8080/login");
    }

    @When("I enter the username {string} on login page")
    public void iEnterTheUsernameOnLoginPage(String username) {
        WebElement usernameInput = driver.findElement(By.id("username"));
        WebElement passwordInput = driver.findElement(By.id("password"));
        usernameInput.click();
        usernameInput.sendKeys(username);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        passwordInput.click();
        passwordInput.clear();
        wait.until((WebDriver d) -> passwordInput.getAttribute("value").isEmpty());
//        System.out.println("Password field value afterhand: " + passwordInput.getAttribute("value")); // Debugging
    }

    @And("I enter the password {string} on login page")
    public void iEnterThePasswordOnLoginPage(String password){
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys(password);
    }

    @And("I press the Login button")
    public void iPressTheLoginButton() {
//        WebElement passwordInput = driver.findElement(By.id("password"));
//        System.out.println("Password field value in LoginBtn: " + passwordInput.getAttribute("value")); // Debugging output
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
    }

    @Then("I should be redirected to the landing page")
    public void iShouldBeRedirectedToTheLandingPage() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe("http://localhost:8080/search"));
        assertEquals("http://localhost:8080/search", driver.getCurrentUrl());
        userService.removeUser("Bob");
    }

    @And("I have failed twice to log within the last 60 seconds")
    public void iHaveFailedTwiceToLogWithinTheLast60Seconds()  throws InterruptedException {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys("Bob");
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("wrongPassword");
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        Thread.sleep(100);
        loginButton.click();
        Thread.sleep(100);
        loginButton.click();
        Thread.sleep(100);
        usernameInput.click();
        usernameInput.clear();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until((WebDriver d) -> usernameInput.getAttribute("value").isEmpty());
//        System.out.println("Username field value after wait: " + usernameInput.getAttribute("value")); // Debugging output
        passwordInput.click();
        passwordInput.clear();
        wait.until((WebDriver d) -> passwordInput.getAttribute("value").isEmpty());
//        System.out.println("Password field value after wait: " + passwordInput.getAttribute("value")); // Debugging output
    }

    @Then("I should get a login {string}")
    public void iShouldGetAMessage(String expectedMessage) throws InterruptedException{
        Thread.sleep(100);
        WebElement messageElement = driver.findElement(By.id("error"));
        assertEquals(expectedMessage, messageElement.getText());
        userService.removeUser("Bob");
    }

    @And("I have gotten locked out")
    public void iHaveGottenLockedOut() throws InterruptedException {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys("Bob");
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("wrongPassword");
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
        Thread.sleep(100);
        loginButton.click();
        Thread.sleep(100);
        loginButton.click();
        Thread.sleep(100);
        usernameInput.click();
        usernameInput.clear();
//        System.out.println("Username field value after clear: " + usernameInput.getAttribute("value")); // Debugging output
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until((WebDriver d) -> usernameInput.getAttribute("value").isEmpty());
//        System.out.println("Username field value after wait: " + usernameInput.getAttribute("value")); // Debugging output
        passwordInput.click();
        passwordInput.clear();
        wait.until((WebDriver d) -> passwordInput.getAttribute("value").isEmpty());
//        System.out.println("Password field value after wait: " + passwordInput.getAttribute("value")); // Debugging output
    }

    @And("I wait 30 seconds")
    public void iWait30Seconds() throws InterruptedException {
        Thread.sleep(30000);
    }

    @And("I have failed my second login in the last 61 seconds")
    public void iHaveFailedMySecondLoginInTheLast70Seconds() throws InterruptedException {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys("Bob");
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("wrongPassword");
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
        Thread.sleep(100);
        loginButton.click();
        Thread.sleep(61000);

        usernameInput.click();
        usernameInput.clear();
//        System.out.println("Username field value after clear: " + usernameInput.getAttribute("value")); // Debugging output
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until((WebDriver d) -> usernameInput.getAttribute("value").isEmpty());
//        System.out.println("Username field value after wait: " + usernameInput.getAttribute("value")); // Debugging output
        passwordInput.click();
        passwordInput.clear();
        wait.until((WebDriver d) -> passwordInput.getAttribute("value").isEmpty());
//        System.out.println("Password field value after wait: " + passwordInput.getAttribute("value")); // Debugging output
    }

    @After
    public void tearDown() {
        driver.quit();
    }
}
