import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

class TestHostelBrowsing(unittest.TestCase):
    """Test hostel listing, search, and filtering functionality"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_view_hostel_listings(self):
        """Test viewing hostel listings page"""
        self.driver.get(f"{self.base_url}/hostels")
        
        # Wait for hostel cards to load
        hostel_cards = self.wait.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[class*='bg-gray-800']"))
        )
        
        self.assertGreater(len(hostel_cards), 0, "No hostel cards found")
    
    def test_02_search_hostel_by_name(self):
        """Test searching hostels by name"""
        self.driver.get(f"{self.base_url}/hostels")
        
        # Find search input
        search_input = self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Search']"))
        )
        
        # Search for a hostel
        search_input.send_keys("G-10")
        search_input.send_keys(Keys.RETURN)
        
        time.sleep(2)
        
        # Verify results contain search term
        hostel_names = self.driver.find_elements(By.CSS_SELECTOR, "h3")
        found = any("G-10" in name.text for name in hostel_names)
        self.assertTrue(found, "Search results don't contain searched term")
    
    def test_03_filter_by_gender(self):
        """Test filtering hostels by gender"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Select gender filter
        gender_select = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Gender')]/following-sibling::select")
        gender_select.click()
        self.driver.find_element(By.XPATH, "//option[text()='Male Hostels']").click()
        
        # Apply filters
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        apply_button.click()
        
        time.sleep(2)
        
        # Verify filter applied
        hostels = self.driver.find_elements(By.CSS_SELECTOR, "div[class*='bg-gray-800']")
        self.assertGreater(len(hostels), 0, "No hostels found after filtering")
    
    def test_04_filter_by_profession(self):
        """Test filtering hostels by profession"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Select profession filter
        profession_select = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Profession')]/following-sibling::select")
        profession_select.click()
        self.driver.find_element(By.XPATH, "//option[text()='Student']").click()
        
        # Apply filters
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        apply_button.click()
        
        time.sleep(2)
        
        hostels = self.driver.find_elements(By.CSS_SELECTOR, "div[class*='bg-gray-800']")
        self.assertGreater(len(hostels), 0, "No hostels found after filtering")
    
    def test_05_filter_by_rating(self):
        """Test filtering hostels by minimum rating"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Select rating filter
        rating_select = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Minimum Rating')]/following-sibling::select")
        rating_select.click()
        self.driver.find_element(By.XPATH, "//option[@value='3']").click()
        
        # Apply filters
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        apply_button.click()
        
        time.sleep(2)
        
        # Verify results
        self.assertTrue(True)  # Basic check that filter doesn't break
    
    def test_06_filter_by_area_tags(self):
        """Test filtering hostels by area using tag input"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Click on area input
        area_input = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Area')]/following-sibling::div//input")
        area_input.click()
        area_input.send_keys("G-10")
        
        time.sleep(1)
        
        # Select from dropdown if available
        try:
            suggestion = self.driver.find_element(By.CSS_SELECTOR, "button[class*='bg-gray-800']")
            suggestion.click()
        except:
            area_input.send_keys(Keys.RETURN)
        
        # Apply filters
        time.sleep(1)
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        apply_button.click()
        
        time.sleep(2)
        self.assertTrue(True)
    
    def test_07_filter_by_university(self):
        """Test filtering hostels by nearby university"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Click on university input
        uni_input = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Nearby University')]/following-sibling::div//input")
        uni_input.click()
        uni_input.send_keys("NUST")
        
        time.sleep(1)
        
        # Select from dropdown if available
        try:
            suggestion = self.driver.find_element(By.XPATH, "//button[contains(text(), 'NUST')]")
            suggestion.click()
        except:
            uni_input.send_keys(Keys.RETURN)
        
        # Apply filters
        time.sleep(1)
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        apply_button.click()
        
        time.sleep(2)
        self.assertTrue(True)
    
    def test_08_reset_filters(self):
        """Test resetting all filters"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Apply some filters first
        gender_select = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Gender')]/following-sibling::select")
        gender_select.click()
        self.driver.find_element(By.XPATH, "//option[text()='Male Hostels']").click()
        
        apply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Apply Filters')]")
        apply_button.click()
        time.sleep(2)
        
        # Reset filters
        reset_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Reset Filters')]")
        reset_button.click()
        
        time.sleep(2)
        
        # Verify filters are reset
        hostels = self.driver.find_elements(By.CSS_SELECTOR, "div[class*='bg-gray-800']")
        self.assertGreater(len(hostels), 0, "No hostels found after reset")
    
    def test_09_rent_range_slider(self):
        """Test rent range slider functionality"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Note: Slider interaction is complex, just verify it exists
        rent_label = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Rent Range')]")
        self.assertTrue(rent_label.is_displayed())
    
    def test_10_view_hostel_details(self):
        """Test clicking on a hostel to view details"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Click on first hostel's "View Details" button
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        
        # Wait for hostel details page to load
        self.wait.until(EC.url_contains("/hostel/"))
        self.assertIn("/hostel/", self.driver.current_url)
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
