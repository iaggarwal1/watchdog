import pandas as pd

url = "https://services3.arcgis.com/Et5Qfajgiyosiw4d/arcgis/rest/services/CrimeDataExport_2_view/FeatureServer/replicafilescache/CrimeDataExport_2_view_-4522010479978906068.csv"
relevant_columns = ['NIBRS Code Name', 'Report Date', 'Location', 'Victim Count', 'Crime Against', 'Was a firearm involved?']
df = pd.read_csv(url)
relevant_df = df[relevant_columns]
print(relevant_df)
