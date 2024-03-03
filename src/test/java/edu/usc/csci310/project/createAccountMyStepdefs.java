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

public class createAccountMyStepdefs {

    private static final String ROOT_URL = "http://localhost:8080/CreatAccountPage";
    private final WebDriver driver = new ChromeDriver();
    private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    @After
    public void After(){
        driver.quit();
    }

    @Given("I am on the create account page")
    public void iAmOnTheCreateAccountPage() { driver.get(ROOT_URL); }

    @When("I enter the username {string}")
    public void iEnterTheUsernameOnLoginPage(String arg0) {
        driver.findElement(By.id("username")).sendKeys(arg0);
    }

    @And("I enter the password {string}")
    public void iEnterThePassword(String arg0) {
        driver.findElement(By.id("password")).sendKeys(arg0);
    }

    @And("I press the Create Account button")
    public void iPressTheCreateAccountButton() {
        driver.findElement(By.id("createaccountBtn")).click();
    }

    @Then("I should get a {string} message")
    public void iShouldGetAMessage(String arg0) {
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("response"), arg0));
        assertTrue(driver.getPageSource().contains(arg0));
    }
}
