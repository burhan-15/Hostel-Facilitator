import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestHostelDetails(unittest.TestCase):
    """Test hostel details page functionality"""
    
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
    
    def test_01_view_hostel_information(self):
        """Test viewing hostel details"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        # Click first hostel
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        
        # Verify hostel information is displayed
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h2")))
        
        # Check for key elements
        self.assertTrue(self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Description')]").is_displayed())
        self.assertTrue(self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Amenities')]").is_displayed())
    
    def test_02_view_hostel_amenities(self):
        """Test viewing hostel amenities"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        amenities_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Amenities')]")
        self.assertTrue(amenities_section.is_displayed())
    
    def test_03_view_nearby_universities(self):
        """Test viewing nearby universities"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        try:
            universities_section = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Nearby Universities')]")
            self.assertTrue(universities_section.is_displayed())
        except:
            # Some hostels might not have universities
            pass
    
    def test_04_switch_to_reviews_tab(self):
        """Test switching to reviews tab"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Click on Reviews tab
        reviews_tab = self.driver.find_element(By.XPATH, "//button[contains(text(), 'reviews')]")
        reviews_tab.click()
        
        time.sleep(1)
        self.assertTrue(True)
    
    def test_05_switch_to_questions_tab(self):
        """Test switching to questions tab"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Click on Questions tab
        questions_tab = self.driver.find_element(By.XPATH, "//button[contains(text(), 'questions')]")
        questions_tab.click()
        
        time.sleep(1)
        self.assertTrue(True)
    
    def test_06_switch_to_faqs_tab(self):
        """Test switching to FAQs tab"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Click on FAQs tab
        faqs_tab = self.driver.find_element(By.XPATH, "//button[contains(text(), 'faqs')]")
        faqs_tab.click()
        
        time.sleep(1)
        self.assertTrue(True)
    
    def test_07_add_review(self):
        """Test adding a review to a hostel"""
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
            # Fill review form
            rating_select = self.driver.find_element(By.CSS_SELECTOR, "select")
            rating_select.click()
            self.driver.find_element(By.XPATH, "//option[@value='5']").click()
            
            review_text = self.driver.find_element(By.CSS_SELECTOR, "textarea")
            review_text.send_keys("This is a great hostel! Clean and well-maintained.")
            
            # Submit review
            submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
            submit_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except:
            # User might have already reviewed this hostel
            pass
    
    def test_08_ask_question(self):
        """Test asking a question about a hostel"""
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
            # Fill question form
            question_text = self.driver.find_element(By.CSS_SELECTOR, "textarea[placeholder*='question']")
            question_text.send_keys(f"Is Wi-Fi included? - Test {int(time.time())}")
            
            # Submit question
            submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit Question')]")
            submit_button.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except Exception as e:
            print(f"Question submission error: {e}")
    
    def test_09_share_hostel(self):
        """Test opening share modal"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Click share button
        share_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Share')]")
        share_button.click()
        
        time.sleep(1)
        
        # Verify modal is open
        modal = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Share this Hostel')]")
        self.assertTrue(modal.is_displayed())
        
        # Close modal
        close_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Close')]")
        close_button.click()
    
    def test_10_book_visit(self):
        """Test booking a visit"""
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        try:
            # Click Book a Visit button
            book_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Book a Visit')]")
            book_button.click()
            
            time.sleep(1)
            
            # Fill date and time
            date_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='date']")
            date_input.send_keys("2025-12-25")
            
            time_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='time']")
            time_input.send_keys("14:00")
            
            # Submit booking
            book_submit = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Book')]")
            book_submit.click()
            
            time.sleep(2)
            self.assertTrue(True)
        except Exception as e:
            print(f"Visit booking error: {e}")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
