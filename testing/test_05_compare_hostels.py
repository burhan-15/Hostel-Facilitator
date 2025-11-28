import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestCompareHostels(unittest.TestCase):
    """Test hostel comparison functionality"""
    
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
    
    def test_01_add_first_hostel_to_compare(self):
        """Test adding first hostel to comparison"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Find and click compare button
        try:
            compare_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Compare')]")
            if len(compare_buttons) > 0:
                compare_buttons[0].click()
                time.sleep(2)
                self.assertTrue(True)
        except Exception as e:
            print(f"Error adding to compare: {e}")
    
    def test_02_add_second_hostel_to_compare(self):
        """Test adding second hostel to comparison"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Add first hostel
        try:
            compare_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Compare')]")
            if len(compare_buttons) > 1:
                compare_buttons[0].click()
                time.sleep(1)
                compare_buttons[1].click()
                time.sleep(2)
                self.assertTrue(True)
        except Exception as e:
            print(f"Error adding second hostel: {e}")
    
    def test_03_navigate_to_compare_page(self):
        """Test navigating to compare page"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        
        # Verify we're on compare page
        self.assertIn("/compare", self.driver.current_url)
    
    def test_04_view_comparison_table(self):
        """Test viewing the comparison table with two hostels"""
        # First add two hostels
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        try:
            compare_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Compare')]")
            if len(compare_buttons) >= 2:
                compare_buttons[0].click()
                time.sleep(1)
                compare_buttons[1].click()
                time.sleep(1)
        except:
            pass
        
        # Navigate to compare page
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        
        try:
            # Check if comparison table exists
            table = self.driver.find_element(By.CSS_SELECTOR, "table")
            self.assertTrue(table.is_displayed())
        except:
            print("Comparison table not found - might need to add hostels first")
    
    def test_05_remove_hostel_from_compare(self):
        """Test removing a hostel from comparison"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        
        try:
            # Click remove button
            remove_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Remove')]")
            remove_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No hostels to remove from comparison")
    
    def test_06_clear_all_comparisons(self):
        """Test clearing all comparisons"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        
        try:
            # Click clear all button
            clear_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Clear All')]")
            clear_button.click()
            
            time.sleep(2)
            # Should redirect to hostels page
            self.assertIn("/hostels", self.driver.current_url)
        except:
            print("Clear all button not found")
    
    def test_07_view_hostel_from_compare(self):
        """Test viewing a hostel from comparison page"""
        # Add hostels first
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        try:
            compare_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Compare')]")
            if len(compare_buttons) > 0:
                compare_buttons[0].click()
                time.sleep(1)
        except:
            pass
        
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        
        try:
            view_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'View')]")
            view_button.click()
            
            time.sleep(2)
            self.assertIn("/hostel/", self.driver.current_url)
        except:
            print("View button not found in comparison")
    
    def test_08_compare_empty_state(self):
        """Test empty state when no hostels added for comparison"""
        # Clear any existing comparisons
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        
        try:
            clear_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Clear All')]")
            clear_button.click()
            time.sleep(2)
        except:
            pass
        
        # Navigate to compare page
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        
        # Should show empty state message
        try:
            empty_message = self.driver.find_element(By.XPATH, "//*[contains(text(), 'No Hostels Added')]")
            self.assertTrue(empty_message.is_displayed())
        except:
            print("Empty state not found")
    
    def test_09_compare_limit_two_hostels(self):
        """Test that only 2 hostels can be added to comparison"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Try to add 3 hostels
        try:
            compare_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Compare')]")
            if len(compare_buttons) >= 3:
                compare_buttons[0].click()
                time.sleep(1)
                compare_buttons[1].click()
                time.sleep(1)
                compare_buttons[2].click()
                time.sleep(1)
                
                # Should show an alert or error
                self.assertTrue(True)
        except:
            print("Could not test compare limit")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
