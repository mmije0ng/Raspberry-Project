import sys
import time
import cv2
camera = None
faceClassifier = None
eyeClassifier = None
isPeopleExist=False

def init(camera_id=0, width=640, height=480, buffer_size=1):
	global camera
	global faceClassifier 
	global eyeClassifier 
	camera = cv2.VideoCapture(camera_id, cv2.CAP_V4L)
	faceClassifier = cv2.CascadeClassifier('../haarModels/haarcascade_frontalface_default.xml')
	eyeClassifier = cv2.CascadeClassifier('../haarModels/haarcascade_eye.xml')

	camera.set(cv2.CAP_PROP_FRAME_WIDTH, width)
	camera.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
	camera.set(cv2.CAP_PROP_BUFFERSIZE, buffer_size)

def take_picture(most_recent=False):
	global camera
	global isPeopleExist
	
	isPeopleExist=False
	# most_recent가 True이면 버퍼에 저장되어 있는 프레임을 전부 버리도록 한다.
	len = 0 if most_recent == False else camera.get(cv2.CAP_PROP_BUFFERSIZE)
	while(len > 0):
		camera.grab()	# 버퍼에 저장되어 있는 프레임을 버린다.
		len -= 1
	success, image = camera.read()
	image=cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
	
	# 이미지를 흑백으로 바꾸고 얼굴과 눈 탐지
	image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	faces = faceClassifier.detectMultiScale(image_gray,1.25,12) # 얼굴 탐지
	eyes = eyeClassifier.detectMultiScale(image_gray,1.25,12) # 눈 탐지
	# 노란색(0, 255, 255) 사각형으로 얼굴 표시
	for x, y, w, h in faces:
		cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 255), 4)
		isPeopleExist=True
	# 빨간색(0, 0, 255) 사각형으로 눈 표시
	for x, y, w, h in eyes:
		cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 4)
		isPeopleExist=True

	if not success:
		return None
		
	return image
	
def getPeopleExist():
	return isPeopleExist

def final():
	if camera != None:
		camera.release()
	camera = None
