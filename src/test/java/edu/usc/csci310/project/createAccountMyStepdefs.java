package edu.usc.csci310.project;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class createAccountMyStepdefs {

    private static final String ROOT_URL = "http://localhost:8080";
    private final WebDriver driver = new ChromeDriver();

    @Given("I am on the create account page")
    public void iAmOnTheCreateAccountPage() {
        driver.get(ROOT_URL);
    }

    @When("I enter the username {string}")
    public void iEnterTheUsername(String username) {
        WebElement usernameInput = driver.findElement(By.cssSelector("input[type='text']"));
        usernameInput.sendKeys(username);
    }

    @And("I enter the email {string}")
    public void iEnterTheEmail(String email) {
        WebElement emailInput = driver.findElement(By.cssSelector("input[type='email']"));
        emailInput.sendKeys(email);
    }

    @And("I enter the password {string}")
    public void iEnterThePassword(String password) {
        WebElement passwordInput = driver.findElement(By.cssSelector("input[type='password']"));
        passwordInput.sendKeys(password);
    }

    @And("I press the Create Account button")
    public void iPressTheCreateAccountButton() {
        WebElement createAccountButton = driver.findElement(By.xpath("//button[contains(text(), 'Create Account')]"));
        createAccountButton.click();
    }

    @Then("I should get a {string} message")
    public void iShouldGetAMessage(String message) throws InterruptedException {
        Thread.sleep(10000);
        assertTrue(driver.getPageSource().contains(message));
    }

    @And("I confirm the password {string}")
    public void iConfirmThePassword(String confirmPassword) {
        WebElement confirmPasswordInput = driver.findElement(By.id("confirmPassword"));
        confirmPasswordInput.sendKeys(confirmPassword);
    }
}
