import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

class TestUserAuthentication(unittest.TestCase):
    """Test user registration, login, and logout functionality"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_user_signup_success(self):
        """Test successful user registration"""
        self.driver.get(f"{self.base_url}/signup")
        
        # Fill signup form
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Full Name']").send_keys("Test User")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys(f"testuser{int(time.time())}@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Password']").send_keys("password123")
        
        # Select role
        role_select = self.driver.find_element(By.CSS_SELECTOR, "select")
        role_select.click()
        self.driver.find_element(By.CSS_SELECTOR, "option[value='user']").click()
        
        # Submit form
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Wait for redirect to dashboard
        self.wait.until(EC.url_contains("/dashboard"))
        self.assertIn("/dashboard", self.driver.current_url)
    
    def test_02_user_login_success(self):
        """Test successful user login with test account"""
        self.driver.get(f"{self.base_url}/login")
        
        # Fill login form
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        
        # Submit form
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Wait for redirect to dashboard
        self.wait.until(EC.url_contains("/dashboard"))
        self.assertIn("/dashboard", self.driver.current_url)
    
    def test_03_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        self.driver.get(f"{self.base_url}/login")
        
        # Fill login form with invalid credentials
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("invalid@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("wrongpassword")
        
        # Submit form
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Wait for error message
        time.sleep(2)
        error_message = self.driver.find_element(By.CSS_SELECTOR, "p.text-red-400")
        self.assertTrue(error_message.is_displayed())
    
    def test_04_owner_login_success(self):
        """Test owner login"""
        self.driver.get(f"{self.base_url}/login")
        
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("owner@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        self.wait.until(EC.url_contains("/owner"))
        self.assertIn("/owner", self.driver.current_url)
    
    def test_05_admin_login_success(self):
        """Test admin login"""
        self.driver.get(f"{self.base_url}/login")
        
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("admin@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        self.wait.until(EC.url_contains("/admin"))
        self.assertIn("/admin", self.driver.current_url)
    
    def test_06_user_logout(self):
        """Test user logout functionality"""
        # Login first
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Click logout button
        logout_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Logout')]")))
        logout_button.click()
        
        # Verify redirected to home
        time.sleep(2)
        self.assertIn("/", self.driver.current_url)
    
    def test_07_password_visibility_toggle(self):
        """Test password show/hide functionality"""
        self.driver.get(f"{self.base_url}/login")
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']")
        
        # Password should be hidden initially
        self.assertEqual(password_input.get_attribute("type"), "password")
        
        # Click toggle button
        toggle_button = self.driver.find_element(By.CSS_SELECTOR, "button[aria-label*='password']")
        toggle_button.click()
        
        # Password should be visible
        time.sleep(1)
        self.assertEqual(password_input.get_attribute("type"), "text")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
