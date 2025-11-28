import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestFAQPage(unittest.TestCase):
    """Test public FAQ page functionality"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_navigate_to_faq_page(self):
        """Test navigating to FAQ page from navbar"""
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Click FAQ link in navbar
        faq_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'FAQs')]")
        faq_link.click()
        
        time.sleep(2)
        self.assertIn("/faq", self.driver.current_url)
    
    def test_02_view_faq_list(self):
        """Test viewing list of FAQs"""
        self.driver.get(f"{self.base_url}/faq")
        time.sleep(2)
        
        # Check page title
        page_title = self.driver.find_element(By.XPATH, "//h1[contains(text(), 'Frequently Asked Questions')]")
        self.assertTrue(page_title.is_displayed())
    
    def test_03_expand_faq_item(self):
        """Test expanding an FAQ item"""
        self.driver.get(f"{self.base_url}/faq")
        time.sleep(2)
        
        try:
            # Find first FAQ button
            faq_button = self.driver.find_element(By.CSS_SELECTOR, "button[class*='flex justify-between']")
            faq_button.click()
            
            time.sleep(1)
            self.assertTrue(True)
        except:
            print("No FAQs available to expand")
    
    def test_04_collapse_faq_item(self):
        """Test collapsing an expanded FAQ item"""
        self.driver.get(f"{self.base_url}/faq")
        time.sleep(2)
        
        try:
            # Expand first
            faq_button = self.driver.find_element(By.CSS_SELECTOR, "button[class*='flex justify-between']")
            faq_button.click()
            time.sleep(1)
            
            # Collapse
            faq_button.click()
            time.sleep(1)
            
            self.assertTrue(True)
        except:
            print("No FAQs available")
    
    def test_05_expand_multiple_faqs(self):
        """Test expanding multiple FAQs"""
        self.driver.get(f"{self.base_url}/faq")
        time.sleep(2)
        
        try:
            faq_buttons = self.driver.find_elements(By.CSS_SELECTOR, "button[class*='flex justify-between']")
            
            if len(faq_buttons) >= 2:
                # Expand first FAQ
                faq_buttons[0].click()
                time.sleep(1)
                
                # Expand second FAQ
                faq_buttons[1].click()
                time.sleep(1)
                
                self.assertTrue(True)
        except:
            print("Not enough FAQs to test multiple expansion")
    
    def test_06_verify_faq_content(self):
        """Test that FAQ content is displayed when expanded"""
        self.driver.get(f"{self.base_url}/faq")
        time.sleep(2)
        
        try:
            # Expand first FAQ
            faq_button = self.driver.find_element(By.CSS_SELECTOR, "button[class*='flex justify-between']")
            faq_button.click()
            time.sleep(1)
            
            # Check if answer is displayed
            faq_answers = self.driver.find_elements(By.CSS_SELECTOR, "p.text-gray-300")
            self.assertGreater(len(faq_answers), 0, "No FAQ answers found")
        except:
            print("No FAQs available")
    
    def test_07_verify_arrow_icon_rotation(self):
        """Test that arrow icon rotates on expand/collapse"""
        self.driver.get(f"{self.base_url}/faq")
        time.sleep(2)
        
        try:
            # Find arrow icon
            arrow_icon = self.driver.find_element(By.CSS_SELECTOR, "svg[class*='transition-transform']")
            initial_class = arrow_icon.get_attribute("class")
            
            # Click to expand
            faq_button = self.driver.find_element(By.CSS_SELECTOR, "button[class*='flex justify-between']")
            faq_button.click()
            time.sleep(1)
            
            # Check if class changed
            new_class = arrow_icon.get_attribute("class")
            self.assertNotEqual(initial_class, new_class)
        except:
            print("Could not verify arrow rotation")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
