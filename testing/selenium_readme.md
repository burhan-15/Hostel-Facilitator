# Hostel Facilitator - Selenium Testing Suite

Comprehensive black-box testing suite for the Hostel Facilitator application using Selenium WebDriver.

## 📋 Test Coverage

### 15 Test Modules (150+ Individual Tests)

1. **test_01_user_authentication.py** - User registration, login, logout, password visibility
2. **test_02_hostel_browsing.py** - Hostel listing, search, filtering by multiple criteria
3. **test_03_hostel_details.py** - Viewing hostel information, reviews, questions, FAQs, booking visits
4. **test_04_wishlist.py** - Adding/removing hostels from wishlist
5. **test_05_compare_hostels.py** - Comparing up to 2 hostels side-by-side
6. **test_06_user_dashboard.py** - User profile, wishlist, activity, scheduled visits
7. **test_07_owner_dashboard.py** - Owner's hostel management, answering questions, managing visits
8. **test_08_admin_dashboard.py** - Admin approval workflows, boost management, FAQ management
9. **test_09_faq_page.py** - Public FAQ page, expand/collapse functionality
10. **test_10_navigation.py** - Navbar, routing, browser navigation
11. **test_11_home_page.py** - Welcome page, hero section, about, team section
12. **test_12_role_based_access.py** - Permission testing for different user roles
13. **test_13_form_validation.py** - Input validation, error handling
14. **test_14_ui_responsiveness.py** - Desktop, tablet, mobile views
15. **test_15_error_handling.py** - Edge cases, invalid inputs, error states

## 🛠️ Prerequisites

### Required Software

1. **Python 3.8+**
   ```bash
   python --version
   ```

2. **Google Chrome Browser**
   - Download: https://www.google.com/chrome/

3. **ChromeDriver**
   - Download version matching your Chrome: https://chromedriver.chromium.org/
   - Add to PATH or place in project directory

4. **Selenium WebDriver**
   ```bash
   pip install selenium
   ```

### Application Setup

1. **Backend Server** must be running on `http://localhost:5000`
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Server** must be running on `http://localhost:3000`
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database** must be seeded with test data
   ```bash
   cd backend
   npm run seed
   ```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hostel-facilitator
   ```

2. **Install Python dependencies**
   ```bash
   pip install selenium
   ```

3. **Install ChromeDriver**
   
   **Option A: Using pip (recommended)**
   ```bash
   pip install webdriver-manager
   ```
   
   **Option B: Manual installation**
   - Download ChromeDriver: https://chromedriver.chromium.org/
   - Extract and add to PATH
   - Or place `chromedriver.exe` in the tests directory

4. **Verify Installation**
   ```bash
   python -c "from selenium import webdriver; driver = webdriver.Chrome(); driver.quit(); print('✓ Setup successful')"
   ```

## 🚀 Running Tests

### Run All Tests
```bash
python run_all_tests.py
```

### Run Specific Test Module
```bash
python test_01_user_authentication.py
python test_02_hostel_browsing.py
# ... etc
```

### Run with Verbose Output
```bash
python -m unittest test_01_user_authentication -v
```

### Run Specific Test Case
```bash
python -m unittest test_01_user_authentication.TestUserAuthentication.test_01_user_signup_success
```

## 📊 Test Results

The test runner will output:
- ✓ Passed tests in green
- ✗ Failed tests in red
- Execution time for each test
- Summary with total counts
- Detailed error messages for failures

Example output:
```
======================================================================
HOSTEL FACILITATOR - SELENIUM TEST SUITE
======================================================================
Start Time: 2025-01-15 10:30:00
======================================================================

Running: test_01_user_signup_success
✓ PASSED (3.45s)

Running: test_02_user_login_success
✓ PASSED (2.12s)

...

======================================================================
TEST SUMMARY
======================================================================
Total Tests: 150
Passed: 148
Failed: 2
Errors: 0
Total Time: 287.34s
======================================================================
```

## 🧪 Test Accounts

The following test accounts are seeded in the database:

| Role  | Email | Password |
|-------|-------|----------|
| User  | user@test.com | password |
| Owner | owner@test.com | password |
| Admin | admin@test.com | password |

## 📁 Project Structure

```
tests/
├── test_01_user_authentication.py
├── test_02_hostel_browsing.py
├── test_03_hostel_details.py
├── test_04_wishlist.py
├── test_05_compare_hostels.py
├── test_06_user_dashboard.py
├── test_07_owner_dashboard.py
├── test_08_admin_dashboard.py
├── test_09_faq_page.py
├── test_10_navigation.py
├── test_11_home_page.py
├── test_12_role_based_access.py
├── test_13_form_validation.py
├── test_14_ui_responsiveness.py
├── test_15_error_handling.py
├── run_all_tests.py
└── TESTING_README.md
```

## 🐛 Troubleshooting

### Common Issues

1. **ChromeDriver version mismatch**
   ```
   Error: ChromeDriver version mismatch
   Solution: Download ChromeDriver matching your Chrome version
   ```

2. **Port already in use**
   ```
   Error: Address already in use
   Solution: Kill processes on ports 3000 and 5000
   ```

3. **Backend not running**
   ```
   Error: Connection refused
   Solution: Start backend server: cd backend && npm start
   ```

4. **Database not seeded**
   ```
   Error: User not found
   Solution: Seed database: cd backend && npm run seed
   ```

5. **Slow test execution**
   ```
   Solution: Close unnecessary browser tabs
   Solution: Reduce time.sleep() durations if system is fast
   ```

### Debug Mode

To run tests with browser visible (non-headless):
```python
# In test file, modify setUpClass:
options = webdriver.ChromeOptions()
# options.add_argument('--headless')  # Comment this out
cls.driver = webdriver.Chrome(options=options)
```

## 📝 Writing New Tests

### Test Template
```python
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestNewFeature(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)
    
    def test_01_feature_name(self):
        """Test description"""
        self.driver.get(f"{self.base_url}/page")
        time.sleep(2)
        
        # Test implementation
        element = self.driver.find_element(By.XPATH, "//button")
        self.assertTrue(element.is_displayed())
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
```

## 🎯 Best Practices

1. **Always wait for elements** - Use explicit waits over sleep()
2. **Clean up after tests** - Logout, clear data
3. **Independent tests** - Each test should be self-contained
4. **Descriptive names** - Use clear test method names
5. **Proper assertions** - Verify expected behavior
6. **Handle exceptions** - Use try-except for optional elements

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review test logs for specific errors
3. Verify all prerequisites are met
4. Check backend/frontend console for errors

## 📄 License

This testing suite is part of the Hostel Facilitator project.

---

**Last Updated**: January 2025
**Test Suite Version**: 1.0
**Total Tests**: 150+
