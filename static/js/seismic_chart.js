document.addEventListener("DOMContentLoaded", async () => {
  const seismicData = window.seismicData;

  if (!seismicData || !seismicData.time || !seismicData.amplitude) {
    console.error("Data seismik tidak ditemukan atau formatnya salah.");
    return;
  }

  const times = seismicData.time;
  const amplitudes = seismicData.amplitude;
  const canvas = document.getElementById("seismicChart");
  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;

  container.style.position = "relative";
  container.style.height = "400px";
  container.style.width = "100%";

  new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Amplitudo (Sr)",
          data: amplitudes,
          borderColor: "#ffa450ff",
          backgroundColor: "rgba(95, 95, 95, 0.2)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      scales: {
        x: {
          title: { display: true, text: "Waktu" },
          ticks: { maxTicksLimit: 8, color: "#333" },
        },
        y: {
          title: { display: true, text: "Amplitudo" },
          ticks: { color: "#333" },
        },
      },
      plugins: {
        legend: { display: true, position: "top" },
      },
      animation: false,
    },
  });
});
