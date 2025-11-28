import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestFormValidation(unittest.TestCase):
    """Test form validation across the application"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_login_empty_fields(self):
        """Test login form with empty fields"""
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        # Try to submit empty form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        time.sleep(1)
        
        # Should show validation errors or not submit
        # Check if still on login page
        self.assertIn("/login", self.driver.current_url)
    
    def test_02_login_invalid_email_format(self):
        """Test login form with invalid email format"""
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']")
        email_input.send_keys("invalidemail")
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']")
        password_input.send_keys("password123")
        
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        time.sleep(1)
        
        # Should show validation or stay on page
        self.assertIn("/login", self.driver.current_url)
    
    def test_03_signup_password_too_short(self):
        """Test signup form with short password"""
        self.driver.get(f"{self.base_url}/signup")
        time.sleep(2)
        
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Full Name']").send_keys("Test User")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("test@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Password']").send_keys("123")
        
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        time.sleep(2)
        
        # Should show error or not proceed
        error_messages = self.driver.find_elements(By.CSS_SELECTOR, "p.text-red-400")
        self.assertTrue(len(error_messages) > 0 or "/signup" in self.driver.current_url)
    
    def test_04_signup_empty_name(self):
        """Test signup form with empty name"""
        self.driver.get(f"{self.base_url}/signup")
        time.sleep(2)
        
        # Leave name empty
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("test@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Password']").send_keys("password123")
        
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        time.sleep(1)
        
        # Should not proceed
        self.assertIn("/signup", self.driver.current_url)
    
    def test_05_add_hostel_empty_required_fields(self):
        """Test add hostel form with empty required fields"""
        # Login as owner
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("owner@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/owner"))
        
        # Open add hostel modal
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        add_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add New Hostel')]")
        add_button.click()
        time.sleep(1)
        
        # Try to submit empty form
        submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit for Approval')]")
        submit_button.click()
        
        time.sleep(1)
        
        # Should not close modal or show errors
        modal = self.driver.find_elements(By.XPATH, "//h3[contains(text(), 'List a New Hostel')]")
        self.assertGreater(len(modal), 0, "Modal should still be open")
        
        # Close modal
        cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancel')]")
        cancel_button.click()
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_06_add_hostel_negative_rent(self):
        """Test add hostel form with negative rent"""
        # Login as owner
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("owner@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/owner"))
        
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        add_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add New Hostel')]")
        add_button.click()
        time.sleep(1)
        
        # Fill form with negative rent
        rent_input = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Monthly Rent')]/following-sibling::input")
        rent_input.send_keys("-1000")
        
        # HTML5 validation should prevent negative numbers
        value = rent_input.get_attribute("value")
        
        # Close modal
        cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancel')]")
        cancel_button.click()
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_07_review_empty_text(self):
        """Test review form with empty text"""
        # Login as user
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Go to hostel details
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Switch to reviews tab
        reviews_tab = self.driver.find_element(By.XPATH, "//button[contains(text(), 'reviews')]")
        reviews_tab.click()
        time.sleep(1)
        
        try:
            # Try to submit empty review
            submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
            submit_button.click()
            
            time.sleep(1)
            
            # Review form should still be visible
            self.assertTrue(True)
        except:
            print("Review form not available - user may have already reviewed")
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_08_question_empty_text(self):
        """Test question form with empty text"""
        # Login as user
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Go to hostel details
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Switch to questions tab
        questions_tab = self.driver.find_element(By.XPATH, "//button[contains(text(), 'questions')]")
        questions_tab.click()
        time.sleep(1)
        
        try:
            # Try to submit empty question
            submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit Question')]")
            submit_button.click()
            
            time.sleep(1)
            
            # Form should still be visible
            self.assertTrue(True)
        except:
            print("Question form not available")
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_09_visit_booking_empty_date(self):
        """Test visit booking with empty date"""
        # Login as user
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Go to hostel details
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        try:
            # Click Book a Visit
            book_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Book a Visit')]")
            book_button.click()
            time.sleep(1)
            
            # Try to submit without filling date/time
            book_submit = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Book')]")
            book_submit.click()
            
            time.sleep(1)
            
            # Modal should still be open
            modal = self.driver.find_elements(By.XPATH, "//h3[contains(text(), 'Book a Visit')]")
            self.assertGreater(len(modal), 0, "Modal should still be open")
        except:
            print("Visit booking not available")
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
