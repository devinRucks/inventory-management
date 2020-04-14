import RPi.GPIO as GPIO
import time

# { (ROW, COLUMN): PIN }
leds = {(1, 1): 11, (1, 3): 12, (1, 4): 15, (2, 2): 16}


def turnOnLED(row, column):
    for key in leds.keys():
        if key == (row, column):
            # make ledPin output HIGH level to turn on led
            GPIO.output(leds[key], GPIO.HIGH)
#             time.sleep(5)
#             turnOffLED(leds[key])


def turnOffLED(row, column):
    for key in leds.keys():
        if key == (row, column):
            #             GPIO.output(ledPin, GPIO.LOW) #make ledPin output LOW level to turn off led
            GPIO.output(leds[key], GPIO.LOW)


def setup():
    GPIO.setmode(GPIO.BOARD)   # use PHYSICAL GPIO numbering
    print("test")
    for ledPin in leds.values():
        GPIO.setup(ledPin, GPIO.OUT)  # set the ledPin to OUTPUT mode
        GPIO.output(ledPin, GPIO.LOW)  # make ledPin output LOW level
#         print('using pin%d' %ledPin)


def destroy():
    GPIO.cleanup()  # Release all GPIO
