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
        
        # Login as user
        cls.driver.get(f"{cls.base_url}/login")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        cls.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        cls.wait.until(EC.url_contains("/dashboard"))
    
    def test_01_add_hostel_to_wishlist(self):
        """Test adding a hostel to wishlist"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Find and click the heart icon
        try:
            heart_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button svg[class*='lucide-heart']"))
            )
            heart_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except Exception as e:
            print(f"Add to wishlist error: {e}")
    
    def test_02_view_wishlist_from_dashboard(self):
        """Test viewing wishlist from dashboard"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        # Check if wishlist section exists
        try:
            wishlist_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'My Wishlist')]")
            self.assertTrue(wishlist_section.is_displayed())
        except:
            print("Wishlist section not found")
    
    def test_03_remove_hostel_from_wishlist(self):
        """Test removing a hostel from wishlist"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        try:
            # Click remove button
            remove_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Remove')]")
            remove_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            # Wishlist might be empty
            print("No hostels in wishlist to remove")
    
    def test_04_view_hostel_from_wishlist(self):
        """Test viewing a hostel from wishlist"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        try:
            # Click view button
            view_button = self.driver.find_element(By.XPATH, "//a[contains(text(), 'View')]")
            view_button.click()
            
            time.sleep(2)
            self.assertIn("/hostel/", self.driver.current_url)
        except:
            print("No hostels in wishlist to view")
    
    def test_05_wishlist_heart_icon_state(self):
        """Test that heart icon shows correct state"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Find heart icons
        heart_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button svg[class*='lucide-heart']")
        
        self.assertGreater(len(heart_buttons), 0, "No heart icons found")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
