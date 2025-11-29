import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestCompareHostels(unittest.TestCase):
    """Test hostel comparison functionality on the new Compare page"""
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)

    def select_hostel(self, dropdown_index, hostel_name):
        """Select a hostel from a dropdown by typing its name"""
        input_xpath = f"(//input[@placeholder='Search hostel...'])[{dropdown_index}]"
        self.wait.until(EC.element_to_be_clickable((By.XPATH, input_xpath)))
        input_box = self.driver.find_element(By.XPATH, input_xpath)
        input_box.click()
        input_box.clear()
        input_box.send_keys(hostel_name)
        time.sleep(1)  # wait for dropdown suggestions to appear

        # Click the hostel from the suggestions
        suggestion_xpath = f"//div[contains(@class, 'cursor-pointer') and text()='{hostel_name}']"
        self.wait.until(EC.element_to_be_clickable((By.XPATH, suggestion_xpath)))
        self.driver.find_element(By.XPATH, suggestion_xpath).click()
        time.sleep(1)

    def test_01_empty_state(self):
        """Verify empty state when no hostels selected"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        input1 = self.driver.find_element(By.XPATH, "(//input[@placeholder='Search hostel...'])[1]")
        input2 = self.driver.find_element(By.XPATH, "(//input[@placeholder='Search hostel...'])[2]")
        self.assertTrue(input1.is_displayed() and input2.is_displayed())

    def test_02_select_first_hostel(self):
        """Select the first hostel and verify single-hostel display"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        self.select_hostel(1, "D-12 Cozy Residency") 

        # Verify hostel image and name displayed
        hostel_name = self.driver.find_element(By.XPATH, "//h2[contains(@class,'text-2xl')]").text
        self.assertEqual(hostel_name, "D-12 Cozy Residency")

    def test_03_select_second_hostel(self):
        """Select a second hostel and verify two-hostel comparison table"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        self.select_hostel(1, "D-12 Cozy Residency")
        self.select_hostel(2, "Blue Area Professionals Inn") 
        # Verify table exists
        table = self.driver.find_element(By.TAG_NAME, "table")
        self.assertTrue(table.is_displayed())

        # Verify headers match selected hostels
        headers = self.driver.find_elements(By.XPATH, "//thead//th//span")
        header_texts = [h.text for h in headers if h.text != "Field"]
        self.assertIn("D-12 Cozy Residency", header_texts)
        self.assertIn("Blue Area Professionals Inn", header_texts)

    def test_04_remove_hostel(self):
        """Remove a hostel from comparison and verify single-hostel display"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        self.select_hostel(1, "D-12 Cozy Residency")
        self.select_hostel(2, "Blue Area Professionals Inn")

        # Click remove on first hostel
        remove_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(),'Remove')]")
        remove_buttons[0].click()
        time.sleep(1)

        # Only Blue Area Professionals Inn should remain
        hostel_name = self.driver.find_element(By.XPATH, "//h2[contains(@class,'text-2xl')]").text
        self.assertEqual(hostel_name, "Blue Area Professionals Inn")

    def test_05_clear_all(self):
        """Clear both hostels and verify empty state"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        self.select_hostel(1, "D-12 Cozy Residency")
        self.select_hostel(2, "Blue Area Professionals Inn")

        clear_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Clear All')]")
        clear_button.click()
        time.sleep(1)

        input1 = self.driver.find_element(By.XPATH, "(//input[@placeholder='Search hostel...'])[1]")
        input2 = self.driver.find_element(By.XPATH, "(//input[@placeholder='Search hostel...'])[2]")
        self.assertTrue(input1.is_displayed() and input2.is_displayed())

    def test_06_view_hostel_from_table(self):
        """Click 'View' from comparison table and verify navigation"""
        self.driver.get(f"{self.base_url}/compare")
        time.sleep(2)
        self.select_hostel(1, "D-12 Cozy Residency")
        self.select_hostel(2, "Blue Area Professionals Inn")

        # Click view on first hostel
        view_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(),'View')]")
        view_buttons[0].click()
        time.sleep(2)
        self.assertIn("/hostel/", self.driver.current_url)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
