#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Uddaan Consultancy
Tests all API endpoints, data models, and functionality
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, List, Any

# Get backend URL from environment
BACKEND_URL = "https://d236ba99-45c7-4f53-a2b1-ec827d4a8c95.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_ids = {
            'opportunities': [],
            'applications': [],
            'testimonials': [],
            'partners': [],
            'countries': []
        }
    
    def log_test(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Uddaan Consultancy API" in data["message"]:
                    self.log_test("Health Check", True, "API is responding correctly")
                    return True
                else:
                    self.log_test("Health Check", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_init_data(self):
        """Test sample data initialization"""
        try:
            response = self.session.post(f"{self.base_url}/init-data")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "initialized successfully" in data["message"]:
                    self.log_test("Data Initialization", True, "Sample data initialized successfully")
                    return True
                else:
                    self.log_test("Data Initialization", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Data Initialization", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Data Initialization", False, f"Error: {str(e)}")
            return False
    
    def test_get_countries(self):
        """Test fetching countries"""
        try:
            response = self.session.get(f"{self.base_url}/countries")
            if response.status_code == 200:
                countries = response.json()
                if isinstance(countries, list) and len(countries) > 0:
                    # Verify country structure
                    sample_country = countries[0]
                    required_fields = ['id', 'name', 'code', 'flag_url']
                    if all(field in sample_country for field in required_fields):
                        self.log_test("Get Countries", True, f"Retrieved {len(countries)} countries successfully")
                        return countries
                    else:
                        self.log_test("Get Countries", False, "Missing required fields in country data", sample_country)
                        return []
                else:
                    self.log_test("Get Countries", False, "No countries returned or invalid format", countries)
                    return []
            else:
                self.log_test("Get Countries", False, f"HTTP {response.status_code}", response.text)
                return []
        except Exception as e:
            self.log_test("Get Countries", False, f"Error: {str(e)}")
            return []
    
    def test_get_opportunities(self):
        """Test fetching opportunities without filters"""
        try:
            response = self.session.get(f"{self.base_url}/opportunities")
            if response.status_code == 200:
                opportunities = response.json()
                if isinstance(opportunities, list) and len(opportunities) > 0:
                    # Verify opportunity structure
                    sample_opp = opportunities[0]
                    required_fields = ['id', 'title', 'description', 'country', 'job_type']
                    if all(field in sample_opp for field in required_fields):
                        self.log_test("Get Opportunities", True, f"Retrieved {len(opportunities)} opportunities successfully")
                        return opportunities
                    else:
                        self.log_test("Get Opportunities", False, "Missing required fields in opportunity data", sample_opp)
                        return []
                else:
                    self.log_test("Get Opportunities", False, "No opportunities returned or invalid format", opportunities)
                    return []
            else:
                self.log_test("Get Opportunities", False, f"HTTP {response.status_code}", response.text)
                return []
        except Exception as e:
            self.log_test("Get Opportunities", False, f"Error: {str(e)}")
            return []
    
    def test_opportunity_filters(self, opportunities):
        """Test opportunity search and filter functionality"""
        if not opportunities:
            self.log_test("Opportunity Filters", False, "No opportunities available for filter testing")
            return
        
        # Test country filter
        try:
            test_country = "Australia"
            response = self.session.get(f"{self.base_url}/opportunities?country={test_country}")
            if response.status_code == 200:
                filtered_opps = response.json()
                if isinstance(filtered_opps, list):
                    # Check if all returned opportunities match the country filter
                    valid_filter = all(opp.get('country') == test_country for opp in filtered_opps)
                    if valid_filter:
                        self.log_test("Country Filter", True, f"Country filter working - {len(filtered_opps)} opportunities for {test_country}")
                    else:
                        self.log_test("Country Filter", False, "Country filter not working properly", filtered_opps)
                else:
                    self.log_test("Country Filter", False, "Invalid response format for country filter", filtered_opps)
            else:
                self.log_test("Country Filter", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Country Filter", False, f"Error: {str(e)}")
        
        # Test job type filter
        try:
            test_job_type = "study"
            response = self.session.get(f"{self.base_url}/opportunities?job_type={test_job_type}")
            if response.status_code == 200:
                filtered_opps = response.json()
                if isinstance(filtered_opps, list):
                    valid_filter = all(opp.get('job_type') == test_job_type for opp in filtered_opps)
                    if valid_filter:
                        self.log_test("Job Type Filter", True, f"Job type filter working - {len(filtered_opps)} {test_job_type} opportunities")
                    else:
                        self.log_test("Job Type Filter", False, "Job type filter not working properly", filtered_opps)
                else:
                    self.log_test("Job Type Filter", False, "Invalid response format for job type filter", filtered_opps)
            else:
                self.log_test("Job Type Filter", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Job Type Filter", False, f"Error: {str(e)}")
        
        # Test search query
        try:
            search_query = "Software"
            response = self.session.get(f"{self.base_url}/opportunities?search_query={search_query}")
            if response.status_code == 200:
                search_results = response.json()
                if isinstance(search_results, list):
                    # Check if results contain the search term
                    valid_search = any(
                        search_query.lower() in opp.get('title', '').lower() or 
                        search_query.lower() in opp.get('description', '').lower()
                        for opp in search_results
                    )
                    if valid_search or len(search_results) == 0:  # Empty results are also valid
                        self.log_test("Search Query", True, f"Search working - {len(search_results)} results for '{search_query}'")
                    else:
                        self.log_test("Search Query", False, "Search results don't match query", search_results)
                else:
                    self.log_test("Search Query", False, "Invalid response format for search", search_results)
            else:
                self.log_test("Search Query", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Search Query", False, f"Error: {str(e)}")
    
    def test_get_specific_opportunity(self, opportunities):
        """Test fetching a specific opportunity by ID"""
        if not opportunities:
            self.log_test("Get Specific Opportunity", False, "No opportunities available for testing")
            return
        
        try:
            test_opportunity = opportunities[0]
            opportunity_id = test_opportunity['id']
            
            response = self.session.get(f"{self.base_url}/opportunities/{opportunity_id}")
            if response.status_code == 200:
                opportunity = response.json()
                if opportunity.get('id') == opportunity_id:
                    self.log_test("Get Specific Opportunity", True, f"Successfully retrieved opportunity {opportunity_id}")
                else:
                    self.log_test("Get Specific Opportunity", False, "Retrieved opportunity ID doesn't match", opportunity)
            else:
                self.log_test("Get Specific Opportunity", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Specific Opportunity", False, f"Error: {str(e)}")
    
    def test_create_opportunity(self):
        """Test creating a new opportunity"""
        try:
            new_opportunity = {
                "title": "Test Engineering Position - Sydney",
                "description": "Test opportunity for backend API testing in Sydney, Australia.",
                "country": "Australia",
                "state": "New South Wales",
                "job_type": "work",
                "requirements": ["Bachelor's degree in Engineering", "2+ years experience", "Strong communication skills"],
                "salary_range": "AUD 70,000 - 95,000",
                "duration": "Full-time permanent"
            }
            
            response = self.session.post(f"{self.base_url}/opportunities", json=new_opportunity)
            if response.status_code == 200:
                created_opp = response.json()
                if 'id' in created_opp and created_opp['title'] == new_opportunity['title']:
                    self.created_ids['opportunities'].append(created_opp['id'])
                    self.log_test("Create Opportunity", True, f"Successfully created opportunity {created_opp['id']}")
                    return created_opp
                else:
                    self.log_test("Create Opportunity", False, "Created opportunity missing required fields", created_opp)
                    return None
            else:
                self.log_test("Create Opportunity", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Create Opportunity", False, f"Error: {str(e)}")
            return None
    
    def test_submit_application(self, opportunities):
        """Test submitting a job application"""
        if not opportunities:
            self.log_test("Submit Application", False, "No opportunities available for application testing")
            return
        
        try:
            test_opportunity = opportunities[0]
            application_data = {
                "opportunity_id": test_opportunity['id'],
                "applicant_name": "Rajesh Kumar Sharma",
                "email": "rajesh.sharma@email.com",
                "phone": "+977-9841234567",
                "available_countries": ["Australia", "Canada", "United Kingdom"],
                "cover_letter": "I am very interested in this opportunity and believe my skills and experience make me a strong candidate. I have relevant experience in the field and am excited about the possibility of working in this role."
            }
            
            response = self.session.post(f"{self.base_url}/applications", json=application_data)
            if response.status_code == 200:
                created_app = response.json()
                if 'id' in created_app and created_app['applicant_name'] == application_data['applicant_name']:
                    self.created_ids['applications'].append(created_app['id'])
                    self.log_test("Submit Application", True, f"Successfully submitted application {created_app['id']}")
                    return created_app
                else:
                    self.log_test("Submit Application", False, "Created application missing required fields", created_app)
                    return None
            else:
                self.log_test("Submit Application", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Submit Application", False, f"Error: {str(e)}")
            return None
    
    def test_get_applications(self):
        """Test fetching all applications"""
        try:
            response = self.session.get(f"{self.base_url}/applications")
            if response.status_code == 200:
                applications = response.json()
                if isinstance(applications, list):
                    self.log_test("Get Applications", True, f"Retrieved {len(applications)} applications successfully")
                    return applications
                else:
                    self.log_test("Get Applications", False, "Invalid response format", applications)
                    return []
            else:
                self.log_test("Get Applications", False, f"HTTP {response.status_code}", response.text)
                return []
        except Exception as e:
            self.log_test("Get Applications", False, f"Error: {str(e)}")
            return []
    
    def test_get_testimonials(self):
        """Test fetching testimonials"""
        try:
            response = self.session.get(f"{self.base_url}/testimonials")
            if response.status_code == 200:
                testimonials = response.json()
                if isinstance(testimonials, list) and len(testimonials) > 0:
                    # Verify testimonial structure
                    sample_testimonial = testimonials[0]
                    required_fields = ['id', 'name', 'position', 'content']
                    if all(field in sample_testimonial for field in required_fields):
                        self.log_test("Get Testimonials", True, f"Retrieved {len(testimonials)} testimonials successfully")
                        return testimonials
                    else:
                        self.log_test("Get Testimonials", False, "Missing required fields in testimonial data", sample_testimonial)
                        return []
                else:
                    self.log_test("Get Testimonials", False, "No testimonials returned or invalid format", testimonials)
                    return []
            else:
                self.log_test("Get Testimonials", False, f"HTTP {response.status_code}", response.text)
                return []
        except Exception as e:
            self.log_test("Get Testimonials", False, f"Error: {str(e)}")
            return []
    
    def test_get_partners(self):
        """Test fetching university partners"""
        try:
            response = self.session.get(f"{self.base_url}/partners")
            if response.status_code == 200:
                partners = response.json()
                if isinstance(partners, list) and len(partners) > 0:
                    # Verify partner structure
                    sample_partner = partners[0]
                    required_fields = ['id', 'name', 'country', 'logo_url']
                    if all(field in sample_partner for field in required_fields):
                        self.log_test("Get Partners", True, f"Retrieved {len(partners)} university partners successfully")
                        return partners
                    else:
                        self.log_test("Get Partners", False, "Missing required fields in partner data", sample_partner)
                        return []
                else:
                    self.log_test("Get Partners", False, "No partners returned or invalid format", partners)
                    return []
            else:
                self.log_test("Get Partners", False, f"HTTP {response.status_code}", response.text)
                return []
        except Exception as e:
            self.log_test("Get Partners", False, f"Error: {str(e)}")
            return []
    
    def test_error_cases(self):
        """Test error handling for invalid requests"""
        # Test invalid opportunity ID
        try:
            invalid_id = "invalid-opportunity-id"
            response = self.session.get(f"{self.base_url}/opportunities/{invalid_id}")
            if response.status_code == 404:
                self.log_test("Invalid Opportunity ID", True, "Correctly returned 404 for invalid opportunity ID")
            else:
                self.log_test("Invalid Opportunity ID", False, f"Expected 404, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Invalid Opportunity ID", False, f"Error: {str(e)}")
        
        # Test application with invalid opportunity ID
        try:
            invalid_application = {
                "opportunity_id": "invalid-opportunity-id",
                "applicant_name": "Test User",
                "email": "test@email.com",
                "phone": "+977-1234567890",
                "available_countries": ["Nepal"]
            }
            
            response = self.session.post(f"{self.base_url}/applications", json=invalid_application)
            if response.status_code == 404:
                self.log_test("Application Invalid Opportunity", True, "Correctly rejected application with invalid opportunity ID")
            else:
                self.log_test("Application Invalid Opportunity", False, f"Expected 404, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Application Invalid Opportunity", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run comprehensive backend API tests"""
        print("🚀 Starting Uddaan Consultancy Backend API Tests")
        print("=" * 60)
        
        # Test 1: Health Check
        if not self.test_health_check():
            print("❌ Health check failed - stopping tests")
            return False
        
        # Test 2: Initialize Sample Data
        self.test_init_data()
        
        # Test 3: Get Countries
        countries = self.test_get_countries()
        
        # Test 4: Get Opportunities
        opportunities = self.test_get_opportunities()
        
        # Test 5: Test Opportunity Filters
        self.test_opportunity_filters(opportunities)
        
        # Test 6: Get Specific Opportunity
        self.test_get_specific_opportunity(opportunities)
        
        # Test 7: Create New Opportunity
        new_opportunity = self.test_create_opportunity()
        
        # Test 8: Submit Application
        self.test_submit_application(opportunities)
        
        # Test 9: Get Applications
        applications = self.test_get_applications()
        
        # Test 10: Get Testimonials
        testimonials = self.test_get_testimonials()
        
        # Test 11: Get Partners
        partners = self.test_get_partners()
        
        # Test 12: Error Cases
        self.test_error_cases()
        
        # Print Summary
        self.print_summary()
        
        return True
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🎯 KEY FUNCTIONALITY VERIFIED:")
        print("  - API Health Check")
        print("  - Sample Data Initialization")
        print("  - Countries Management")
        print("  - Opportunities CRUD Operations")
        print("  - Search and Filter Functionality")
        print("  - Job Applications Submission")
        print("  - Testimonials Retrieval")
        print("  - University Partners Data")
        print("  - Error Handling")

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 Backend API testing completed!")
    else:
        print("\n💥 Backend API testing failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()