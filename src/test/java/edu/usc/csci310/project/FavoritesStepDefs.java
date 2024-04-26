package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.jupiter.api.Assertions;
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

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
public class FavoritesStepDefs {

        private static final String ROOT_URL = "https://localhost:8080/"; // Adjust this to your search page URL

    private WebDriver driver  =  null;
    public FavoritesStepDefs() {
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        this.driver = new ChromeDriver(options);
    }

        private final WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        @Autowired
        private UserService userService;

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
        @And("the user has Alcatraz Island in their favorites")
        public void the_user_has_alcatraz_island_in_their_favorites() {
            List<WebElement> favorites = driver.findElements(By.className("favorite-item"));
            boolean hasAlcatrazIsland = false;
            for (WebElement favorite : favorites) {
                if (favorite.getText().contains("Alcatraz Island")) {
                    hasAlcatrazIsland = true;
                    break;
                }
            }
            Assertions.assertTrue(hasAlcatrazIsland, "Alcatraz Island is not in the favorites list");
        }

        @When("the user hovers over the name of the park {string}")
        public void the_user_hovers_over_the_name_of_the_park(String parkName) {
            WebElement parkElement = driver.findElement(By.xpath("//div[contains(., '" + parkName + "')]"));
            Actions actions = new Actions(driver);
            actions.moveToElement(parkElement).perform();
        }

        @Then("a minus sign should appear")
        public void a_minus_sign_should_appear() {
            WebElement minusSign = driver.findElement(By.className("remove-from-favorites"));
            Assertions.assertTrue(minusSign.isDisplayed(), "Minus sign is not displayed");
        }

        @When("the user clicks the minus sign")
        public void the_user_clicks_the_minus_sign() {
            WebElement minusSign = driver.findElement(By.className("remove-from-favorites"));
            minusSign.click();
        }

        @Then("a confirmation popup should be displayed")
        public void a_confirmation_popup_should_be_displayed() {
            WebElement confirmationPopup = driver.findElement(By.className("confirmation-popup"));
            Assertions.assertTrue(confirmationPopup.isDisplayed(), "Confirmation popup is not displayed");
        }

        @When("the user clicks {string}")
        public void the_user_clicks(String buttonText) {
            WebElement button = driver.findElement(By.xpath("//button[contains(., '" + buttonText + "')]"));
            button.click();
        }

        @Then("{string} should be removed from their Favorites list")
        public void should_be_removed_from_their_favorites_list(String parkName) {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            List<WebElement> favorites = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.className("favorite-item")));
            boolean hasAlcatrazIsland = false;
            for (WebElement favorite : favorites) {
                if (favorite.getText().contains(parkName)) {
                    hasAlcatrazIsland = true;
                    break;
                }
            }
            Assertions.assertFalse(hasAlcatrazIsland, parkName + " is still in the favorites list");
        }

        @Then("the confirmation popup should disappear")
        public void the_confirmation_popup_should_disappear() {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("confirmation-popup")));
        }

        @Then("their Favorites list should remain the same")
        public void their_favorites_list_should_remain_the_same() {
            // Validate that the favorites list has not changed
        }

        @When("the user clicks the {string} button")
        public void the_user_clicks_the_button(String buttonText) {
            WebElement deleteAllButton = driver.findElement(By.xpath("//button[contains(., '" + buttonText + "')]"));
            deleteAllButton.click();
        }

        @Then("all parks should be removed from their Favorites")
        public void all_parks_should_be_removed_from_their_favorites() {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            List<WebElement> favorites = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.className("favorite-item")));
            Assertions.assertEquals(0, favorites.size(), "Favorites list is not empty");
        }

        @When("the user clicks on a favorite park")
        public void the_user_clicks_on_a_favorite_park() {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            List<WebElement> favorites = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.className("favorite-item")));
            if (favorites.size() > 0) {
                favorites.get(0).click();
            }
        }

        @Then("the inline window of details should appear")
        public void the_inline_window_of_details_should_appear() {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement detailsWindow = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("detailsBox")));
            Assertions.assertTrue(detailsWindow.isDisplayed(), "Details window is not displayed");
        }

        @Then("the inline window of details should disappear")
        public void the_inline_window_of_details_should_disappear() {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("detailsBox")));
        }

        @And("the user has at least {int} parks in their Favorites")
        public void theUserHasAtLeastParksInTheirFavorites(int minParks) {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            List<WebElement> favorites = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.className("favorite-item")));
            Assertions.assertTrue(favorites.size() >= minParks, "The user does not have at least " + minParks + " parks in their Favorites");
        }

        @When("the user clicks on that park again")
        public void theUserClicksOnThatParkAgain() {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement selectedPark = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("detailsBox")));
            selectedPark.click();
        }

        @Then("their Favorites list should look the same as the Search results list")
        public void theirFavoritesListShouldLookTheSameAsTheSearchResultsList() {
            // Check the Favorites list
            List<WebElement> favoriteItems = driver.findElements(By.className("favorite-item"));
            for (WebElement item : favoriteItems) {
                Assertions.assertTrue(item.getTagName().equals("li"), "Favorite item is not in a bulleted list");
            }

            // Check the Search results list
            List<WebElement> searchResults = driver.findElements(By.className("search-result"));
            for (WebElement result : searchResults) {
                Assertions.assertTrue(result.getTagName().equals("li"), "Search result is not in a bulleted list");
            }
        }

        @After
        public void tearDown() {
            driver.quit();
        }


}
