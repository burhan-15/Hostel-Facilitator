import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestUIResponsiveness(unittest.TestCase):
    """Test UI responsiveness across different screen sizes"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_desktop_view(self):
        """Test desktop view (1920x1080)"""
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Verify elements are visible
        hero = self.driver.find_element(By.XPATH, "//h1[contains(text(), 'Welcome to')]")
        self.assertTrue(hero.is_displayed())
    
    def test_02_laptop_view(self):
        """Test laptop view (1366x768)"""
        self.driver.set_window_size(1366, 768)
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Verify layout adjusts
        hero = self.driver.find_element(By.XPATH, "//h1[contains(text(), 'Welcome to')]")
        self.assertTrue(hero.is_displayed())
    
    def test_03_tablet_view(self):
        """Test tablet view (768x1024)"""
        self.driver.set_window_size(768, 1024)
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Verify responsive layout
        hero = self.driver.find_element(By.XPATH, "//h1[contains(text(), 'Welcome to')]")
        self.assertTrue(hero.is_displayed())
    
    def test_04_mobile_view(self):
        """Test mobile view (375x667)"""
        self.driver.set_window_size(375, 667)
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Verify mobile layout
        logo = self.driver.find_element(By.CSS_SELECTOR, "img[alt='Logo']")
        self.assertTrue(logo.is_displayed())
    
    def test_05_hostels_grid_responsive(self):
        """Test hostels grid responsiveness"""
        # Desktop
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Should show grid layout
        hostel_cards = self.driver.find_elements(By.CSS_SELECTOR, "div[class*='bg-gray-800']")
        self.assertGreater(len(hostel_cards), 0)
        
        # Mobile
        self.driver.set_window_size(375, 667)
        time.sleep(2)
        
        # Cards should still be visible
        hostel_cards_mobile = self.driver.find_elements(By.CSS_SELECTOR, "div[class*='bg-gray-800']")
        self.assertGreater(len(hostel_cards_mobile), 0)
    
    def test_06_navbar_responsive(self):
        """Test navbar responsiveness"""
        # Desktop - all links visible
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        nav_links = self.driver.find_elements(By.CSS_SELECTOR, "nav a")
        self.assertGreater(len(nav_links), 0)
        
        # Mobile - check navbar adapts
        self.driver.set_window_size(375, 667)
        time.sleep(2)
        
        # Logo should still be visible
        logo = self.driver.find_element(By.CSS_SELECTOR, "img[alt='Logo']")
        self.assertTrue(logo.is_displayed())
    
    def test_07_filters_responsive(self):
        """Test filter section responsiveness"""
        # Desktop
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        filters = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Filters')]")
        self.assertTrue(filters.is_displayed())
        
        # Mobile
        self.driver.set_window_size(375, 667)
        time.sleep(2)
        
        filters_mobile = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Filters')]")
        self.assertTrue(filters_mobile.is_displayed())
    
    def test_08_dashboard_responsive(self):
        """Test dashboard responsiveness"""
        # Login as user
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Desktop view
        profile_section = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Your Profile')]")
        self.assertTrue(profile_section.is_displayed())
        
        # Mobile view
        self.driver.set_window_size(375, 667)
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        profile_section_mobile = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Your Profile')]")
        self.assertTrue(profile_section_mobile.is_displayed())
        
        # Logout
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_09_hostel_details_responsive(self):
        """Test hostel details page responsiveness"""
        # Desktop
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        hostel_name = self.driver.find_element(By.CSS_SELECTOR, "h2")
        self.assertTrue(hostel_name.is_displayed())
        
        # Mobile
        self.driver.set_window_size(375, 667)
        time.sleep(2)
        
        hostel_name_mobile = self.driver.find_element(By.CSS_SELECTOR, "h2")
        self.assertTrue(hostel_name_mobile.is_displayed())
    
    def test_10_forms_responsive(self):
        """Test form responsiveness"""
        # Desktop login form
        self.driver.set_window_size(1920, 1080)
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        login_form = self.driver.find_element(By.CSS_SELECTOR, "form")
        self.assertTrue(login_form.is_displayed())
        
        # Mobile login form
        self.driver.set_window_size(375, 667)
        time.sleep(2)
        
        login_form_mobile = self.driver.find_element(By.CSS_SELECTOR, "form")
        self.assertTrue(login_form_mobile.is_displayed())
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
