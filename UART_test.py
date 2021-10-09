import subprocess
import socket 
from datetime import datetime as timer
from datetime import timedelta
import time
import csv

def main():
    count = 1
    with open('UART_ping_time.csv','w', newline='') as csvfile:
        writer = csv.writer(csvfile)

        writer.writerow(["trial","start time","finish time","elapsed time"])

        outputs = subprocess.Popen("nios2-terminal", shell=True, stdout=subprocess.PIPE)

        while count < 1000:
            start = timer.now()
            val = outputs.stdout.read(1)
            val = val.decode("utf-8")
            finish = timer.now()
            elapse = finish - start

            start = start.strftime("%m/%d/%Y, %H:%M:%S")
            finish = finish.strftime("%m/%d/%Y, %H:%M:%S")
            elapse = str(elapse)
            data_list = [start,finish,elapse]
            tmp = [count]
            tmp.extend(data_list)
            writer.writerow(tmp)

            count += 1
    
if __name__ == '__main__':
    main()
