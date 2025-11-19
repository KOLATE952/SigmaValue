# SigmaValue - Real Estate Data Analysis Backend

This is the **backend** of the SigmaValue project built with **Django** and **OpenAI API**. It provides:

- Filtering of real estate data from an Excel file.
- Generation of a short natural-language summary of selected areas.
- (Optional) Integration with charts to visualize trends.

---

## Features

1. **Filtered Table**: Returns a subset of real estate data based on location queries.  
2. **Summary Generation**: Generates a concise real estate summary (mocked or via OpenAI GPT).  
3. **Excel Data Processing**: Reads and cleans real estate data from an Excel file.  
4. **API Endpoint**: Provides a JSON response for frontend consumption.  

---

## Tech Stack

- **Backend**: Django 5.x  
- **Python**: 3.12+  
- **Database**: SQLite (default)  
- **API**: OpenAI GPT-3.5-turbo  
- **Data Processing**: pandas, openpyxl  

---

## Project Structure

