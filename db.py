import pandas as pd
import scipy
from scipy import stats
from scipy.stats import zscore

crimeReport = pd.read_csv('CrimeDataExportedVersion1.csv')
crimeReport = crimeReport[len(crimeReport)-20:]

#crimeReportNormal = pd.read_csv('CrimeDataExportedVersion1.csv')

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

crimeType = list(crimeReport['NIBRS Code Name'])
severe_scores = []

for crime in crimeType:
    if crime not in severity:
        severity[crime] = 5
    severe_scores.append(severity[crime]/10.0) #norm

firearmPresent = list(crimeReport['Was a firearm involved?'])
firearm_scores = []

for firearm in firearmPresent:
    if firearm == 'N':
        firearm_scores.append(0)
    else:
        firearm_scores.append(1)

numOfVictims = list(crimeReport['Victim Count'])
victim_scores = []

for victim in numOfVictims:
    victim_scores.append(victim/10)

composite_score = []
factor = 0.333
for i in range(len(20)):
    composite_score.append(factor*(severe_scores[i] + firearm_scores + victim_scores[i]))



















