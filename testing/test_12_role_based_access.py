import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestRoleBasedAccess(unittest.TestCase):
    """Test role-based access control and permissions"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_user_cannot_access_owner_dashboard(self):
        """Test that regular users cannot access owner dashboard"""
        # Login as user
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Try to access owner dashboard
        self.driver.get(f"{self.base_url}/owner")
        time.sleep(2)
        
        # Should redirect to login or show error
        self.assertNotIn("/owner", self.driver.current_url)
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_02_user_cannot_access_admin_dashboard(self):
        """Test that regular users cannot access admin dashboard"""
        # Login as user
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Try to access admin dashboard
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        # Should redirect
        self.assertNotIn("/admin", self.driver.current_url)
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_03_owner_cannot_access_admin_dashboard(self):
        """Test that owners cannot access admin dashboard"""
        # Login as owner
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("owner@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/owner"))
        
        # Try to access admin dashboard
        self.driver.get(f"{self.base_url}/admin")
        time.sleep(2)
        
        # Should redirect
        self.assertNotIn("/admin", self.driver.current_url)
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_04_owner_cannot_access_user_dashboard(self):
        """Test that owners cannot access user dashboard"""
        # Login as owner
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("owner@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/owner"))
        
        # Try to access user dashboard
        self.driver.get(f"{self.base_url}/dashboard")
        time.sleep(2)
        
        # Should redirect
        self.assertNotIn("/dashboard", self.driver.current_url)
        
        # Logout
        self.driver.get(f"{self.base_url}/")
        time.sleep(1)
    
    def test_05_navbar_shows_user_links(self):
        """Test that navbar shows correct links for users"""
        # Login as user
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("user@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/dashboard"))
        
        # Check navbar
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Should have Dashboard link
        dashboard_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Dashboard')]")
        self.assertTrue(dashboard_link.is_displayed())
        
        # Should NOT have Admin Panel or Owner Dashboard
        admin_links = self.driver.find_elements(By.XPATH, "//a[contains(text(), 'Admin Panel')]")
        owner_links = self.driver.find_elements(By.XPATH, "//a[contains(text(), 'Owner Dashboard')]")
        
        self.assertEqual(len(admin_links), 0, "User should not see Admin Panel link")
        self.assertEqual(len(owner_links), 0, "User should not see Owner Dashboard link")
        
        # Logout
        logout_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
        logout_button.click()
        time.sleep(1)
    
    def test_06_navbar_shows_owner_links(self):
        """Test that navbar shows correct links for owners"""
        # Login as owner
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("owner@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/owner"))
        
        # Check navbar
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Should have Owner Dashboard link
        owner_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Owner Dashboard')]")
        self.assertTrue(owner_link.is_displayed())
        
        # Should NOT have Admin Panel or user Dashboard
        admin_links = self.driver.find_elements(By.XPATH, "//a[contains(text(), 'Admin Panel')]")
        user_dashboard_links = self.driver.find_elements(By.XPATH, "//a[text()='Dashboard']")
        
        self.assertEqual(len(admin_links), 0, "Owner should not see Admin Panel link")
        
        # Logout
        logout_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
        logout_button.click()
        time.sleep(1)
    
    def test_07_navbar_shows_admin_links(self):
        """Test that navbar shows correct links for admins"""
        # Login as admin
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Email']").send_keys("admin@test.com")
        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']").send_keys("password")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.url_contains("/admin"))
        
        # Check navbar
        self.driver.get(f"{self.base_url}/")
        time.sleep(2)
        
        # Should have Admin Panel link
        admin_link = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Admin Panel')]")
        self.assertTrue(admin_link.is_displayed())
        
        # Logout
        logout_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
        logout_button.click()
        time.sleep(1)
    
    def test_08_guest_cannot_add_review(self):
        """Test that guests cannot add reviews"""
        # Navigate to hostel details as guest
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
        
        # Review form should not be visible or should show login message
        login_messages = self.driver.find_elements(By.XPATH, "//*[contains(text(), 'log in')]")
        review_forms = self.driver.find_elements(By.CSS_SELECTOR, "textarea[placeholder*='experience']")
        
        # Either login message is shown OR review form is not present
        self.assertTrue(len(login_messages) > 0 or len(review_forms) == 0)
    
    def test_09_guest_cannot_book_visit(self):
        """Test that guests cannot book visits"""
        # Navigate to hostel details as guest
        self.driver.get(f"{self.base_url}/hostels")
        time.sleep(2)
        
        view_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'View Details')]"))
        )
        view_button.click()
        time.sleep(2)
        
        # Book visit button should not be visible
        visit_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Book a Visit')]")
        
        self.assertEqual(len(visit_buttons), 0, "Guest should not see Book a Visit button")
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
