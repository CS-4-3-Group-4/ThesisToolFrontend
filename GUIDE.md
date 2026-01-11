# Frontend Guide

## 1. Run Multiple Scenarios for FA

- Go to Results tab
- Click "Export Complete Data" button
- In Objectives Analysis section, click Export Excel, Export JSON, & Export Final Values to CSV buttons

## 2. Run Multiple Scenarios for EFA

- Go to Results tab
- Click "Export Complete Data" button
- In Objectives Analysis section, click Export Excel, Export JSON, & Export Final Values to CSV buttons

## 3. Compare Both Algorithms

- Go to Compare tab
- Set the Comparison Mode to "Multiple Scenarios"
- Upload the `FA-multiple-runs-{timestamp}.json` and `EFA-multiple-runs-{timestamp}.json` files
- Export the Comparisons by clicking the "Export Comparison" button, then click "Export Fitness Score", "Export Execution Time", and "Export Memory Usage" buttons
- After exporting, scroll to the bottom of the page in Objectives Comparison section
- Upload the `FA-objectives-{timestamp}.json` and `EFA-objectives-{timestamp}.json` files
- After uploading, click the "Export Objectives CSV" button

## 4. View the Solution Quality

- Go to Solution Quality tab
- Since we already run the two algorithms in multiple scenarios mode, click refresh button to update the solution quality
- Export the Solution Quality by clicking the "Export Data" button

# Analysis Guide

## 1. Setting up the environment

- activate the environment by running `.venv/scripts/activate`

## 2. Update `comparison/` directory

- Upload your:
    - `FA-vs-EFA-fitness-comparison.csv`,
    - `FA-vs-EFA-executionTime-comparison.csv`,
    - `FA-vs-EFA-memory-comparison.csv`,
    - `solution_quality_comparison.json`,
    - Note: remove the timestamps from the file names if there are any

## 3. Generate the solution quality related csvs

- Run `py utils/json_csv.py` to generate the csvs
- This will generate the following csvs:
    - `FA-vs-EFA-barangay-solutionQuality-comparison.csv`
    - `FA-vs-EFA-solutionQuality-comparison.csv`
    - `FA-vs-EFA-solutionQuality-summary.csv`

## 4. Generate the comparisons figures and values

- Run `py main.py`
- Select what to run
