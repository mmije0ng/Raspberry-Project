import time
import RPi.GPIO as GPIO

water=False #수도 led가 켜져있는지 꺼져있는지 확인하기 위한 변수
THRESHOLD=54 #거리 측정 기준 값

# 수도 led를 켜고 끄는 함수
# led 번호의 핀에 on_off(0/1) 값 출력하는 함수
def controlLED(on_off):  
    global water;
    GPIO.output(led, on_off)
    if (on_off==1):
        water=True
    else:
        water=False

#수도 led를 끄는 함수       
def ledOff():
    global water
    GPIO.output(led,0)
    water=False

# 초음파 센서를 제어하여 물체와의 거리를 측정하여 거리 값 리턴하는 함수
def measure_distance():
    GPIO.output(trig, 1)  # trig 핀에 1(High) 출력
    GPIO.output(trig, 0)  # trig 핀에 0(Low) 출력. High->Low. 초음파 발사 지시

    while GPIO.input(echo) == 0:  # echo 핀 값이 0->1로 바뀔 때까지 루프
        pass

    # echo 핀 값이 1이면 초음파가 발사되었음
    pulse_start = time.time()  # 초음파 발사 시간 기록

    while GPIO.input(echo) == 1:  # echo 핀 값이 1->0으로 바뀔 때까지 루프
        pass

    # echo 핀 값이 0이 되면 초음파 수신하였음
    pulse_end = time.time()  # 초음파가 되돌아 온 시간 기록
    pulse_duration = pulse_end - pulse_start  # 경과 시간 계산

    return pulse_duration * 340 * 100 / 2  # 거리 계산하여 리턴(단위 cm)

#거리를 이용하여 수도의 강도를 설정하는 함수    
def getStrength(distance):
    if(water==False): #led가 꺼져있으면 수도가 꺼진 상태로 가정
        return "offed"
    if(distance>=THRESHOLD*0.5 and distance<=THRESHOLD): #수도가 '강'인 상태로 가정
       return "strong"
    elif (distance>=THRESHOLD*0.3 and distance<THRESHOLD*0.5): #수도가 '중간'인 상태로 가정
        return "medium"
    else: #수도가 '약'인 상태로 가정
        return "low"
 
#수도 강도에 따라 요금을 측정하는 함수   
def getPrice(strength,charge):
    if(water==True and strength=="low"):
        charge+=400
    elif(water==True and strength=="medium"):
        charge+=930
    elif(water==True and strength=="strong"):
        charge+=1420
    if(water==False and charge>0):
        charge-=200
    return charge
    
# 초음파 센서를 다루기 위한 전역 변수 선언 및 초기화
trig = 20  # GPIO20
echo = 16  # GPIO16
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(trig, GPIO.OUT)  # GPIO20 핀을 출력으로 지정
GPIO.setup(echo, GPIO.IN)  # GPIO16 핀을 입력으로 지정

# LED를 다루기 위한 전역 변수 선언 및 초기화
led = 14 # GPIO14
GPIO.setup(led, GPIO.OUT)  # GPIO14 핀을 출력으로 지정
