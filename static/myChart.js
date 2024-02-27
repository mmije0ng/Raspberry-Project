let ctxLight = null;
let chartLight = null;
let ctxUltrasonic = null;
let chartUltrasonic = null;
let ctxTemperature = null;
let chartTemperature = null;
let config = {
  // type은 차트 종류 지정
  type: "line", // 라인그래프
  // data는 차트에 출력될 전체 데이터 표현
  data: {
    // labels는 배열로 데이터의 레이블들
    labels: [],
    // datasets 배열로 이 차트에 그려질 모든 데이터 셋 표현. 그래프 1개만 있음
    datasets: [
      {
        label: "실시간 전기 요금 계산",
        backgroundColor: "blue",
        borderColor: "rgb(255, 255, 0)",
        borderWidth: 2,
        data: [], // 각 레이블에 해당하는 데이터
        fill: false, // 채우지 않고 그리기
      },
    ],
  },
  // 차트의 속성 지정
  options: {
    responsive: false, // 크기 조절 금지
    scales: {
      // x축과 y축 정보
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "시간(초)" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "요금(원)" },
        },
      ],
    },
  },
};

let config2 = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "실시간 수도 요금 계산",
        backgroundColor: "blue",
        borderColor: "rgb(50, 100, 240)",
        borderWidth: 2,
        data: [],
        fill: false,
      },
    ],
  },
  options: {
    responsive: false,
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "시간(초)" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "요금(원)" },
        },
      ],
    },
  },
};

let config3 = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "실시간 난방 요금 계산",
        backgroundColor: "blue",
        borderColor: "rgb(250, 50, 50)",
        borderWidth: 2,
        data: [],
        fill: false,
      },
    ],
  },
  options: {
    responsive: false,
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "시간(초)" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "요금(원)" },
        },
      ],
    },
  },
};

let LABEL_SIZE = 20; // 차트에 그려지는 데이터의 개수
let tick = 0; // 도착한 데이터의 개수임, tick의 범위는 0에서 99까지만
let tick2 = 0;
let tick3 = 0;

function drawChart() {
  ctxUltrasonic = document.getElementById("canvasUltrasonic").getContext("2d");
  chartUltrasonic = new Chart(ctxUltrasonic, config2);
  initChart(chartUltrasonic); // 차트 객체를 initChart에 전달

  ctxLight = document.getElementById("canvasLight").getContext("2d");
  chartLight = new Chart(ctxLight, config);
  initChart(chartLight); // 차트 객체를 initChart에 전달

  ctxTemperature = document
    .getElementById("canvasTemperature")
    .getContext("2d");
  chartTemperature = new Chart(ctxTemperature, config3);
  initChart(chartTemperature); // 차트 객체를 initChart에 전달
}

function initChart(chart) {
  // chart.data.labels의 크기를 LABEL_SIZE로 만들고 0~19까지 레이블 붙이기
  for (let i = 0; i < LABEL_SIZE; i++) {
    chart.data.labels[i] = i;
  }
  chart.update();
}

//전기요금에 관한 차트 데이터 추가
function addChartDataLight(value) {
  tick++; // 도착한 데이터의 개수 증가
  tick %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chartLight.data.datasets[0].data.length; // 현재 데이터의 개수

  // 현재 데이터 개수가 LABEL_SIZE보다 작은 경우
  if (n < LABEL_SIZE) {
    chartLight.data.datasets[0].data.push(value);
  } else {
    // 현재 데이터 개수가 LABEL_SIZE를 넘어서는 경우
    // 새 데이터 value 삽입
    chartLight.data.datasets[0].data.push(value); // value를 data[]의 맨 끝에 추가
    chartLight.data.datasets[0].data.shift(); // data[]의 맨 앞에 있는 데이터 제거

    // 레이블 삽입
    chartLight.data.labels.push(tick); // tick 값을 labels[]의 맨 끝에 추가
    chartLight.data.labels.shift(); // labels[]의 맨 앞에 있는 값 제거
  }
  chartLight.update();
}

//수도요금에 관한 차트 데이터 추가
function addChartDataUltrasonic(value) {
  tick2++; // 도착한 데이터의 개수 증가
  tick2 %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chartUltrasonic.data.datasets[0].data.length; // 현재 데이터의 개수

  // 현재 데이터 개수가 LABEL_SIZE보다 작은 경우
  if (n < LABEL_SIZE) {
    chartUltrasonic.data.datasets[0].data.push(value);
  } else {
    // 현재 데이터 개수가 LABEL_SIZE를 넘어서는 경우
    // 새 데이터 value 삽입
    chartUltrasonic.data.datasets[0].data.push(value); // value를 data[]의 맨 끝에 추가
    chartUltrasonic.data.datasets[0].data.shift(); // data[]의 맨 앞에 있는 데이터 제거

    // 레이블 삽입
    chartUltrasonic.data.labels.push(tick2); // tick 값을 labels[]의 맨 끝에 추가
    chartUltrasonic.data.labels.shift(); // labels[]의 맨 앞에 있는 값 제거
  }
  chartUltrasonic.update();
}

//난방요금에 관한 차트 데이터 추가
function addChartDataTemperature(value) {
  tick3++; // 도착한 데이터의 개수 증가
  tick3 %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chartTemperature.data.datasets[0].data.length; // 현재 데이터의 개수

  // 현재 데이터 개수가 LABEL_SIZE보다 작은 경우
  if (n < LABEL_SIZE) {
    chartTemperature.data.datasets[0].data.push(value);
  } else {
    // 현재 데이터 개수가 LABEL_SIZE를 넘어서는 경우
    // 새 데이터 value 삽입
    chartTemperature.data.datasets[0].data.push(value); // value를 data[]의 맨 끝에 추가
    chartTemperature.data.datasets[0].data.shift(); // data[]의 맨 앞에 있는 데이터 제거

    // 레이블 삽입
    chartTemperature.data.labels.push(tick3); // tick 값을 labels[]의 맨 끝에 추가
    chartTemperature.data.labels.shift(); // labels[]의 맨 앞에 있는 값 제거
  }
  chartTemperature.update();
}

function hideshow(canvasId) {
  // 캔버스 보이기 숨기기
  let canvas = document.getElementById(canvasId); // canvas DOM 객체 알아내기
  if (canvas.style.display == "none")
    // canvas 객체가 보이지 않는다면
    canvas.style.display = "inline-block"; // canvas 객체를 보이게 배치
  else canvas.style.display = "none"; // canvas 객체를 보이지 않게 배치
}

window.addEventListener("load", drawChart); // load 이벤트가 발생하면 drawChart() 호출하도록 등록
