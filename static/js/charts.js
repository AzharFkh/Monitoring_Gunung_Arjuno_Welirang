document.addEventListener("DOMContentLoaded", async () => {
  const weatherData = window.weatherData;
  const magneticData = window.magneticData;

  if (!weatherData || !magneticData) {
    console.error("Data dari Flask belum lengkap!");
    return;
  }

  const sensorNames = ["Suhu", "Tekanan", "Kelembapan", "Magnetic"];

  for (let index = 0; index < sensorNames.length; index++) {
    const ctx = document.getElementById(`chart${index + 1}`);
    if (!ctx) continue;

    let labels = [];
    let datasets = [];
    let yLabel = sensorNames[index];

    // grafik temperatur
    if (index === 0) {
      labels = weatherData.time.map(t => t.split(" ")[1]);
      datasets = [{
        label: "Temperature (°C)",
        data: weatherData.temperature,
        borderColor: "#007bff",
        borderWidth: 2,
        tension: 0.25,
        pointRadius: 2,
        fill: false
      }];
    }

    // grafik tekanan
    else if (index === 1) {
      labels = weatherData.time.map(t => t.split(" ")[1]);
      datasets = [{
        label: "Pressure (hPa)",
        data: weatherData.pressure,
        borderColor: "#ff5722",
        borderWidth: 2,
        tension: 0.25,
        pointRadius: 2,
        fill: false
      }];
    }

    // Grafik kelembapan
    else if (index === 2) {
      labels = weatherData.time.map(t => t.split(" ")[1]);
      datasets = [{
        label: "Humidity (%)",
        data: weatherData.humidity,
        borderColor: "#22ffaaff",
        borderWidth: 2,
        tension: 0.25,
        pointRadius: 2,
        fill: false
      }];
    }

    // grafik magnetik bumi
    else if (index === 3) {
      labels = magneticData.time.map(t => t.split(" ")[1]);
      datasets = [
        { label: "Z (Tm)", data: magneticData.Z, borderColor: "#4caf50", borderWidth: 2, fill: false },
        { label: "X (Tm)", data: magneticData.X, borderColor: "#2196f3", borderWidth: 2, fill: false },
        { label: "Y (Tm)", data: magneticData.Y, borderColor: "#f44336", borderWidth: 2, fill: false }
      ];
    }

    const container = ctx.parentElement;
    container.style.position = "relative";
    container.style.height = "400px"; 
    container.style.width = "100%";

    new Chart(ctx, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false, // <== bikin semua grafik fleksibel
        plugins: {
          legend: { display: true, position: "top" }
        },
        scales: {
          x: { title: { display: true, text: "Waktu (jam)" } },
          y: { title: { display: true, text: yLabel } }
        },
        layout: { padding: 10 }
      }
    });
  }
});
