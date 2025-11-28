#!/usr/bin/env python3
"""
Comprehensive Test Runner for Hostel Facilitator Application
Runs all Selenium test suites and generates a detailed report
"""

import unittest
import sys
import time
from datetime import datetime
import os

# Import all test modules
from test_01_user_authentication import TestUserAuthentication
from test_02_hostel_browsing import TestHostelBrowsing
from test_03_hostel_details import TestHostelDetails
from test_04_wishlist import TestWishlist
from test_05_compare_hostels import TestCompareHostels
from test_06_user_dashboard import TestUserDashboard
from test_07_owner_dashboard import TestOwnerDashboard
from test_08_admin_dashboard import TestAdminDashboard
from test_09_faq_page import TestFAQPage
from test_10_navigation import TestNavigation
from test_11_home_page import TestHomePage
from test_12_role_based_access import TestRoleBasedAccess
from test_13_form_validation import TestFormValidation
from test_14_ui_responsiveness import TestUIResponsiveness
from test_15_error_handling import TestErrorHandling


class ColoredTextTestResult(unittest.TextTestResult):
    """Custom test result class with colored output"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.test_start_time = None
    
    def startTest(self, test):
        super().startTest(test)
        self.test_start_time = time.time()
        print(f"\n{'='*70}")
        print(f"Running: {test._testMethodName}")
        print(f"{'='*70}")
    
    def addSuccess(self, test):
        super().addSuccess(test)
        elapsed = time.time() - self.test_start_time
        print(f"✓ PASSED ({elapsed:.2f}s)")
    
    def addError(self, test, err):
        super().addError(test, err)
        elapsed = time.time() - self.test_start_time
        print(f"✗ ERROR ({elapsed:.2f}s)")
    
    def addFailure(self, test, err):
        super().addFailure(test, err)
        elapsed = time.time() - self.test_start_time
        print(f"✗ FAILED ({elapsed:.2f}s)")


def create_test_suite():
    """Create a test suite with all test cases"""
    suite = unittest.TestSuite()
    
    # Add all test classes
    test_classes = [
        TestUserAuthentication,
        TestHostelBrowsing,
        TestHostelDetails,
        TestWishlist,
        TestCompareHostels,
        TestUserDashboard,
        TestOwnerDashboard,
        TestAdminDashboard,
        TestFAQPage,
        TestNavigation,
        TestHomePage,
        TestRoleBasedAccess,
        TestFormValidation,
        TestUIResponsiveness,
        TestErrorHandling,
    ]
    
    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    
    return suite


def run_tests():
    """Run all tests and generate report"""
    print("\n" + "="*70)
    print("HOSTEL FACILITATOR - SELENIUM TEST SUITE")
    print("="*70)
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")
    
    # Create test suite
    suite = create_test_suite()
    
    # Run tests with custom result class
    runner = unittest.TextTestRunner(
        verbosity=2,
        resultclass=ColoredTextTestResult
    )
    
    start_time = time.time()
    result = runner.run(suite)
    end_time = time.time()
    
    # Print summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    print(f"Total Tests: {result.testsRun}")
    print(f"Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failed: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Total Time: {end_time - start_time:.2f}s")
    print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")
    
    # Print failed tests
    if result.failures:
        print("\nFAILED TESTS:")
        print("-"*70)
        for test, traceback in result.failures:
            print(f"\n{test}:")
            print(traceback)
    
    # Print error tests
    if result.errors:
        print("\nERROR TESTS:")
        print("-"*70)
        for test, traceback in result.errors:
            print(f"\n{test}:")
            print(traceback)
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    # Check if chromedriver is available
    try:
        from selenium import webdriver
        driver = webdriver.Chrome()
        driver.quit()
        print("✓ ChromeDriver found and working\n")
    except Exception as e:
        print(f"✗ ChromeDriver not found or not working: {e}")
        print("\nPlease install ChromeDriver:")
        print("1. Download from: https://chromedriver.chromium.org/")
        print("2. Add to PATH or place in project directory")
        sys.exit(1)
    
    # Run tests
    exit_code = run_tests()
    sys.exit(exit_code)
