import time
import RPi.GPIO as GPIO
import Adafruit_MCP3008

light = False #전등 led의 상태를 파악하기 위한 변수
initLux=0 #초기 저항값을 저장하기 위한 변수
initState="lightOff" #초기 전등 상태가 켜져있던 상태면 lightOff, 꺼져있던 상태면 lightOn

#전등 led를 키고 끄는 함수
# led 번호의 핀에 on_off(0/1) 값 출력하는 함수
def controlLED(on_off):
    global light
    GPIO.output(led, on_off)
    if on_off == 1:
        light = True #led가 켜진 상태
    else:
        light = False #led가 꺼진 상태

#전등 led를 끄기 위한 함수
def ledOff():
    global light
    GPIO.output(led, 0)
    light = False

#현재 led가 켜져있는지 꺼져있는지을 파악하기 위한 함수
def getLedState():
    return light;
    
#조도센서로 측정한 저항값을 얻기 위한 함수
def getLux():
    lux= mcp.read_adc(0)
    return lux
 
#초기 저항값을 저장하기 위한 함수   
def setInitLux(msg):
    global initLux
    initLux=msg
 
#초기 전등상태를 저장하기 위한 함수   
def setInitState(msg):
    global initState
    initState=msg

#전기 요금을 계산하는 함수
def getCharge(lux, charge):
    #초기에 전등이 켜져있던 상태이면
    if(initState=="lightOn"):
        #현재 led가 켜져있고 초기 저항값보다 현재 저항값이 높으면
        #저항값에 따라 요금을 다르게 계산
        if(light == True and initLux <= lux+50):
            if(lux>=1 and lux<=200):
                charge+=93
            elif(lux>200 and lux<=400):
                charge+=187
            else:
                charge+=280

    #초기에 전등이 꺼져있던 상태이면
    else:
        #현재 led가 켜져있고 초기 저항값보다 현재 저항값이 높으면
        #저항값에 따라 요금을 다르게 계산
        if(light ==True and initLux+50<=lux):
            if(lux>=1 and lux<=200):
                charge+=93
            elif(lux>200 and lux<=400):
                charge+=187
            else:
                charge+=280
    #그래프의 동적 변화를 위해 현재 led가 꺼져 있고 요금이 0보다 높으면 요금을 감소
    if(light==False and charge>0):
        charge-=10
    return charge

mcp = Adafruit_MCP3008.MCP3008(clk=11, cs=8, miso=9, mosi=10)
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# LED를 다루기 위한 전역 변수 선언 및 초기화
led = 25  # GPIO25
GPIO.setup(led, GPIO.OUT)
