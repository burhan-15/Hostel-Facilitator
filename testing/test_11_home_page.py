import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestHomePage(unittest.TestCase):
    """Test home/welcome page functionality"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_load_home_page(self):
        """Test home page loads successfully"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Check if page loaded
        self.assertEqual(self.driver.current_url, f"{self.base_url}/")
    
    def test_02_view_hero_section(self):
        """Test hero section is displayed"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        hero_title = self.driver.find_element(By.XPATH, "//h1[contains(text(), 'Welcome to')]")
        self.assertTrue(hero_title.is_displayed())
    
    def test_03_click_find_hostel_button(self):
        """Test clicking 'Find a Hostel Now' button"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        find_button = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Find a Hostel Now')]")
        find_button.click()
        
        time.sleep(2)
        self.assertIn("/hostels", self.driver.current_url)
    
    def test_04_view_about_section(self):
        """Test about section is displayed"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Scroll to about section
        about_heading = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'About Our Platform')]")
        self.driver.execute_script("arguments[0].scrollIntoView();", about_heading)
        time.sleep(1)
        
        self.assertTrue(about_heading.is_displayed())
    
    def test_05_view_team_section(self):
        """Test team section is displayed"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Scroll to team section
        team_heading = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Meet the Team')]")
        self.driver.execute_script("arguments[0].scrollIntoView();", team_heading)
        time.sleep(1)
        
        self.assertTrue(team_heading.is_displayed())
    
    def test_06_verify_team_members(self):
        """Test team members are displayed"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Scroll to team section
        team_heading = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Meet the Team')]")
        self.driver.execute_script("arguments[0].scrollIntoView();", team_heading)
        time.sleep(1)
        
        # Check for team member names
        team_members = self.driver.find_elements(By.XPATH, "//h3[contains(text(), 'Faisal') or contains(text(), 'Huzaifa') or contains(text(), 'Burhan')]")
        self.assertGreater(len(team_members), 0, "No team members found")
    
    def test_07_view_footer(self):
        """Test footer is displayed"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Scroll to footer
        footer = self.driver.find_element(By.CSS_SELECTOR, "footer")
        self.driver.execute_script("arguments[0].scrollIntoView();", footer)
        time.sleep(1)
        
        self.assertTrue(footer.is_displayed())
    
    def test_08_verify_footer_content(self):
        """Test footer contains correct information"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Scroll to footer
        footer = self.driver.find_element(By.CSS_SELECTOR, "footer")
        self.driver.execute_script("arguments[0].scrollIntoView();", footer)
        time.sleep(1)
        
        # Check for copyright text
        copyright_text = footer.find_element(By.XPATH, ".//*[contains(text(), 'Hostel Facilitator')]")
        self.assertTrue(copyright_text.is_displayed())
    
    def test_09_hero_background_image(self):
        """Test hero section has background image"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        hero_section = self.driver.find_element(By.CSS_SELECTOR, "div[class*='hero-bg']")
        style = hero_section.get_attribute("style")
        
        # Should have background image
        self.assertIn("background-image", style.lower())
    
    def test_10_about_section_image(self):
        """Test about section has an image"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Scroll to about section
        about_heading = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'About Our Platform')]")
        self.driver.execute_script("arguments[0].scrollIntoView();", about_heading)
        time.sleep(1)
        
        # Check for image
        images = self.driver.find_elements(By.CSS_SELECTOR, "img[class*='rounded']")
        self.assertGreater(len(images), 0, "No images found in about section")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
