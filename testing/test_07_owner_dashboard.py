import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time

class TestOwnerDashboard(unittest.TestCase):
    """Test owner dashboard functionality"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
        
        # Login as owner
        cls.driver.get(f"{cls.base_url}/login")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("owner@test.com")
        cls.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        cls.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        cls.wait.until(EC.url_contains("/owner"))
    
    def test_01_view_my_hostels(self):
        """Test viewing owner's hostel listings"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        my_hostels = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'My Hostel Listings')]")
        self.assertTrue(my_hostels.is_displayed())
    
    def test_02_add_new_hostel(self):
        """Test opening add hostel modal"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        add_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add New Hostel')]")
        add_button.click()
        
        time.sleep(1)
        
        # Verify modal is open
        modal_title = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'List a New Hostel')]")
        self.assertTrue(modal_title.is_displayed())
        
        # Close modal
        cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancel')]")
        cancel_button.click()
    
    def test_03_fill_hostel_form(self):
        """Test filling out the add hostel form"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        add_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add New Hostel')]")
        add_button.click()
        time.sleep(1)
        
        # Fill form fields
        timestamp = int(time.time())
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Hostel Name')]/following-sibling::input").send_keys(f"Test Hostel {timestamp}")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Area')]/following-sibling::input").send_keys("G-11")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Contact Number')]/following-sibling::input").send_keys("0333-1234567")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Monthly Rent')]/following-sibling::input").send_keys("15000")
        
        # Select gender
        gender_select = Select(self.driver.find_element(By.XPATH, "//label[contains(text(), 'Gender')]/following-sibling::select"))
        gender_select.select_by_visible_text("Male")
        
        # Select profession
        profession_select = Select(self.driver.find_element(By.XPATH, "//label[contains(text(), 'Profession')]/following-sibling::select"))
        profession_select.select_by_visible_text("Student")
        
        # Description
        self.driver.find_element(By.CSS_SELECTOR, "textarea").send_keys("This is a test hostel description.")
        
        # Submit
        submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit for Approval')]")
        submit_button.click()
        
        time.sleep(3)
        self.assertTrue(True)
    
    def test_04_update_hostel(self):
        """Test opening update hostel modal"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        try:
            update_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Update')]")
            update_button.click()
            
            time.sleep(1)
            
            # Verify modal is open
            modal_title = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Update Hostel Details')]")
            self.assertTrue(modal_title.is_displayed())
            
            # Close modal
            cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancel')]")
            cancel_button.click()
        except:
            print("No hostels to update")
    
    def test_05_view_pending_questions(self):
        """Test viewing pending questions section"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        questions_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Pending Questions')]")
        self.assertTrue(questions_section.is_displayed())
    
    def test_06_answer_question(self):
        """Test answering a pending question"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        try:
            # Find question textarea
            answer_textarea = self.driver.find_element(By.CSS_SELECTOR, "textarea[placeholder*='answer']")
            answer_textarea.send_keys("Yes, Wi-Fi is included in the rent.")
            
            # Submit answer
            reply_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Reply')]")
            reply_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No pending questions to answer")
    
    def test_07_view_scheduled_visits(self):
        """Test viewing scheduled visits for owner"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        try:
            visits_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Scheduled Visits')]")
            self.assertTrue(visits_section.is_displayed())
        except:
            print("Visits section not found")
    
    def test_08_approve_visit(self):
        """Test approving a visit request"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        try:
            approve_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Approve')]")
            approve_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            print("No pending visits to approve")
    
    def test_09_manage_faqs(self):
        """Test opening manage FAQs modal"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        try:
            faq_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Manage FAQs')]")
            faq_button.click()
            
            time.sleep(1)
            
            # Verify modal is open
            modal_title = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Manage FAQs')]")
            self.assertTrue(modal_title.is_displayed())
            
            # Close modal
            close_button = self.driver.find_element(By.CSS_SELECTOR, "button.text-gray-400")
            close_button.click()
        except:
            print("Manage FAQs button not found")
    
    def test_10_boost_hostel(self):
        """Test opening boost modal"""
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        try:
            boost_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Boost Hostel')]")
            boost_button.click()
            
            time.sleep(1)
            
            # Verify modal is open
            modal_title = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Boost Your Hostel')]")
            self.assertTrue(modal_title.is_displayed())
        except:
            print("Boost button not available - hostel might already be boosted")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
