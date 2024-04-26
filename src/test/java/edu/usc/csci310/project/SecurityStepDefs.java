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
public class SecurityStepDefs {

    @Autowired
    private UserService userService;
    private final WebDriver driver;
    public SecurityStepDefs() {
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        this.driver = new ChromeDriver(options);
    }
    @Given("I am logged in and on the search page")
    public void iAmLoggedInAndOnTheSearchPage() {
        userService.registerUser("Bob", "Happy1", "Happy1");
        driver.get("https://localhost:8080/login");
        WebElement usernameInput = driver.findElement(By.id("username"));
        WebElement passwordInput = driver.findElement(By.id("password"));
        usernameInput.click();
        usernameInput.sendKeys("Bob");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        passwordInput.click();
        passwordInput.clear();
        wait.until((WebDriver d) -> passwordInput.getAttribute("value").isEmpty());
        passwordInput.sendKeys("Happy1");
        WebElement loginButton = driver.findElement(By.id("loginBtn"));
        loginButton.click();
    }

    @And("I am inactive for sixty one seconds")
    public void iAmInactiveForSeconds() throws InterruptedException {
        Thread.sleep(62000);
    }

    @Then("I am logged out and redirected to the login page")
    public void iAmLoggedOutAndRedirectedToTheLoginPage() {
        String currentUrl = driver.getCurrentUrl();
        assertEquals("https://localhost:8080/login", currentUrl);
    }

    @Given("I try to access {string} page using http")
    public void iTryToAccessPageUsingHttp(String arg0) {
        String baseUrl = "http://localhost:8080/";
        String url = baseUrl+arg0;
        driver.get(url);
    }

    @Given("I start on the {string} page")
    public void iStartOnTheLoginPage(String arg0) {
        String baseUrl = "https://localhost:8080/";
        String url = baseUrl+arg0;
        driver.get(url);
    }

    @And("I try to access the {string} page without logging in")
    public void iTryToAccessTheSearchPageWithoutLoggingIn(String arg0) {
        String baseUrl = "https://localhost:8080/";
        String url = baseUrl+arg0;
        driver.get(url);
    }

    @Then("I should be directed to the {string} page")
    public void iShouldBeDirectedToTheLoginPage(String arg0) {
        String baseUrl = "https://localhost:8080/";
        String url = baseUrl+arg0;
        driver.get(url);
    }

    @After
    public void tearDown() {
        driver.quit();
    }

    @Then("I should get a message:")
    public void iShouldGetAMessage(String arg0) {
        WebElement message = driver.findElement(By.xpath("/html/body/pre"));
        String text = message.getText();
        assertEquals(arg0, text);
    }
}
