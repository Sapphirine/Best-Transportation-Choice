#!/usr/bin/env python
####################################################
# Columbia University
# Department of Electrical Engineering
# Big Data - Final Project
# Fall 2014
# Andre Cunha
# Joseph Machado 
# Xia Shang
# Zhao Pan
####################################################
import sys

def main(separator='\t'):
    # input comes from STDIN (standard input)
    # read lines
    for line in sys.stdin:
	# remove leading and trailing whitespace
	line = line.strip()
	# split the line into words
        csv = line.split(',')
        # Write the results to STDOUT (standard output);
        # what we output here will be the input for the
        # Reduce step, i.e. the input for reducer.py
        #
        # csv[2] = Line
        # csv[23] = station_id
        # csv[15] = time, format 12:00:00 PM
        # csv[24] = delay, format 00:00 minutes
        try:
	    time = csv[15].split(':')
	    am_pm = time[2].split(' ')
	    time = time[0]+am_pm[1]
	    
	    minute,second = csv[24].split(':')
	    
	    if '-' in minute:
		delay = int(minute)*60 - int(second)
	    else:
		delay = int(minute)*60 + int(second)
	    
	    if (delay < 1500) and (delay > -1500):
		print '%s,%s,%s%s%d' % (csv[2],csv[23],time, separator, delay)
	except:
	    pass
	    

if __name__ == "__main__":
    main()
