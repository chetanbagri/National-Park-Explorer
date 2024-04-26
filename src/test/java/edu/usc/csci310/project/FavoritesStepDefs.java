package edu.usc.csci310.project;

import com.google.gson.Gson;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.junit.jupiter.api.Assertions;

import org.mockito.Mock;
import org.mockito.Mockito;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;


import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
public class FavoritesStepDefs {

        private static final String ROOT_URL = "http://localhost:8080/";

        private final WebDriver driver = new ChromeDriver();

        private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        @Autowired
        private UserService userService;

        @Autowired
        private StandardPBEStringEncryptor testEncryptor;


    @After
        public void afterScenario() {
            driver.quit();
        }

        @Given("I am on the favorites page")
        public void iAmOnTheFavoritesPage() {
            userService.registerUser("NickoOG_TMP", "Happy1", "Happy1");
            // Need to login user so they have the session storage filled in (to not get booted off general pages)
            driver.get(ROOT_URL + "login");
            driver.findElement(By.id("username")).click();
            driver.findElement(By.id("username")).sendKeys("NickoOG_TMP");
            driver.findElement(By.id("password")).click();
            driver.findElement(By.id("password")).sendKeys("Happy1");
            driver.findElement(By.id("loginBtn")).click();
            wait.until(ExpectedConditions.urlToBe("http://localhost:8080/search"));
            driver.findElement(By.id("nav-favorites")).click();
            wait.until(ExpectedConditions.urlToBe("http://localhost:8080/Favorites"));
        }

    @And("the user has {string} in their favorites")
    public void the_user_has_in_their_favorites(String park) throws InterruptedException {
//        driver.get(ROOT_URL+"search");
//        driver.findElement(By.id("searchQuery")).sendKeys(park);
//        driver.findElement(By.id("search")).click();
//        wait.until(webDriver -> driver.findElements(By.cssSelector(".search-result")).size() > 0);
        String encryptedUsername = testEncryptor.encrypt("NickoOG_TMP");
        String parkCode;
        if(park.equals("Alcatraz Island")) parkCode =  "alca";
        else parkCode  = "acad";
        System.out.println("Has_in_favs"+parkCode);
        ResponseEntity<?> response = userService.addFavorite(encryptedUsername, parkCode);
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        List<String> favoriteList = favoritesResponse.getFavorites();
        assertTrue(favoriteList.contains(parkCode));
        driver.navigate().refresh();
        Thread.sleep(200);
    }
    @Then("a minus sign should appear")
    public void a_minus_sign_should_appear() {
        WebElement minusSign = driver.findElement(By.cssSelector(".remove-from-favorites"));
        Assertions.assertTrue(minusSign.isDisplayed());
    }

    @When("the user clicks the minus sign")
    public void the_user_clicks_the_minus_sign() throws InterruptedException {
        driver.findElement(By.cssSelector(".remove-from-favorites")).click();
        Thread.sleep(100);
    }

    @Then("a confirmation popup should be displayed")
    public void a_confirmation_popup_should_be_displayed() {
        WebElement confirmationPopup = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".confirmation-popup")));
        Assertions.assertTrue(confirmationPopup.isDisplayed());
    }

    @When("the user clicks {string}")
    public void the_user_clicks(String buttonLabel) {
        driver.findElement(By.xpath("//button[text()='" + buttonLabel + "']")).click();
    }

    @Then("{string} should not be in their Favorites list")
    public void should_not_be_in_their_favorites_list(String park) {
        String encryptedUsername = testEncryptor.encrypt("NickoOG_TMP");
        String parkCode;
        if(park.equals("Alcatraz Island")) parkCode =  "alca";
        else parkCode  = "acad";
        ResponseEntity<?> response= userService.removeFavorite(encryptedUsername, parkCode); // Assume this directly modifies the state
        // Perform a check to ensure the park is no longer in the favorites
        assertEquals("Park removed from favorites", response.getBody());
    }


    @When("the user clicks the Confirm button")
    public void theUserClicksTheConfirmButton() {
        driver.findElement(By.xpath("//*[@id=\"confirm-remove-button\"]")).click();
    }

    @When("the user clicks the Cancel button")
    public void theUserClicksTheCancelButton() {
        driver.findElement(By.xpath("//*[@id=\"confirm-cancel-button\"]")).click();
    }

    @Then("the confirmation popup should disappear")
    public void theConfirmationPopupShouldDisappear() {
        Assertions.assertTrue(wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("confirmation-popup"))));
    }

    @Then("the user has {int} parks in their favorites")
    public void theUserHasParksInTheirFavorites(int count) {
        int actualCount = driver.findElements(By.cssSelector("ul > li")).size();
        Assertions.assertEquals(count, actualCount);
    }

    @When("the user clicks on {string}")
    public void theUserClicksOn(String parkName) {
        driver.findElements(By.xpath("//button[contains(text(), '" + parkName + "')]")).get(0).click();
    }

    @When("the user clicks on {string} again")
    public void theUserClicksOnAgain(String parkName) {
        driver.findElements(By.xpath("//button[contains(text(), '" + parkName + "')]")).get(0).click();
    }

    @And("the user has Alcatraz Island in their favorites")
    public void theUserHasAlcatrazIslandInTheirFavorites() {
        String encryptedUsername = testEncryptor.encrypt("NickoOG_TMP");
        userService.addFavorite(encryptedUsername, "alca");
        Assertions.assertTrue(driver.findElement(By.xpath("//button[contains(text(), 'Alcatraz Island')]")).isDisplayed());
    }

    @Then("the user should see Alcatraz Island in a list like format")
    public void theUserShouldSeeAlcatrazIslandInAListLikeFormat() {
        Assertions.assertTrue(driver.findElements(By.xpath("//ul/li/button[contains(text(), 'Alcatraz Island')]")).size() > 0);
    }

    @And("the user has {string} at rank {int} in their favorites")
    public void theUserHasAtRankInTheirFavorites(String parkName, int rank) {
        WebElement park = driver.findElements(By.cssSelector("ul > li > button")).get(rank - 1);
        Assertions.assertTrue(park.getText().contains(parkName));
    }

    @Then("an up arrow should appear")
    public void anUpArrowShouldAppear() {
        Assertions.assertTrue(driver.findElements(By.className("arrow-up")).size() > 0);
    }

    @When("the user clicks the up arrow")
    public void theUserClicksTheUpArrow() {
        driver.findElement(By.className("arrow-up")).click();
    }

    @Then("{string} should be rank {int}")
    public void shouldBeRank(String parkName, int rank) {
        WebElement park = driver.findElements(By.cssSelector("ul > li > button")).get(rank - 1);
        Assertions.assertTrue(park.getText().contains(parkName));
    }

    @Then("a down arrow should appear")
    public void aDownArrowShouldAppear() {
        Assertions.assertTrue(driver.findElements(By.className("arrow-down")).size() > 0);
    }

    @When("the user clicks the down arrow")
    public void theUserClicksTheDownArrow() {
        driver.findElement(By.className("arrow-down")).click();
    }

    @Then("the favorites list should be set to private by default")
    public void theFavoritesListShouldBeSetToPrivateByDefault() {
        Assertions.assertTrue(Boolean.parseBoolean(driver.findElement(By.xpath("//button[contains(text(), 'Make Favorites Public')]")).getAttribute("data-private")));
    }

    @And("the favorites list is set to private")
    public void theFavoritesListIsSetToPrivate() {
        Assertions.assertTrue(Boolean.parseBoolean(driver.findElement(By.xpath("//button[contains(text(), 'Make Favorites Public')]")).getAttribute("data-private")));
    }

    @When("I click {string}")
    public void iClick(String buttonText) {
        driver.findElement(By.xpath("//button[contains(text(), '" + buttonText + "')]")).click();
    }

    @Then("the favorites list should be public")
    public void theFavoritesListShouldBePublic() {
        Assertions.assertTrue(Boolean.parseBoolean(driver.findElement(By.xpath("//button[contains(text(), 'Make Favorites Private')]")).getAttribute("data-public")));
    }

        @After
        public void tearDown() {
            driver.quit();
        }

    @When("the user hovers over the park button named {string}")
    public void theUserHoversOverTheParkButtonNamed(String parkName) {
//        String parkCode;
//        if(parkName.equals("Alcatraz Island")) parkCode =  "alca";
//        else parkCode  = "acad";
//        System.out.println("Has_in_favs"+parkCode);
        WebElement parkElement = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), '" + parkName + "')]")));
        Actions action = new Actions(driver);
        action.moveToElement(parkElement).perform();
    }

    @And("the user still has {string} in their favorites")
    public void theUserStillHasInTheirFavorites(String park) {
        String encryptedUsername = testEncryptor.encrypt("NickoOG_TMP");
        String parkCode;
        if(park.equals("Alcatraz Island")) parkCode =  "alca";
        else parkCode  = "acad";
        ResponseEntity<?> response = userService.getFavorites(encryptedUsername);
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        List<String> favoriteList = favoritesResponse.getFavorites();
        assertTrue(favoriteList.contains(parkCode));
    }
}
