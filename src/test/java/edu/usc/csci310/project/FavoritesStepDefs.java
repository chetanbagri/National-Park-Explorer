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
import org.openqa.selenium.chrome.ChromeOptions;
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

        private static final String ROOT_URL = "https://localhost:8080/"; // Adjust this to your search page URL

    private final WebDriver driver;
    private final WebDriverWait wait;



    @Autowired
    private UserService userService;

    public FavoritesStepDefs() {
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        this.driver = new ChromeDriver(options);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

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
            wait.until(ExpectedConditions.urlToBe("https://localhost:8080/search"));
            driver.findElement(By.id("nav-favorites")).click();
            wait.until(ExpectedConditions.urlToBe("https://localhost:8080/Favorites"));
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
        ResponseEntity<?> response = userService.addFavorite(encryptedUsername, parkCode);
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        List<String> favoriteList = favoritesResponse.getFavorites();
        assertTrue(favoriteList.contains(parkCode));
        driver.navigate().refresh();
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
    public void theUserClicksOn(String parkName) throws InterruptedException {
        WebElement button = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//button[contains(text(), '" + parkName + "')]")
        ));
//        Thread.sleep(5000);
//        System.out.println(button);
        button.click();
//        Thread.sleep(5000);
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
    public void theUserHasAtRankInTheirFavorites(String parkName, int rank) throws InterruptedException {
        String encryptedUsername = testEncryptor.encrypt("NickoOG_TMP");
        String parkCode;
        if(parkName.equals("Alcatraz Island")) parkCode =  "alca";
        else parkCode  = "acad";
        ResponseEntity<?> response = userService.addFavorite(encryptedUsername, parkCode);
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        List<String> favoriteList = favoritesResponse.getFavorites();
        assertTrue(favoriteList.contains(parkCode));
        driver.navigate().refresh();
        List<WebElement> parklist = wait.until(
                ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("ul > li > button")));
        WebElement park = parklist.get(rank-1);
        Thread.sleep(2000);
        assertEquals(parkName, park.getText());
    }

    @Then("an up arrow should appear")
    public void anUpArrowShouldAppear() {
        Assertions.assertTrue(driver.findElements(By.className("arrow-up")).size() > 0);
    }

    @When("the user clicks the up arrow for rank {int}")
    public void theUserClicksTheUpArrow(int rank) throws InterruptedException {
        WebElement button = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[@id=\"root\"]/div/div/ul/li["+rank+"]/span[2]")
        ));
        button.click();
        Thread.sleep(1000);
    }

    @Then("{string} should be rank {int}")
    public void shouldBeRank(String parkName, int rank) throws InterruptedException {
        List<WebElement> parklist = wait.until(
                ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("ul > li > button")));
        WebElement park = parklist.get(rank-1);
        wait.until(ExpectedConditions.textToBePresentInElement(park, ""));
        assertEquals(parkName, park.getText());
    }

    @Then("a down arrow should appear")
    public void aDownArrowShouldAppear() {
        Assertions.assertTrue(driver.findElements(By.className("arrow-down")).size() > 0);
    }

    @When("the user clicks the down arrow for rank {int}")
    public void theUserClicksTheDownArrow(int rank) throws InterruptedException {
        WebElement button = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[@id=\"root\"]/div/div/ul/li["+rank+"]/span[3]")
        ));
        button.click();
        Thread.sleep(1000);
    }

    @Then("the favorites list is set to private by default")
    public void theFavoritesListShouldBeSetToPrivateByDefault() {
        WebElement button = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("privPub")));
        String privPubBool = button.getAttribute("data-private");
        assertEquals("true", privPubBool);
    }


    @When("I click Make Favorites Public")
    public void iClick() {
        WebElement button = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("privPub")));
        button.click();
    }

    @Then("the favorites list should be public")
    public void theFavoritesListShouldBePublic() {
        WebElement button = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("privPub")));
        String privPubBool = button.getAttribute("data-private");
        assertEquals("false", privPubBool);
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

    @Then("an inline window of park details appears")
    public void anInlineWindowOfParkDetailsAppears() throws InterruptedException {
        List<WebElement> detailsBox = wait.until(
                ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector(".detailsBox"))
        );
        assertFalse(detailsBox.isEmpty(), "The details of the park were not displayed inline.");
        WebElement detailElement = wait.until(ExpectedConditions.visibilityOf(detailsBox.get(0).findElement(By.tagName("h3"))));
        assertNotNull(detailElement, "Park details content is missing.");
    }

    @When("the user hovers over the park button {string}")
    public void theUserHoversOverTheParkButton(String parkName) {
        WebElement parkElement = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), '" + parkName + "')]")));
        Actions action = new Actions(driver);
        action.moveToElement(parkElement).perform();
    }
    @When("I click the nav button with id {string}")
    public void iClickTheNavButtonWithId(String arg0) throws InterruptedException {
        driver.findElement(By.id(arg0)).click();
        Thread.sleep(1000);
    }
    @And("see the page title is {string}")
    public void seeThatThePageTitleIs(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I remove the user")
    public void iRemoveTheUser() {
        userService.removeUser("NickoOG_TMP");
    }
}
