from flask import Flask, render_template, redirect
from utilities.calling_api import weather_API_call, magnetic_API_call, seismic_API_call

app = Flask(__name__)

@app.route("/")
def home():

    return render_template("index.html")


@app.route("/monitoring")
def monitoring():
    weather_data = weather_API_call()
    magnetic_data = magnetic_API_call()
    seismic_data = seismic_API_call()

    print("Getting data")
    return render_template("monitoring.html", 
                           weather_data=weather_data,  
                           magnetic_data = magnetic_data, 
                           seismic_data=seismic_data)


@app.route("/model_gunung")
def model_gunung():
    return render_template("3dmodel.html")


@app.route("/informasi")
def informasi():
    return redirect("https://www.bmkg.go.id/")

if __name__ == "__main__":
    app.run(debug=True)
