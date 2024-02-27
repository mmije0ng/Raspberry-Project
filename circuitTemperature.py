import time
import RPi.GPIO as GPIO
from adafruit_htu21d import HTU21D
import busio

heating=False #난방 led의 상태를 파악하기 위한 변수
setTemperature=22 #난방 설정 온도를 초기에 22도로 설정

# 난방 LED를 켜고 끄는 함수
# led 번호의 핀에 on_off(0/1) 값 출력하는 함수
def controlLED(on_off):  
	global heating
	GPIO.output(led, on_off)
	if(on_off == 1):
		heating=True
	else:

		heating=False
#난방 led를 끄는 함수		
def ledOff():
    global heating
    GPIO.output(led,0)
    heating=False

#난방 설정 온도를 저장   
def setHeaterTemperature(msg):
	global setTemperature
	setTemperature=msg

# 센서로부터 온도 값을 수신하여 리턴하는 함수
def getTemperature() :
	return float(sensor.temperature)   

#난방 요금 계산	
def getPrice(currentTemperature, charge): #현재 온도, 요금합
	currentTemperature=float(currentTemperature) #현재온도
	
	#난방(led)이 켜져있다면 
	if(heating==True):
		#현재 온도가 난방(설정) 온도보다 높으면 요금이 올라감
		if(currentTemperature>setTemperature):
			charge+=150
		else:
			charge+=250
	if(heating==False and charge>0):
		charge-=50
	return charge;		

# 온습 센서를 다루기 위한 전역 변수 선언 및 초기화
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
sda = 2
scl = 3
i2c = busio.I2C(scl, sda)
sensor = HTU21D(i2c)

# LED를 다루기 위한 전역 변수 선언 및 초기화
led = 6 # GPIO6
GPIO.setup(led, GPIO.OUT)  # GPIO6 핀을 출력으로 지정
