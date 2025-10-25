from datetime import datetime
import requests
from dotenv import load_dotenv
import os
import math
from collections import defaultdict
from obspy import read
import requests
from io import BytesIO

load_dotenv()

def API_tester():
    api_link = os.getenv("weather_API_link")
    return api_link

def weather_API_call():
    url = os.getenv("weather_API_link") 
    response = requests.get(url)
    
    if response.status_code != 200:
        print("Response:", response.status_code)
        return None

    data = response.json()["weather"]["hourly"]

    time = data["time"]
    cleaned_time = [t.replace('T', ' ') for t in time]
    formatted_time = [datetime.fromisoformat(t).strftime('%Y-%m-%d %H:%M') for t in cleaned_time]

    temperature = data["temperature_2m"]
    pressure = data["pressure_msl"]
    humidity = data["relative_humidity_2m"]

    weather_data = {
        "time": formatted_time[:-120],
        "temperature": temperature[:-120],
        "pressure": pressure[:-120],
        "humidity": humidity[:-120]
    }

    return weather_data


def magnetic_API_call():
    url = str(os.getenv("magnetic_API_link"))
    raw_data = requests.get(url).json()
    data_rows = raw_data["data"]  

    grouped = defaultdict(lambda: {"battery": [], "input": [], "output": []})

    for row in data_rows:
        datetime_str = f"{row['Tanggal']} {row['Waktu']}"
        dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")
        time_key = dt.strftime("%Y-%m-%d %H:00")
        battery = row.get("Tegangan_Baterai", 0)
        input_v = row.get("Tegangan_Input", 0)
        output_v = row.get("Tegangan_Output", 0)

        for key, val in [("battery", battery), ("input", input_v), ("output", output_v)]:
            if isinstance(val, float) and math.isnan(val):
                val = 0
            grouped[time_key][key].append(val)

    result = {
        "time": [],
        "Tegangan_Baterai": [],
        "Tegangan_Input": [],
        "Tegangan_Output": []
    }

    for time_key in sorted(grouped.keys()):
        values = grouped[time_key]
        result["time"].append(time_key)
        result["Tegangan_Baterai"].append(sum(values["battery"]) / len(values["battery"]) if values["battery"] else 0)
        result["Tegangan_Input"].append(sum(values["input"]) / len(values["input"]) if values["input"] else 0)
        result["Tegangan_Output"].append(sum(values["output"]) / len(values["output"]) if values["output"] else 0)

    magnetic_data = {
        "time": result["time"],
        "X": result["Tegangan_Input"],
        "Y": result["Tegangan_Output"],
        "Z": result["Tegangan_Baterai"]
    }

    return magnetic_data


def seismic_API_call():
    url = str(os.getenv("seismic_API_link"))
    response = requests.get(url)

    if response.status_code == 200:
        st = read(BytesIO(response.content))
        tr = st[0]

        times = tr.times("timestamp")  
        amplitudes = tr.data.tolist()

        # Konversi ke format waktu (ISO)
        from datetime import datetime
        time_iso = [datetime.utcfromtimestamp(t).isoformat() for t in times]

        step = 10
        time_iso = time_iso[::step]
        amplitudes = amplitudes[::step]

        formatted_times = [
            datetime.strptime(t, "%Y-%m-%dT%H:%M:%S.%f").strftime("%Y-%m-%d %H:%M")
            for t in time_iso
        ]

        seismic_data = {
            "time": formatted_times ,
            "amplitude": amplitudes
        }

        return seismic_data
    
    else:
        print(f"Gagal ambil data: {response.status_code}")
        
        return None
    

if __name__ == "__main__":
    coba = API_tester()
    print(coba)

