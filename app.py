import csv
import os
import pandas as pd
from flask import Flask, redirect, render_template, request
import geocoder

app = Flask(__name__)

@app.route('/')
def landing_page():
    return redirect('/home')

@app.route('/home')
def home_page():
    return render_template("index.html")
    
# csv_filename = "unreported_crime_data.csv"
csv_filename = "static/ALLDATA.csv"
if not os.path.exists(csv_filename):
    with open(csv_filename, "w", newline="") as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow([
                            "NIBRS Code Name",
                            "Report Date",
                            "Location",
                            "Victim Count",
                            "Crime Against",
                            "Was a firearm involved?",
                            "Longitude",
                            "Latitude",
                            "Severity Score"
                            ])

@app.route('/submit', methods=['POST'])
def submit():
    if request.method == 'POST':
        crime = request.form.get('crime')
        victims = request.form.get('victims')
        firearms = request.form.get('firearms')
        location = request.form.get('location')
        try:
            location = geocoder.osm(location)
            latitude = location.latlng[0]
            longitude = location.latlng[1]

    

            with open(csv_filename, "a", newline="") as csvfile:
                csv_writer = csv.writer(csvfile)
                csv_writer.writerow([None, None, None, victims, crime, firearms, longitude, latitude, 1])
                # csv_writer.writerow([crime, victims, firearms, location])
        except:
            pass
        return redirect('/home')

if __name__ == "__main__":
    app.run()
