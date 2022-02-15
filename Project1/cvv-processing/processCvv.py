import os
import pandas as pd

output_path='annual_aqi_hamilton_county.csv'

directory = os.fsencode('data')
    
for file in os.listdir('data'):
     filename = os.fsdecode(file)
     if filename.endswith(".csv"):
        # Read csv
        df = pd.read_csv(os.path.join('data', filename))
        # Search csv for Hamilton County Ohio
        for index, row in df.iterrows():
            if row['State'] == "Ohio":
                if row['County'] == "Hamilton":
                    # Make a dataframe with the row, and transpose it
                    out_df = pd.DataFrame(row).T
                    # Write to csv
                    out_df.to_csv(output_path, mode='a', header=not os.path.exists(output_path))
