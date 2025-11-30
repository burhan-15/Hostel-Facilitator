import unittest
import sys
import time
from datetime import datetime

# Import all test modules
from test_01_user_authentication import TestUserAuthentication
from test_02_user_dashboard import TestUserDashboard
from test_03_owner_dashboard import TestOwnerDashboard
from test_04_admin_dashboard import TestAdminDashboard
from test_05_role_based_access import TestRoleBasedAccess
from test_06_form_validation import TestFormValidation


class EnhancedTestResult(unittest.TextTestResult):
    """Shows live output and then generates a final summary table."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.test_start_time = None
        self.results_table = []
        self.counter = 1  # For Test IDs

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
        self._store(test, "PASSED", "Executed successfully", elapsed)

    def addFailure(self, test, err):
        super().addFailure(test, err)
        elapsed = time.time() - self.test_start_time
        print(f"✗ FAILED ({elapsed:.2f}s)")
        self._store(test, "FAILED", "Assertion failed", elapsed)

    def addError(self, test, err):
        super().addError(test, err)
        elapsed = time.time() - self.test_start_time
        print(f"✗ ERROR ({elapsed:.2f}s)")
        self._store(test, "ERROR", "Unexpected error occurred", elapsed)

    def _store(self, test, status, details, elapsed):
        test_id = f"T{self.counter:03d}"
        self.counter += 1
        test_name = test._testMethodName

        self.results_table.append([
            test_id,
            test_name,
            status,
            details,
            f"{elapsed:.2f}s"
        ])


def create_test_suite():
    suite = unittest.TestSuite()
    test_classes = [
        TestUserAuthentication,
        TestUserDashboard,
        TestOwnerDashboard,
        TestAdminDashboard,
        TestRoleBasedAccess,
        TestFormValidation,

    ]

    for cls in test_classes:
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(cls))
    return suite


def print_table(headers, rows):
    widths = [max(len(str(row[i])) for row in rows + [headers]) + 2 for i in range(len(headers))]

    def fmt(row):
        return "| " + " | ".join(str(row[i]).ljust(widths[i]) for i in range(len(row))) + " |"

    print("\n" + "=" * 95)
    print(fmt(headers))
    print("-" * 95)
    for row in rows:
        print(fmt(row))
    print("=" * 95 + "\n")


def run_tests():
    print("\n" + "="*70)
    print("HOSTEL FACILITATOR - SELENIUM TEST SUITE")
    print("="*70)
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)

    suite = create_test_suite()
    runner = unittest.TextTestRunner(
        verbosity=1,  
        resultclass=EnhancedTestResult
    )

    start = time.time()
    result = runner.run(suite)
    end = time.time()

    # Final summary table
    headers = ["Test ID", "Test Name", "Status", "Details", "Time"]
    print_table(headers, result.results_table)

    # Final summary stats
    passed = result.testsRun - len(result.failures) - len(result.errors)
    failed = len(result.failures)
    errors = len(result.errors)
    percent = (passed / result.testsRun * 100) if result.testsRun else 0

    print("FINAL SUMMARY")
    print("="*70)
    print(f"Total Tests : {result.testsRun}")
    print(f"Passed      : {passed}")
    print(f"Failed      : {failed}")
    print(f"Errors      : {errors}")
    print(f"Pass %      : {percent:.2f}%")
    print(f"Total Time  : {end-start:.2f}s")
    print("="*70 + "\n")

    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    # Check chromedriver
    try:
        from selenium import webdriver
        driver = webdriver.Chrome()
        driver.quit()
        print("✓ ChromeDriver found and working\n")
    except Exception as e:
        print(f"✗ ChromeDriver not found or not working: {e}")
        sys.exit(1)

    sys.exit(run_tests())
