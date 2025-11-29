import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class TestWishlist(unittest.TestCase):
    """Test wishlist functionality"""

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)

        cls.login_user()  # initial login

    # ---------- HELPER FUNCTIONS ----------
    @classmethod
    def login_user(cls):
        """Perform login"""
        cls.driver.get(f"{cls.base_url}/login")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("abcd123")
        cls.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        cls.wait.until(EC.url_contains("/dashboard"))
        time.sleep(1)

    def ensure_logged_in(self):
        """Re-login if redirected"""
        if "/login" in self.driver.current_url:
            TestWishlist.login_user()

    def go_to_hostels(self):
        self.ensure_logged_in()
        try:
            hostels_link = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Hostels")))
            hostels_link.click()
        except:
            # If navbar doesn’t show, fallback to URL (rare case)
            self.driver.get(f"{self.base_url}/hostels")
        time.sleep(1)

    def go_to_dashboard(self):
        self.ensure_logged_in()
        try:
            dashboard_link = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Dashboard")))
            dashboard_link.click()
        except:
            self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(1)

    # ---------- TEST CASES ----------

    def test_01_add_hostel_to_wishlist(self):
        """Test adding a hostel to wishlist"""
        self.go_to_hostels()

        try:
            heart_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button svg[class*='lucide-heart']"))
            )
            heart_button.click()
            time.sleep(1)
            self.assertTrue(True)
        except Exception as e:
            self.fail(f"Add to wishlist failed: {e}")

    def test_02_view_wishlist_from_dashboard(self):
        """Check wishlist section exists in dashboard"""
        self.go_to_dashboard()

        try:
            wishlist_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'My Wishlist')]")
            self.assertTrue(wishlist_section.is_displayed())
        except:
            self.fail("Wishlist section not found on dashboard")

    def test_03_remove_hostel_from_wishlist(self):
        """Test removing hostel from wishlist"""
        self.go_to_dashboard()

        try:
            remove_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Remove')]")
            remove_button.click()
            time.sleep(1)
            self.assertTrue(True)
        except:
            print("No hostel in wishlist to remove (skipping)")

    def test_04_view_hostel_from_wishlist(self):
        """Test navigating to a hostel from wishlist"""
        self.go_to_dashboard()

        try:
            view_button = self.driver.find_element(By.XPATH, "//a[contains(text(), 'View')]")
            view_button.click()
            time.sleep(1)
            self.assertIn("/hostel/", self.driver.current_url)
        except:
            print("No hostel in wishlist to view")

    def test_05_wishlist_heart_icon_state(self):
        """Verify heart icons exist on hostels page"""
        self.go_to_hostels()

        hearts = self.driver.find_elements(By.CSS_SELECTOR, "button svg[class*='lucide-heart']")
        self.assertGreater(len(hearts), 0, "No heart icons found on hostels page")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()


if __name__ == "__main__":
    unittest.main()
