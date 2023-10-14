import pandas as pd
# import scipy
# from scipy import stats
# from scipy.stats import zscore
relevant_columns = ['NIBRS Code Name', 'Report Date', 'Location', 'Victim Count', 'Crime Against', 'Was a firearm involved?']

crimeReport = pd.read_csv('https://services3.arcgis.com/Et5Qfajgiyosiw4d/arcgis/rest/services/CrimeDataExport_2_view/FeatureServer/replicafilescache/CrimeDataExport_2_view_2616402427573203146.csv')
crimeReport = crimeReport[relevant_columns][len(crimeReport)-20:]
crimeReport['Victim Count'].fillna(0, inplace=True)

#ordered dictionary of crimes based on severity (referenced https://bjs.ojp.gov/library/publications/severity-crime-0)
severity = {
    "Murder & Nonnegligent Manslaughter" : 10,
    "Kidnapping/Abduction" : 9,
    "Robbery" : 9,
    "Aggravated Assault" : 8,
    "Human Trafficking, Involuntary Servitude" : 8,
    "Human Trafficking, Commercial Sex Arts" : 8,
    "Extortion/Blackmail" : 7,
    "Arson" : 7,
    "Motor Vehicle Theft" : 7,
    "Identity Theft" : 7,
    "Embezzlement" : 6,
    "False Pretenses/Swindle/Confidence Game" : 6,
    "Intimidation" : 6,
    "Burglary/Breaking & Entering" : 6,
    "All Other Larceny" : 5,
    "Destruction/Damage/Vandalism of Property" : 5,
    "Drug/Narcotic Violations" : 5,
    "Credit Card/Automated Teller Machine Fraud" : 5,
    "Impersonation" : 4,
    "Shoplifting" : 4,
    "Simple Assault" : 4,
    "Stolen Property Offenses" : 4,
    "Theft From Building" : 4,
    "Theft From Motor Vehicle" : 3,
    "Theft of Motor Vehicle Parts or Accessories" : 3,
    "Pocket-picking" : 3,
    "Purse-snatching" : 3,
    "Prostitution" : 2,
    "Bribery" : 2,
    "Counterfeiting/Forgery" : 2,
    "Drug Equipment Violations" : 2,
    "Hacking/Computer Invasion" : 1,
    "Incest" : 1,
    "Animal Cruelty" : 1,
    "Assisting or Promoting Prostitution" : 1,
    "Pornography/Obscene Material" : 1,
    "Theft From Coin-Operated Machine or Device" : 1
}

severe_scores = []
for crime in crimeReport['NIBRS Code Name']:
    if crime not in severity:
        severity[crime] = 5
    severe_scores.append(severity[crime]/10.0) #norm

firearm_scores = [0 if firearm == 'N' else 1 for firearm in crimeReport['Was a firearm involved?']]
victim_scores = [victim/10 if type(victim) == int else 0 for victim in crimeReport['Victim Count']]
factor = 0.333
composite_scores = [factor * (severe_scores[i] + firearm_scores[i] + victim_scores[i]) for i in range(20)]

print(composite_scores)


















