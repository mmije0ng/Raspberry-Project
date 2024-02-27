# 🖥 라즈베리파이를 이용한 실시간 전기·난방·수도 요금 파악 및 원격 제어 시스템
### 라즈베리파이, Flask, MQTT를 활용한 IoT 응용 시스템 개발
<br>

## ⭐ 프로젝트 소개
라즈베리파이에 연결한 카메라를 이용해 주거공간 사진을 실시간으로 웹 브라우저에 출력하는 cctv를 통해 실시간으로 주거 공간에서의 사람 유무를 파악한다. 사람이 없다면 자동으로 전등, 수도, 난방을 끌 수 있도록 한다. 또한 전등, 수도, 난방 제어를 통해 사용자의 주거 공간이 아닌 외부 원격에서 전등을 키거나 끄고, 수도를 열고 잠그며, 난방 온도를 설정해 난방을 키고 끌 수 있도록 한다. 사용자는 현재 전등, 수도, 난방이 켜져 있는지 꺼져 있는지를 알림 버튼을 통해 확인할 수 있으며 최종적으로 전기, 수도, 난방 사용량에 따른 해당 요금들을 차트를 통해 실시간으로 확인할 수 있으며 목표 요금과 알림을 받기 위한 퍼센트를 설정하고 현재 요금이 알림을 받기 위한 퍼센트에 도달하면 사용자에게 알려주며 현재 요금이 목표 요금을 넘어설 경우 자동으로 전등, 수도, 난방을 끄도록 한다. 이를 실제 상황에서 원격으로 수도를 잠그고 난방 전원을 끄는 등의 행동을 구현하기에는 어려움이 있기 때문에 led 3개를 각각 전등, 수도, 보일러(난방)로 가정한다. <br>
최종적으로 cctv를 통해 주거공간에서 사람의 유무를 파악해 원격으로 전등, 수도, 난방 시스템을 제어하고 현재 전등, 수도, 난방 상태를 파악하며 사용량에 따른 요금을 확인할 수 있도록 라즈베리파이를 이용하여 구현해 보았다.
<br><br>

## ⭐ 개발기간
2023.11.20 ~ 2023.12.14
<br><br>

## 🖥 주요 기능
- ### ⭐ 홈 CCTV
  * CCTV 시작 버튼을 누르면 라즈베리 파이에 연결된 카메라를 통해 웹에서 실시간으로 cctv 화면을 볼 수 있음
- ### ⭐ 자동 제어
    * 자동 제어 ON 버튼 클릭 시 카메라를 통해 라즈베리파이가 위치한 장소(사용자의 집)에 사람의 유무를 파악
    * 사람이 없으면서 전등, 수도, 난방 시스템이 켜져 있는 경우 자동으로 시스템이 꺼짐
    * 자동 제어 OFF 버튼 클릭 시 집의 사람이 없어도 시스템의 변화가 생기지 않음
- ### ⭐ 전등, 수도, 난방 제어 버튼
   * 전등 제어 on 클릭 시 전등(GPIO25 노란색 led)이 켜짐, off 버튼 클릭 시 전등이 꺼짐
   * 수도 제어 on 클릭 시 전등(GPIO14 초록색 led)이 켜짐, off 버튼 클릭 시 수도를 잠금
   * 난방 제어 on 클릭 시 전등(GPIO6 빨간색 led)이 켜짐, off 버튼 클릭 시 난방을 끔
- ### ⭐ 전등, 수도, 난방 알림
   * 전등 알림 버튼 클릭 시 조도 센서에서 값을 읽어와 전등이 켜져있는 지 꺼져 있는지를 알려줌
   * 전등이 켜져있다면 전등을 킬 것인지, 끌 것인지 선택하여 시스템 제어 가능
   * 수도 알림 버튼 클릭 시 초음파 센서를 통해 센서와 물체와의 거리를 측정해 수도가 열려 있는지 잠겨 있는지 알려줌
   * 수도가 열려 있다면 수도를 열 것인지, 잠글 것인지 선택하여 시스템 제어 가능
   * 난방 알림 버튼 클릭 시 온습도 센서에서 값을 읽어와 난방이 켜져있는 지 꺼져 있는지를 알려줌
   * 난방이 켜져있다면 전등을 킬 것인지, 끌 것인지 선택하여 시스템 제어 가능
- ### 실시간 전등, 수도, 난방 요금 계산
  * 차트를 통해 실시간 전등, 수도, 난방 요금을 확인 가능
  * 목표 요금을 설정하여 실시간 요금이 목표 요금을 넘긴다면 자동으로 시스템 제어
<br><br>

## 🌟 Stacks
### Environment <br><br><img src="https://img.shields.io/badge/Raspberry Pi-A22846?style=for-the-badge&logo=Raspberry Pi&logoColor=white"> 
### Back
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white"> <img src="https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=MQTT&logoColor=white"> <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
### Front
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
<br><br>

## 구현 방법
- ### 🌟 하드웨어
  * 카메라 1대
  * 조도 센서 1개: GPIO10(SPI0_MOSI 신호), GPIO9(SPI0_MISO 신호), GPIO11(SPI0_SCLK 신호), GPIO8(SPI0_CE0 신호)
  * ADC-MCP3202칩 1개
  * 초음파 센서 1개: GPIO20(Trig 핀), GPIO16(Echo 핀) 
  * 온습도 센서 1개: GPIO2(DA 핀), GPIO3(CL핀)
  * 전등(조도센서) 제어를 위한 LED: GPIO25
  * 수도(초음파센서) 제어를 위한 LED: GPIO14
  * 난방(온습도센서) 제어를 위한 LED: GPIO6

- ### 🌟 소프트웨어
  * #### pi 홈 디렉토리
    * **app.py**: 플라스크 앱으로서, 웹 브라우저로부터의 접속을 수용하고 요청을 처리하는 메서드
    * **mqtt.py**: mqtt 통신을 이용하여 시스템을 관리하는 코드, 브라우저에서 구독한 topic에 대한 메시지를 받아 이를 다시 circuit*.py에 전송.
카메라, 조도 센서, 초음파 센서, 온습도 센서로부터 0.5초 간격으로 값을 읽어 mqtt를 이용하여 mosquitto로 전송하며 mosquitto는 수신한 값들을 웹브라우저로 다시 전송.

    * **camera.py**: 카메라를 제어하는 파이선 코드
    * **circuitLight.py**: 전등 시스템을 총괄하는 파이선 코드, 조도센서를 통해 저항값을 계산하여 전등 led를 제어하고 전기 요금을 계산
    * **circuitUltrasonic.py**: 수도 시스템을 총괄하는 파이선 코드, 초음파센서를 통해 물체와의 거리를 측정하여 수도 led를 제어하고 수도 요금을 계산
    * **circuitTemperature.py**: 난방 시스템을 총괄하는 파이선 코드, 온습도센서를 통해 현재 온도를 측정하여 난방 led를 제어하고 난방 요금을 계산
      
  * #### templates
    * **main.html**: 전등, 수도, 난방 제어 및 실시간 요금 모니터링 홈페이지, 사용자의 PC 또는 스마트폰에서 실행
    * **cctv.html**: cctv 화면을 보여주는 html 파일

  * #### static
    * **mqttio.js**: paho 라이브러리를 사용하여 mqtt 브로커에 접속하는 자바스크립트 파일
    * **image.js**: 이미지를 브라우저로 전송하는 자바스크립트 파일
    * **myChart.js**: 실시간 전기, 수도, 난방 요금에 대한 차트를 그리는 자바스크립트 파일
    * **myStyle.css**: 홈페이지를 꾸미는 css 파일
 <br><br>


## 🖥 회로도
<img width="1000" height="800" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/7854832a-c145-45c1-84b0-c1d84a8a4776">
<br><br>

## 🖥 디렉터리 구조
<img width="1000" height="500" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/90141919-19af-456d-8685-e29ed523e72c">
<br><br>

## 🖥 응용 시스템 구상
<img width="1000" height="500" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/8af1fdf2-b5fe-45b6-a987-17cec9fdb55e">
<br><br>

## 🖥 실행 과정 및 결과
초기화면 <br>
<img width="1000" height="500" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/2ba9b78b-ca58-45ce-8062-6c60daee3fbb">

시스템 시작 버튼을 클릭한 후 시스템에 연결한 뒤 CCTV 시작 버튼을 클릭했을 때 <br>
<img width="1000" height="500" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/c535e831-3287-4f36-aa36-9e80224d3029">

자동제어 ON 버튼을 클릭한 뒤 전등 시스템 제어, 수도 시스템 제어, 난방 시스템 제어에서 on버튼을 클릭한 뒤. 사람이 없기 때문에 led 불이 자동으로 꺼짐 <br>
<img width="1000" height="1000" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/0d098a39-5ec3-44e6-9836-778eed90b3d3">

전등 시스템 제어에서 on 버튼을 클릭하고 조도센서에 후레쉬를 비춰 불이 켜진 상태로 가정 <br>
<img width="1000" height="1000" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/bf51651b-02cb-47cd-ae9b-6fc0220e3578">

전등 알림 버튼 클릭시 현재 전등이 켜져있기 때문에 전등을 끄겠냐는 알림창이 뜸. <br>
<img width="1000" height="1000" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/939a59e4-0f9f-4f4e-b34a-9bd28d065b79">

확인을 누르면 자동으로 전등 led가 꺼짐 <br>
<img width="1000" height="1000" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/6e2901d9-0ef8-4d8e-a5d5-9db28139728f">

목표요금과 알림 받을 퍼센트를 설정하고 전기 요금 버튼을 클릭하면 실시간 전기 요금을 차트를 통해 확인 가능 <br>
<img width="1000" height="1000" alt="image" src="https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/c4d2394f-a70e-4148-abbc-f18744622335">

## ⭐ 시연 영상
https://github.com/mmije0ng/SmartHomeControlService/assets/127730905/bed0a0a2-c4a7-4c54-bb7e-eb3b058b9c75
