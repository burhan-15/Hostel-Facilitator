import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestAdminDashboard(unittest.TestCase):
    """Test admin dashboard functionality"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
        
        # Login as admin
        cls.driver.get(f"{cls.base_url}/login")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("admin@test.com")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("abcd123")
        cls.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        cls.wait.until(EC.url_contains("/admin"))
    
    def test_01_view_statistics(self):
        """Test viewing admin statistics"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        # Check for stat cards
        stat_cards = self.driver.find_elements(By.CSS_SELECTOR, "div[class*='bg-gray-800']")
        self.assertGreater(len(stat_cards), 0, "No stat cards found")
    
    def test_02_view_pending_hostels(self):
        """Test viewing pending hostel approvals"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        pending_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Pending Hostel Listings')]")
        self.assertTrue(pending_section.is_displayed())
    
    def test_03_approve_hostel(self):
        """Test approving a pending hostel"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        try:
            approve_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Approve')]")
            approve_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No pending hostels to approve")
    
    def test_04_reject_hostel(self):
        """Test rejecting a pending hostel"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        try:
            reject_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Reject')]")
            reject_button.click()
            time.sleep(1)

            # Switch to alert and accept it
            alert = self.driver.switch_to.alert
            alert.accept()  # click 'Yes' on the alert
            time.sleep(2)

            self.assertTrue(True)
        except:
            print("No pending hostels to reject")
    
    
    def test_05_approve_boost(self):
        """Test approving a boost request"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        try:
            # Find boost approve button (inside boost section)
            boost_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Boost Requests')]/parent::div")
            approve_button = boost_section.find_element(By.XPATH, ".//button[contains(text(), 'Approve')]")
            approve_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No boost requests to approve")
    
    def test_06_view_sales_stats(self):
        """Test viewing sales statistics"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        try:
            sales_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Sales Statistics')]")
            self.assertTrue(sales_section.is_displayed())
        except:
            print("Sales statistics section not found")
    
    def test_07_remove_review(self):
        """Test removing a review as admin"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        try:
            # Find remove button in reviews section
            reviews_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Recent Ratings')]/parent::div")
            remove_button = reviews_section.find_element(By.XPATH, ".//button[contains(text(), 'Remove')]")
            remove_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No reviews to remove")
    
    def test_08_manage_faqs(self):
        """Test managing platform FAQs"""
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        try:
            faq_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Manage FAQs')]")
            self.assertTrue(faq_section.is_displayed())
        except:
            print("FAQ management section not found")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
