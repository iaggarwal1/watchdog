import csv
import os
import pandas as pd
from flask import Flask, redirect, render_template, request

app = Flask(__name__)

@app.route('/')
def landing_page():
    return redirect('/home')

@app.route('/home')
def home_page():
    return render_template("index.html")
    
csv_filename = "unreported_crime_data.csv"
if not os.path.exists(csv_filename):
    with open(csv_filename, "w", newline="") as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(["Crime", "Victims", "Firearms Present", "Location"])

@app.route('/submit', methods=['POST'])
def submit():
    if request.method == 'POST':
        crime = request.form.get('crime')
        victims = request.form.get('victims')
        firearms = request.form.get('firearms')
        location = request.form.get('location')

        with open(csv_filename, "a", newline="") as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerow([crime, victims, firearms, location])

        return redirect('/home')

if __name__ == "__main__":
    app.run()
