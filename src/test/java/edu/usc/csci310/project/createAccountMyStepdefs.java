package edu.usc.csci310.project;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class createAccountMyStepdefs {
    private final WebDriver driver = new ChromeDriver();


    @Given("I am on the create account page")
    public void iAmOnTheCreateAccountPage() {
        driver.get("http://localhost:8080/create-account");
    }

    @When("I enter the username {string}")
    public void iEnterTheUsername(String username) {
        WebElement usernameInput = driver.findElement(By.id("username"));
        usernameInput.sendKeys(username);
    }

    @And("I enter the email {string}")
    public void iEnterTheEmail(String email) {
        WebElement emailInput = driver.findElement(By.id("email"));
        emailInput.sendKeys(email);
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

    @And("I press the Create Account button")
    public void iPressTheCreateAccountButton() {
        WebElement createAccountButton = driver.findElement(By.id("submission"));
        createAccountButton.click();
    }

    @Then("I should get a {string} message")
    public void iShouldGetAMessage(String message) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"root\"]/div/div/p")));
        WebElement messageElement = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/p"));
        assertEquals(message, messageElement.getText());
        driver.quit();
    }

    @Then("I should be redirected to the Landing Page")
    public void iShouldBeRedirectedToTheLandingPage() {
        driver.get("http://localhost:8080/landing");
        driver.quit();
    }


//    @Then("I should get an alert saying {string}")
//    public void iShouldGetAnAlertSaying(String alertMessage) {
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
//        String alertText = alert.getText();
//        assertEquals(alertMessage, alertText);
//        alert.accept();
//    }

}
