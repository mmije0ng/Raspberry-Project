import paho.mqtt.client as mqtt
import io
import time
from PIL import Image
import cv2
import camera
import base64
import circuitLight
import circuitUltrasonic
import circuitTemperature
import RPi.GPIO as GPIO

isStart = False #카메라가 켜졌는지 확인하기 위한 변수
isAutoControlStart=False #자동제어가 시작됐는지 확인하기 위한 변
isPeopleExist=False #사람이 있는지 (카메라에 사람이 인식되었는지) 확인하는 변수

def controlAutoLed(isPeopleExist):
    #사람이 없고 전등 led가 켜져있다면
    if isPeopleExist is False and circuitLight.light:
        circuitLight.ledOff() #전등 led를 끄고
        #브로커에게 autoControl 자동제어 토픽에 대한 메세지로 offedLedLight 메시지를 보내
        #전등 led를 껐다는 것을 알려줌
        client.publish("autoControl", "offedLedLight", qos=0)

    #사람이 없고 수도 led가 켜져있다면
    if isPeopleExist is False and circuitUltrasonic.water:
        circuitUltrasonic.ledOff() #수도 led를 끄고
        #브로커에게 autoControl 자동제어 토픽에 대한 메세지로 offedLedUltrasonic 메시지를 보내
        #수도 led를 껐다는 것을 알려줌
        client.publish("autoControl", "offedLedUltrasonic", qos=0)

    #사람이 없고 난방 led가 켜져있다면
    if isPeopleExist is False and circuitTemperature.heating:
        circuitTemperature.ledOff() #난방 led를 끄고
        #브로커에게 autoControl 자동제어 토픽에 대한 메세지로 offedLedTemperature 메시지를 보내
        #난방 led를 껐다는 것을 알려줌
        client.publish("autoControl", "offedLedTemperature", qos=0)

#브로커와 연결될 때
def on_connect(client, userdata, flag, rc):
    client.subscribe("ledLight", qos=0) #전등 led 제어를 위한 ledLight 토픽 구독
    client.subscribe("ledUltrasonic", qos=0) #수도 led 제어를 위한 ledUltrasonic 토픽 구독
    client.subscribe("ledTemperature", qos=0) #난방 led 제어를 위한 ledTemperature 토픽 구독
    client.subscribe("initLux", qos=0) #초기 조도센서를 이용해 측정한 저항값을 파악하기 위한 initLux 토픽 구독
    client.subscribe("initState", qos=0) #초기 전등 상태를 파악하기 위한 initState 토픽 구독
    client.subscribe("autoControlStart",qos=0) #자동제어 시작을 알기 위한 autoControlStart 토픽 구독
    client.subscribe("autoControlEnd",qos=0) #자동제어 해제를 알기 위한 autoControlEnd 토픽 구독
    client.subscribe("setTemperature", qos=0) #난방 설정 온도를 알기 위한 setTemperature 토픽 구독
    client.subscribe("camera",qos=0) #cctv를 위한 camera 토픽 구독

#브로커에게 메시지를 받았을 때
def on_message(client, userdata, msg):
    global isStart
    global isAutoControlStart

    #ledLight 토픽에 대한 메시지를 받으면 전등 led를 제어
    if msg.topic == "ledLight":
        on_off = int(msg.payload)
        circuitLight.controlLED(on_off)

    #ledUltrasonic 토픽에 대한 메시지를 받으면 수도 led를 제어
    elif msg.topic == "ledUltrasonic":
        on_off = int(msg.payload)
        circuitUltrasonic.controlLED(on_off)

    #ledTemperature 토픽에 대한 메시지를 받으면 난방 led를 제어
    elif msg.topic == "ledTemperature":
        on_off = int(msg.payload)
        circuitTemperature.controlLED(on_off)

    #initLux 토픽에 대한 메시지를 받으면 
    #전기 요금을 계산하기 위해 초기 저항값을 저장
    elif msg.topic == "initLux":
        circuitLight.setInitLux(int(msg.payload))

    #initState 토픽에 대한 메시지를 받으면 
    #전기 요금을 계산하기 위해 초기 전등상태를 저장
    elif msg.topic == "initState":
        circuitLight.setInitState(str(msg.payload))

    #setTemperature 토픽에 대한 메시지를 받으면
    #현재 난방 설정 온도를 저장
    elif msg.topic == "setTemperature":
        setTemperature = int(msg.payload)
        circuitTemperature.setHeaterTemperature(setTemperature)
        
    #autoControlStart 토픽에 대한 메시지를 받으면 자동제어 시작
    elif msg.topic=="autoControlStart":
        isAutoControlStart=True
        
    #autoControlEnd 토픽에 대한 메시지를 받으면 자동제어 해제
    elif msg.topic=="autoControlEnd":
        isAutoControlStart=False

    elif msg.payload.decode('utf-8') == 'start':
        isStart = True
        print("Start Camera")
    else:
        isStart = False

ip = "localhost"
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(ip, 1883)
client.loop_start()

lightCharge = 0 #전기요금
ultrasonicCharge = 0 #수도요금
temperatureCharge = 0 #난방요금

camera.init() #카메라 초기화

try:
    while True:
        #isStart가 true이면 cctv(카메라) 시작
        if isStart:
            frame = camera.take_picture()

            stream = io.BytesIO()
            Image.fromarray(frame).save(stream, format='JPEG')

            stream.seek(0)
            base64Image = base64.b64encode(stream.read())
            asciiImage = base64Image.decode('ascii')

            client.publish("image", asciiImage, qos=0)
        else:
            print("wait camera")
    
        #카메라를 통해 사람의 유무를 파악    
        isPeopleExist=camera.getPeopleExist();
   
        #자동제어가 시작되면 사람의 유무와 led 전원의 유무를 통해 제어 시작
        if isAutoControlStart == True:
            controlAutoLed(isPeopleExist)

        #초기 전등 상태를 파악하여 ledLightState 토픽에 대한 메시지로 publish 
        ledLightState = circuitLight.getLedState()
        client.publish("ledLightState", ledLightState, qos=0)

        #초기 저항값을 측정하여 initLux 토픽에 대한 메시지로 publish
        initLux = circuitLight.getLux() 
        client.publish("initLux", initLux, qos=0)

        #현재 조도센서로 측정한 저항값을 light 토픽에 대한 메시지로 publish
        currentLux = circuitLight.getLux()
        client.publish("light", currentLux, qos=0)

        #현재 전기 요금을 측정하여 lightCharge 토픽에 대한 메시지로 publish
        lightCharge = circuitLight.getCharge(currentLux, lightCharge)
        client.publish("lightCharge", lightCharge, qos=0)

        #현재 초음파 센서와 물체의 거리를 측정하여
        #수도 강도를 파악해 ultrasonic 토픽에 대한 메시지로 publish
        distance = circuitUltrasonic.measure_distance()
        strength = circuitUltrasonic.getStrength(distance)
        client.publish("ultrasonic", strength, qos=0)

        #수도 강도에 따른 현재 수도 요금을 측정하여 ultrasonicCharge 토픽에 대한 메시지로 publish
        ultrasonicCharge = circuitUltrasonic.getPrice(strength, ultrasonicCharge)
        client.publish("ultrasonicCharge", ultrasonicCharge, qos=0)

        #현재 온도를 측정하여 temperature 토픽에 대한 메시지로 publish
        currentTemperature = circuitTemperature.getTemperature()
        client.publish("temperature", currentTemperature, qos=0)

        #현재 전기 요금을 측정하여 temperatureCharge 토픽에 대한 메시지로 publish
        temperatureCharge = circuitTemperature.getPrice(currentTemperature, temperatureCharge)
    
        client.publish("temperatureCharge", temperatureCharge, qos=0)

        time.sleep(0.5)
        
except KeyboardInterrupt:  
    print('종료') 
    print("clean up")
    GPIO.cleanup() #사용한 핀을 모두 입력으로 초기화
    camera.final() #카메라 닫기
    
finally:
    client.loop_stop()
    client.disconnect() #브로커와 연결 해제
