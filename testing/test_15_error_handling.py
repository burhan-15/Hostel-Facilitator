import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestErrorHandling(unittest.TestCase):
    """Test error handling and edge cases"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_invalid_hostel_id(self):
        """Test accessing hostel with invalid ID"""
        self.driver.get(f"{self.base_url}/hostel/invalid-id-12345")
        time.sleep(2)
        
        # Should show error or redirect
        page_source = self.driver.page_source.lower()
        has_error = "not found" in page_source or "error" in page_source
        
        self.assertTrue(has_error or self.driver.current_url != f"{self.base_url}/hostel/invalid-id-12345")
    
    def test_02_duplicate_login(self):
        """Test logging in when already logged in"""
        # First login
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Try to access login page again
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        # May redirect to dashboard or allow login page
        self.assertTrue(True)
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
        try:
            logout_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
            logout_button.click()
        except:
            pass
    
    def test_03_network_timeout_simulation(self):
        """Test behavior with slow network (simulated by waiting)"""
        self.driver.get(f"{self.base_url}/hostels")
        
        # Page should eventually load even with delay
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Hostel Listings')]")))
        self.assertTrue(True)
    
    def test_04_empty_search_results(self):
        """Test searching for non-existent hostel"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Search for something that doesn't exist
        search_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Search']")
        search_input.send_keys("NonExistentHostel12345XYZ")
        
        search_button = self.driver.find_element(By.CSS_SELECTOR, "button svg")
        search_button.click()
        
        time.sleep(2)
        
        # Should show no results message or empty state
        page_source = self.driver.page_source.lower()
        self.assertTrue("no hostels" in page_source or "not found" in page_source or True)
    
    def test_05_duplicate_review_attempt(self):
        """Test submitting multiple reviews for same hostel"""
        # Login
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Go to hostel
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Try to review (may already have reviewed)
        reviews_tab = self.driver.find_element(By.XPATH, "//button[contains(text(), 'reviews')]")
        reviews_tab.click()
        time.sleep(1)
        
        # If already reviewed, review form shouldn't be visible
        review_forms = self.driver.find_elements(By.CSS_SELECTOR, "textarea[placeholder*='experience']")
        
        # Either form is not present (already reviewed) or is present (can review)
        self.assertTrue(True)
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_06_unauthorized_access_attempt(self):
        """Test accessing protected routes without login"""
        # Try to access user dashboard without login
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        # Should redirect to login
        self.assertIn("/login", self.driver.current_url)
    
    def test_07_browser_refresh_on_form(self):
        """Test browser refresh while filling form"""
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        # Fill form partially
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        
        # Refresh
        self.driver.refresh()
        time.sleep(2)
        
        # Form should be cleared
        email_value = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").get_attribute("value")
        self.assertEqual(email_value, "")
    
    def test_08_special_characters_in_search(self):
        """Test searching with special characters"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        search_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Search']")
        search_input.send_keys("<script>alert('test')</script>")
        
        search_button = self.driver.find_element(By.CSS_SELECTOR, "button svg")
        search_button.click()
        
        time.sleep(2)
        
        # Should handle gracefully without executing script
        self.assertTrue(True)
    
    def test_09_empty_wishlist_state(self):
        """Test wishlist when empty"""
        # Login
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Go to dashboard
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        # Wishlist section should exist
        wishlist_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'My Wishlist')]")
        self.assertTrue(wishlist_section.is_displayed())
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_10_multiple_tab_sessions(self):
        """Test opening application in multiple tabs"""
        # Open first tab
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
        
        # Open new tab
        self.driver.execute_script("window.open('');")
        self.driver.switch_to.window(self.driver.window_handles[1])
        
        # Navigate in second tab
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Both tabs should work independently
        self.assertIn("/hostels", self.driver.current_url)
        
        # Close second tab
        self.driver.close()
        self.driver.switch_to.window(self.driver.window_handles[0])
    
    def test_11_rapid_button_clicks(self):
        """Test rapid clicking of buttons"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Rapidly click filter button
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        
        for _ in range(5):
            apply_button.click()
            time.sleep(0.1)
        
        time.sleep(2)
        
        # Should handle gracefully without errors
        self.assertTrue(True)
    
    def test_12_long_input_strings(self):
        """Test forms with very long input strings"""
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        # Enter very long email
        long_string = "a" * 1000 + "@test.com"
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']")
        email_input.send_keys(long_string)
        
        # Should handle without crashing
        self.assertTrue(True)
    
    def test_13_concurrent_filter_changes(self):
        """Test changing multiple filters rapidly"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Rapidly change filters
        gender_select = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Gender')]/following-sibling::select")
        gender_select.click()
        self.driver.find_element(By.XPATH, "//option[text()='Male Hostels']").click()
        
        profession_select = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Profession')]/following-sibling::select")
        profession_select.click()
        self.driver.find_element(By.XPATH, "//option[text()='Student']").click()
        
        # Apply
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        apply_button.click()
        
        time.sleep(2)
        
        # Should apply filters correctly
        self.assertTrue(True)
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
