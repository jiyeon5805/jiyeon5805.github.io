let foldCount = 0;

const baseThicknessMeters = 0.0001; // 0.1 mm
const baseForceKgf = 1;
const g = 9.81; // 중력 가속도

// 그래프용 데이터 초기화
const foldLabels = [0];
const thicknessData = [baseThicknessMeters];

let chart; // Chart.js 차트 인스턴스

window.onload = function () {
  const ctx = document.getElementById("thicknessChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: foldLabels,
      datasets: [{
        label: "두께 (m)",
        data: thicknessData,
        backgroundColor: "rgba(66, 135, 245, 0.2)",
        borderColor: "rgba(66, 135, 245, 1)",
        borderWidth: 2,
        fill: true,
        pointRadius: 4,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "접은 횟수 (n)"
          }
        },
        y: {
          title: {
            display: true,
            text: "두께 (m)"
          },
          type: "linear",
          min: baseThicknessMeters / 2,
          ticks: {
            callback: value => `${Number(value).toFixed(6)} m`
          }
        }
      }
    }
  });

  updateDisplay();
};

function foldPaper() {
  if (foldCount >= 10) {
    alert("더 이상 접을 수 없습니다! 너무 두꺼워요.");
    return;
  }

  foldCount++;
  updateDisplay();
}

function resetSimulation() {
  foldCount = 0;

  // 그래프 초기화
  foldLabels.length = 1;
  foldLabels[0] = 0;
  thicknessData.length = 1;
  thicknessData[0] = baseThicknessMeters;
  chart.update();

  updateDisplay();
}

function updateDisplay() {
  const thickness = Math.pow(2, foldCount);
  const realThickness = thickness * baseThicknessMeters;
  const forceKgf = baseForceKgf * Math.pow(4, foldCount);
  const forceN = forceKgf * g;

  // 시각적으로 종이 높이 조정
  const paperDiv = document.getElementById("paper");
  paperDiv.style.height = `${20 * thickness}px`;

  document.getElementById("foldCount").innerText = `접은 횟수: ${foldCount}`;
  document.getElementById("thickness").innerText =
    `두께: ${thickness} 겹 (${realThickness.toFixed(6)} m)`;
  document.getElementById("force").innerText =
    `필요한 힘: 약 ${forceKgf.toFixed(2)} kgf (${forceN.toFixed(2)} N)`;

  // 그래프 데이터 갱신
  if (foldLabels.length <= foldCount) {
    foldLabels.push(foldCount);
    thicknessData.push(realThickness);
    chart.update();
  }
}
