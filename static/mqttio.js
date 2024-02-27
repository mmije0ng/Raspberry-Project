let client = null; // MQTT 클라이언트의 역할을 하는 Client 객체를 가리키는 전역변수
let connectionFlag = false; // 연결 상태이면 true
let initLux = null; //조도센서로 측정한 초기 저항값 설정을 위한 변수
let initState = null; //초기에 전등 led가 켜진 상태인지, 꺼진 상태인지 확인하기 위한 변수
let initLightState = false; //초기에 전등 상태 측정을 위한 변수
let ledLightState = null; //현재 전등 led가 켜진 상태인지 꺼진 상태인지를 확인

const CLIENT_ID =
  "client-" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16); // 사용자 ID 랜덤 생성

function connect() {
  // 브로커에 접속하는 함수
  if (connectionFlag == true) return; // 현재 연결 상태이므로 다시 연결하지 않음

  // 사용자가 입력한 브로커의 IP 주소와 포트 번호 알아내기
  let broker = document.getElementById("broker").value; // 브로커의 IP 주소
  let port = 9001; // mosquitto를 웹소켓으로 접속할 포트 번호

  // MQTT 메시지 전송 기능을 모두 가징 Paho client 객체 생성
  client = new Paho.MQTT.Client(broker, Number(port), CLIENT_ID);

  // client 객체에 콜백 함수 등록 및 연결
  client.onConnectionLost = onConnectionLost; // 접속 끊김 시 onConnectLost() 실행
  client.onMessageArrived = onMessageArrived; // 메시지 도착 시 onMessageArrived() 실행

  // client 객체에게 브로커에 접속 지시
  client.connect({
    onSuccess: onConnect, // 브로커로부터 접속 응답 시 onConnect() 실행
  });
}

// 브로커로의 접속이 성공할 때 호출되는 함수
function onConnect() {
  connectionFlag = true; // 연결 상태로 설정
  document.getElementById("connectionFlag").innerHTML =
    "시스템에 연결되었습니다";
}

function subscribe(topic) {
  if (connectionFlag != true) {
    // 연결되지 않은 경우
    alert("연결되지 않았음");
    return false;
  }
  client.subscribe(topic); // 브로커에 구독 신청
}

function publish(topic, msg) {
  if (connectionFlag != true) {
    // 연결되지 않은 경우
    alert("연결되지 않았음");
    return false;
  }
  client.send(topic, msg, 0, false); //메시지 publish
}

function unsubscribe(topic) {
  if (connectionFlag != true) return; // 연결되지 않은 경우
  client.unsubscribe(topic, null); // 브로커에 구독 신청 취소
}

// 접속이 끊어졌을 때 호출되는 함수
function onConnectionLost(responseObject) {
  // responseObject는 응답 패킷
  connectionFlag = false; // 연결 되지 않은 상태로 설정
  document.getElementById("connectionFlag").innerHTML ="시스템이 해제 되었습니다";
  document.getElementById("messages").innerHTML += "<span>오류 : 접속 끊어짐</span><br/>";
  
  if (responseObject.errorCode !== 0) {
    document.getElementById("messages").innerHTML +="<span>오류 : " + responseObject.errorMessage + "</span><br/>";
  }
  connectionFlag = false; // 연결 되지 않은 상태로 설정
}

// 메시지가 도착할 때 호출되는 함수
function onMessageArrived(msg) {
  // 매개변수 msg는 도착한 MQTT 메시지를 담고 있는 객체
  console.log("onMessageArrived: " + msg.payloadString);

  //cctv에 대한 메시지
  if (msg.destinationName == "image") {
    console.log("image received")
    drawImage(msg.payloadString); // 메시지에 담긴 파일 이름으로 drawImage() 호출. drawImage()는 웹 페이지에 있음
  }

  messageArrivedByAutoControl(msg); //자동제어에 대한 메시지
  messageArrivedByLight(msg); //전등에 관한 메시지
  messageArrivedByUltrasonic(msg); //수도에 관한 메시지
  messageArrivedByTemperature(msg); //온도에 관한 메시지
}

// disconnection 버튼이 선택되었을 때 호출되는 함수
function disconnect() {
  if (connectionFlag == false) return; // 연결 되지 않은 상태이면 그냥 리턴

  client.disconnect(); // 브로커와 접속 해제
  connectionFlag = false; // 연결 되지 않은 상태로 설정
  document.getElementById("connectionFlag").innerHTML =
    "시스템이 해제 되었습니다";
}

//자동제어를 시작하기 위한 함수
function subscribeByAutoControl() {
  subscribe("autoControl"); //자동제어를 위한 토픽 구독
  publish("autoControlStart", "True"); //자동제어 상태일 때 autoControlStart 토픽에 대해 publish
}

//자동제어를 해제하기 위한 함수
function unsubscribeByAutoControl() {
  unsubscribe("autoControl"); //자동제어를 해제할 때 토픽 구독 취소
  publish("autoControlEnd", "False"); //자동제어 상태가 아님을 전달하기 위한 autoControlEnd 토픽 publish
  document.getElementById("messageByNotAuto").innerHTML =
    "자동제어가 해제되었습니다.";
}

//자동제어에 관한 메시지가 도착했을 때
function messageArrivedByAutoControl(msg) {
  if (msg.destinationName == "autoControl") {

    //사람이 없고 전등이 켜진 상태
    if (msg.payloadString == "offedLedLight") { 
      document.getElementById("messageByAuto").innerHTML +=
        "<mark>현재 사람이 없습니다!</mark> 전등을 껐습니다.<br>";
      ledLightOffed(); //홈페이지에서 전등 제어에 관한 라디오 버튼 상태 변경
    }
    
    //사람이 없고 수도가 켜진 상태
    else if (msg.payloadString == "offedLedUltrasonic") {
      document.getElementById("messageByAuto").innerHTML +=
        "<mark>현재 사람이 없습니다!</mark> 수도를 껐습니다.<br>";
      ledUltrasonicOffed(); //홈페이지에서 수도 제어에 관한 라디오 버튼 상태 변경
    }
    
    //사람이 없고 난방이 켜진 상태
    else if (msg.payloadString == "offedLedTemperature") {
      document.getElementById("messageByAuto").innerHTML +=
        "<mark>현재 사람이 없습니다!</mark> 난방을 껐습니다.<br>";
      ledTemperatureOffed(); //홈페이지에서 난방 제어에 관한 라디오 버튼 상태 변경
    }
  }
}

//전기 요금 구독
function subscribeByLight() {
  subscribe("ledLightState"); //현재 전등 led의 상태에 대한 ledLightState 토픽 구독
  if (!initLightState) {
    subscribe("initLux"); //초기 저항값을 알아내는 initLux 토픽 구독
    initLightState = true;
  }

  subscribe("light"); //조도센서를 이용하여 저항값을 알기 위한 light 토픽 구독
}

function getLightCharge(topic) {
  publish("initLux", initLux); //초기 lux를 publish
  publish("initState", initState); //초기 상태를 publish

  subscribe(topic); //전기 요금을 알기 위한 lightCharge 토픽 구독
}

//전등에 관한 메시지를 받았을 때
function messageArrivedByLight(msg) {
  //현재 전등 led 상태에 관한 메시지를 받았을 때
  if (msg.destinationName == "ledLightState") {
    if (msg.payloadString == "True")
      ledLightState = true;
    else ledLightState = false;
    unsubscribe("ledLightState");
  }
  
  //시스템 초기에 조도센서로 측정한 저항값에 관한 메시지를 받았을 때
  else if (msg.destinationName == "initLux") {
    initLux = parseInt(msg.payloadString); //초기 저항값
    if (ledLightState) //현재 전등 led가 켜진 상태이면
      initState = "lightOn"; //initState를 lightOn으로 변경
    else initState = "lightOff"; //현재 전등 led가 꺼진 상태이면 initState를 lightOff로 변경
    unsubscribe("initLux");
  }
  
  //현재 조도센서로 측정한 저항값에 관한 메시지를 받았을 때
  else if (msg.destinationName == "light") {
    let lux = parseInt(msg.payloadString); //현재 저항값
    let text = document.getElementById("lightMessages");

    //초기상태가 불이 켜져있는 경우
    if (ledLightState && initLux <= lux + 50) {
      //전등 led가 켜져있고 초기 저항값보다 현재 저항값이 큰 경우, 즉 불이 켜져있는 경우
      if (initState == "lightOn") {
        let pt = confirm("현재 전등이 켜져있습니다. 전등을 끄겠습니까?");

        //확인 버튼을 눌렀을 때
        if (pt) {
          let ledLight = document.getElementsByName("ledLight");
          publish("ledLight", "0"); //전등 led를 끄기 위해 브로커에게 ledLight 토픽에 메시지로 0을 보내 전등 led끄기
          ledLightOffed(); //라디오 버튼 상태 변경
        }
      }
      
      else text.innerHTML += "현재 전등이 꺼져있습니다.<br>"; //현재 전등이 꺼져있는 경우
    }

    //초기상태가 불이 꺼져있는 경우
    else {
      //전등 led가 켜져있고 초기 저항값보다 현재 저항값이 큰 경우, 즉 불이 켜져있는 경우
      if (ledLightState && initLux + 50 <= lux) {
        let pt = confirm("현재 전등이 켜져있습니다. 전등을 끄겠습니까?");

        //확인 버튼을 눌렀을 때
        if (pt) {
          let ledLight = document.getElementsByName("ledLight");
          publish("ledLight", "0"); //전등 led를 끄기 위해 브로커에게 ledLight 토픽에 메시지로 0을 보내 전등 led끄기
          ledLightOffed(); //라디오 버튼 상태 변경
        }
      }
      
      else text.innerHTML += "현재 전등이 꺼져있습니다.<br>"; //현재 전등이 꺼져있는 경우
    }

    unsubscribe("light");
  }
  
  //전기 요금에 관한 메시지를 받았을 때
  else if (msg.destinationName == "lightCharge") {
    let currentCharge = parseInt(msg.payloadString); //현재 전기 요금
    let percent = parseInt(document.getElementById("lightChargePercent").value); //목표 퍼센트
    let setCharge = parseInt(document.getElementById("setLightCharge").value); //목표 요금
    let percentCharge = setCharge * percent * 0.01; //목표요금에서 목표 퍼센트에 도달했을 때의 요금
    let text = document.getElementById("lightChargeMessages");

    //현재 요금이 목표 요금의 목표 퍼센트에 도달했을 때의 요금보다 많아진 경우
    if (percentCharge <= currentCharge)
      text.innerHTML = "현재 전기 요금이 목표 요금의 " + percent + "%를 넘었습니다.";

    //현재 요금이 목표 요금보다 많아졌을 경우
    if (currentCharge > setCharge) {
      text.innerHTML =
        "<br>현재 전기 요금이 설정한 요금보다 많아졌습니다. 전등을 끄겠습니다.<br>";

      let ledLight = document.getElementsByName("ledLight");
      publish("ledLight", "0");
      ledLightOffed();
    }

    addChartDataLight(currentCharge); //전기요금에 대한 차트 데이터 추가
    console.log("현재 전기 요금: "+currentCharge);
  }
}

//수도에 관한 메시지를 받았을 때
function messageArrivedByUltrasonic(msg) {
  //초음파 센서를 이용하여 측정한 거리에 관한 메시지를 받았을 때
  if (msg.destinationName == "ultrasonic") {
    let strength = msg.payloadString; //초음파 센서와 물체의 거리
    let ledUltrasonic = document.getElementsByName("ledUltrasonic"); //홈페이지에서 수도 led 제어
    let text = document.getElementById("ultrasonicMessage");

    //수도가 약으로 틀어진 경우
    if (strength == "low") {
      text.innerHTML =
        "현재 수도가 틀어져 있을 수도 있습니다. CCTV와 수도 제어 버튼을 확인해주세요.<br>";
    }
    
    //수도가 중간으로 틀어진 경우 사용자에게 의견을 묻고 수도 led를 제어
    else if (strength == "medium") {
      let pt = confirm("현재 수도가 중간으로 틀어져 있습니다. 수도를 끄시겠습니까?");
      //확인을 눌렀을 때
      if (pt) {
        publish("ledUltrasonic", "0"); //수도 led를 끄기 위해 브로커에게 ledUltrasonic 토픽에 메시지로 0을 보내 수도 led끄기
        ledUltrasonicOffed(); //라디오 버튼 상태 변경
      }
    }
    
    //수도가 강으로 틀어진 경우 자동으로 수도 led를 끄도록
    else if (strength == "strong") {
      text.innerHTML ="현재 수도가 강으로 틀어져 있습니다. 수도를 끄겠습니다.<br>";
      publish("ledUltrasonic", "0");
      ledUltrasonicOffed();
    }
    
    //수도가 잠져있는 경우
    else {
      text.innerHTML = "현재 수도가 잠겨있습니다.<br>";
    }

    unsubscribe("ultrasonic");
  }
  
  //수도요금에 관한 메시지를 받았을 때
  else if (msg.destinationName == "ultrasonicCharge") {
    let currentCharge = parseInt(msg.payloadString); //현재 수도 요금
    let setCharge = parseInt(document.getElementById("setChargeUltrasonic").value); //목표 수도 요금
    let percent = parseInt(document.getElementById("ultrasonicChargePercent").value); //알림 받기 위한 퍼센트
    let percentCharge = setCharge * percent * 0.01; //목표 수도 요금에서 퍼센트에 도달했을 때의 요금
    let text = document.getElementById("ultrasonicChargeMessages");

    //현재 수도 요금이 목표 수도 요금에서 퍼센트에 도달했을 때의 요금보다 많아지면
    if (percentCharge <= currentCharge) 
      text.innerHTML ="현재 수도 요금이 목표 요금의 " + parseInt(percent) + "%를 넘었습니다.";

    //현재 수도 요금이 목표 수도 요금보다 많아지면
    if (currentCharge > setCharge) {
      text.innerHTML ="<br>현재 수도 요금이 설정한 요금보다 많아졌습니다. 수도를 끄겠습니다.<br>";

      let ledUltrasonic = document.getElementsByName("ledUltrasonic");

      //자동으로 수도 led를 끄도록
      publish("ledUltrasonic", "0");
      ledUltrasonicOffed();
    }

    addChartDataUltrasonic(currentCharge); //수도 요금에 관한 차트 데이터 추가
    console.log("현재 수도 요금: " + currentCharge);
  }
}

//전기 요금에 관한 토픽을 구독하기 위한 함수
function getTemperatureCharge(topic) {
  let setTemperature = document.getElementById("setTemperature").value; //설정온도
  publish("setTemperature", setTemperature); //setTemperature라는 토픽으로 현재 난방 설정온도를 publish

  subscribe(topic); //temperatureCharge라는 토픽을 구독하여 요금을 메시지로 받음
}

//온도에 관한 메시지를 받았을 때
function messageArrivedByTemperature(msg) {
  //현재 온도에 관한 메시지를 받았을 때
  if (msg.destinationName == "temperature") {
    let currentTemperature = parseFloat(msg.payloadString); //현재온도
    currentTemperature = currentTemperature.toFixed(2);
    let setTemperature = document.getElementById("setTemperature").value; //설정온도

    let temperatureMessages = document.getElementById("temperatureMessages");
    temperatureMessages.innerHTML = setTemperature;

    //현재온도가 설정온도보다 높아진 경우 난방을 끄도록
    if (currentTemperature > setTemperature) {
      temperatureMessages.innerHTML =
        "설정온도는 " +
        setTemperature +
        "인데 현재 온도는 " +
        currentTemperature +
        "입니다.<br>" +
        "난방을 끄겠습니다.";

      publish("ledTemperature", "0"); //난방 led를 끄기 위해 브로커에게 ledTemperature 토픽에 메시지로 0을 보내 난방 led끄기
      ledTemperatureOffed();
      
      unsubscribe("temperature", null);
    }
    
    //현재온도가 설정온도보다 낮은 경우, 난방이 돌아가고 있는 경우 현재 온도를 알려줌
    else 
      temperatureMessages.innerHTML ="현재 온도는 " + currentTemperature + "입니다.";
  }
  
  //난방 요금에 관한 메시지를 받았을 때
  else if (msg.destinationName == "temperatureCharge") {
    let currentCharge = parseInt(msg.payloadString); //현재 요금
    let setCharge = parseInt(document.getElementById("setChargeTemperature").value); //목표 요금
    let percent = parseInt(document.getElementById("temperatureChargePercent").value); //알림받을 퍼센트
    let percentCharge = setCharge * parseInt(percent) * 0.01; //목표 난방 요금에서 퍼센트에 도달했을 때의 요금
    let text = document.getElementById("temperatureChargeMessages");

    //현재 난방 요금이 목표 난방 요금에서 퍼센트에 도달했을 때의 요금보다 많아지면
    if (percentCharge <= currentCharge) 
      text.innerHTML ="현재 난방 요금이 목표 요금의 " + parseInt(percent) + "%를 넘었습니다.";

    //현재 난방 요금이 목표 요금보다 많아지면 자동으로 난방 led를 끄도록
    if (currentCharge > setCharge) {
      text.innerHTML ="<br>현재 요금이 설정한 요금보다 많아졌습니다. 난방을 끄겠습니다.<br>";
      publish("ledTemperature", "0");
      ledTemperatureOffed();
    }

    addChartDataTemperature(currentCharge); //난방 요금에 관한 차트 데이터 추가
    console.log(currentCharge);
  }
}

//홈페이지에서 전등 제어의 라디오 버튼 상태를 바꾸기 위한 함수
function ledLightOffed() {
  let ledLight = document.getElementsByName("ledLight");
  ledLight[0].checked = false;
  ledLight[1].checked = true;
}

//홈페이지에서 수도 제어의 라디오 버튼 상태를 바꾸기 위한 함수
function ledUltrasonicOffed() {
  let ledUltrasonic = document.getElementsByName("ledUltrasonic");
  ledUltrasonic[0].checked = false;
  ledUltrasonic[1].checked = true;
}

//홈페이지에서 난방 제어의 라디오 버튼 상태를 바꾸기 위한 함수
function ledTemperatureOffed() {
  let ledTemperature = document.getElementsByName("ledTemperature");
  ledTemperature[0].checked = false;
  ledTemperature[1].checked = true;
}
