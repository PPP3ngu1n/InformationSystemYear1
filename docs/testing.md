TC# Testing

## Test Plan
TODO: Describe any manual and automated (unit) tests. Uniquely identify each test case. Include prerequisites and test data.

Test Runs
TODO: For each test described above, indicate the current status. 
Create a requirements traceability matrix to validate the completeness of the product.

| Use-Case ID | Requirement ID | Test Case | Status |
| ----------- | -------------- | --------- | ------ |

TODO: Add rows for each test, current status is eg. pass/fail
![Screenshot_3-4-2025_05649_127 0 0 1](https://github.com/user-attachments/assets/b10d0673-3036-4ae8-a2ec-8ce5ae8ceb88)

Test Case 1: Makes sure that all CCTV locations show on the map 

Test Case 2: Makes sure that all CCTV locations are the same in the real world
![Screenshot_3-4-2025_44034_127 0 0 1](https://github.com/user-attachments/assets/7eb029ad-3361-4e8b-90e1-3aeaecd6399c)

Test Case 3: Allows Users to send feedbck back
Test Case 4: Makes sure a route can be generated
Test Case 5: Makes sure that the pin location of CCTVs load up in less than 5 seconds
Test Case 6: Makes sure that a route can be generated in less than 4 seconds
Test Case 7: Ensures that when users send feedback it is sent instantly
Test Case 8: Makes sure that CCTVs within a 1-mile radius is shown on the map

| Use-Case ID | Requirement ID | Test Case | Status |
| ----------- | -------------- | --------- | ------ |
| **TC FR1 01** | FR1 | Verifies that all of the CCTV locations show on the map (1) | Pass |
| **TC FR1 02** | FR1 | Verifies that all CCTV locations are true in the real world (2) | Pass |
| **TC FR2 01** | FR2 | Ensures that feedback can be sent back by users (3) | Pass | 
| **TC FR3 01** | FR3 | Verifies if a route can be generated from start to end (4) | Fail |
| **TC NFR1 01** | NFR1 | Ensures that all CCTV Pins load up in less than 5 seconds (5) | Pass |
| **TC NFR2 01** | NFR2 | Makes sure that the safest route is generated in less than 4 seconds (6) | Fail |
| **TC NFR3 01** | NFR3 | Makes sure that the feedback is sent instantly (7) | Pass |
| **TC NFR4 01** | NFR4 | Ensures that all CCTVs within a 1-mile radius shows on the map (8) | Pass |

