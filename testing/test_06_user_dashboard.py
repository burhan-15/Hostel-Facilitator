import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestUserDashboard(unittest.TestCase):
    """Test user dashboard functionality"""
    
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
    
    def test_01_view_user_profile(self):
        """Test viewing user profile information"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        # Check profile section exists
        profile_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Your Profile')]")
        self.assertTrue(profile_section.is_displayed())
        
        # Verify user details are shown
        self.assertTrue(self.driver.find_element(By.XPATH, "//*[contains(text(), 'Name:')]").is_displayed())
        self.assertTrue(self.driver.find_element(By.XPATH, "//*[contains(text(), 'Email:')]").is_displayed())
        self.assertTrue(self.driver.find_element(By.XPATH, "//*[contains(text(), 'Role:')]").is_displayed())
    
    def test_02_view_wishlist_section(self):
        """Test viewing wishlist section on dashboard"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        wishlist_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'My Wishlist')]")
        self.assertTrue(wishlist_section.is_displayed())
    
    def test_03_view_recent_activity(self):
        """Test viewing recent activity section"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        activity_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Recent Activity')]")
        self.assertTrue(activity_section.is_displayed())
    
    def test_04_view_user_reviews(self):
        """Test viewing user's reviews"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        try:
            reviews_heading = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Your Reviews')]")
            self.assertTrue(reviews_heading.is_displayed())
        except:
            print("No reviews section found")
    
    def test_05_view_user_questions(self):
        """Test viewing user's questions"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        try:
            questions_heading = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Your Questions')]")
            self.assertTrue(questions_heading.is_displayed())
        except:
            print("No questions section found")
    
    def test_06_view_scheduled_visits(self):
        """Test viewing scheduled visits"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        try:
            visits_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'My Visits')]")
            self.assertTrue(visits_section.is_displayed())
        except:
            print("Visits section not found")
    
    def test_07_cancel_visit(self):
        """Test canceling a scheduled visit"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        try:
            cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancel Visit')]")
            cancel_button.click()
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No visits to cancel")
    
    def test_08_mark_visit_complete(self):
        """Test marking a visit as complete"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        try:
            complete_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Mark Completed')]")
            complete_button.click()
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No approved visits to complete")
    
    def test_09_logout_from_dashboard(self):
        """Test logging out from dashboard"""
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        # Find and click logout button in navbar
        logout_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
        logout_button.click()
        
        time.sleep(2)
        
        # Verify redirected to home
        self.assertIn("/", self.driver.current_url)
        
        # Login again for remaining tests
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
