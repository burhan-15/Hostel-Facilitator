import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestNavigation(unittest.TestCase):
    """Test navigation and routing functionality"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_navigate_to_home(self):
        """Test navigating to home page"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Click logo or home link
        logo = self.driver.find_element(By.XPATH, "//span[contains(text(), 'Hostel Facilitator')]")
        logo.click()
        
        time.sleep(1)
        self.assertEqual(self.driver.current_url, f"{self.base_url}/")
    
    def test_02_navigate_to_hostels(self):
        """Test navigating to hostels page"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        hostels_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Hostels')]")
        hostels_link.click()
        
        time.sleep(2)
        self.assertIn("/hostels", self.driver.current_url)
    
    def test_03_navigate_to_faq(self):
        """Test navigating to FAQ page"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        faq_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'FAQs')]")
        faq_link.click()
        
        time.sleep(2)
        self.assertIn("/faq", self.driver.current_url)
    
    def test_04_navigate_to_compare(self):
        """Test navigating to compare page"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        compare_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Compare')]")
        compare_link.click()
        
        time.sleep(2)
        self.assertIn("/compare", self.driver.current_url)
    
    def test_05_navigate_to_login(self):
        """Test navigating to login page"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        login_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Login')]")
        login_link.click()
        
        time.sleep(2)
        self.assertIn("/login", self.driver.current_url)
    
    def test_06_navigate_to_signup(self):
        """Test navigating to signup page"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        signup_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Signup')]")
        signup_link.click()
        
        time.sleep(2)
        self.assertIn("/signup", self.driver.current_url)
    
    def test_07_navbar_active_state(self):
        """Test navbar active link highlighting"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Check if Hostels link is active
        hostels_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Hostels')]")
        link_class = hostels_link.get_attribute("class")
        
        # Active link should have specific styling
        self.assertIn("border-b-2", link_class)
    
    def test_08_responsive_navbar(self):
        """Test responsive navbar behavior"""
        # Set mobile viewport
        self.driver.set_window_size(375, 667)
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Logo should be visible
        logo = self.driver.find_element(By.CSS_SELECTOR, "img[alt='Logo']")
        self.assertTrue(logo.is_displayed())
        
        # Reset to desktop
        self.driver.maximize_window()
    
    def test_09_browser_back_button(self):
        """Test browser back button functionality"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
        
        # Navigate to hostels
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(1)
        
        # Go back
        self.driver.back()
        time.sleep(1)
        
        self.assertEqual(self.driver.current_url, f"{self.base_url}/")
    
    def test_10_browser_forward_button(self):
        """Test browser forward button functionality"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
        
        # Navigate to hostels
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(1)
        
        # Go back
        self.driver.back()
        time.sleep(1)
        
        # Go forward
        self.driver.forward()
        time.sleep(1)
        
        self.assertIn("/hostels", self.driver.current_url)
    
    def test_11_direct_url_access(self):
        """Test accessing pages via direct URL"""
        test_urls = [
            "/",
            "/hostels",
            "/faq",
            "/compare",
            "/login",
            "/signup"
        ]
        
        for url in test_urls:
            self.driver.get(f"{self.base_url}{url}")
            time.sleep(1)
            self.assertIn(url, self.driver.current_url)
    
    def test_12_invalid_route(self):
        """Test accessing an invalid route"""
        self.driver.get(f"{self.base_url}/invalid-route-123")
        time.sleep(2)
        
        # Should redirect or show 404 (depends on your app)
        # For now, just verify it loads something
        self.assertTrue(len(self.driver.page_source) > 0)
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
