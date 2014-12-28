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

from itertools import groupby
from operator import itemgetter
import sys

def read_mapper_output(file, separator='\t'):
    for line in file:
        yield line.split(separator, 1)

class rank:
   def __init__(self, name):
      self.name = name
      self.count = 0
      self.delay = 0
   
# end of class rank

def sort_delay(item):
    return item.count
  
def main(separator='\t'):
    # input comes from STDIN (standard input)
    data = read_mapper_output(sys.stdin, separator=separator)
    # groupby groups multiple word-count pairs by word,
    # and creates an iterator that returns consecutive keys and their group:
    #   current_word - string containing a word (the key)
    #   group - iterator yielding all ["&lt;current_word&gt;", "&lt;count&gt;"] items
    for current_word, group in groupby(data, itemgetter(0)):
	count = 0
	avg = 0
	
	A = rank('A')
	B = rank('B')
	C = rank('C')
	D = rank('D')
	
        try:
	    for current_word, delay2 in group:
		count += 1
		delay = int(delay2)
		
		if (delay > -30):
		    A.delay += delay
		    A.count += 1
		    
		if (delay < -31) and (delay > -80):
		    B.delay += delay
		    B.count += 1
		    
		if (delay < -81) and (delay > -120):
		    C.delay += delay
		    C.count += 1
		    
		if (delay < -121):
		    D.delay += delay
		    D.count += 1
	    # end for
	    
	    a = [A,B,C,D]
	    b = sorted(a, key=sort_delay)
	    c = [0.10,0.23,0.27,0.40]
	    aux = 0
	    for x in b:
		if (x.count != 0):
		    avg += float(x.delay/x.count)*c[aux]
		
		aux += 1
	    # end for 
            print "%s%s%.2f,%.2f,%.2f,%.2f, avg  = %.2f, grade = %s" % (current_word, separator, float(A.count)/float(count),float(B.count)/float(count),float(C.count)/float(count),float(D.count)/float(count),avg,b[3].name)
        except ValueError:
            # delay was not a number, so silently discard this item
            pass

if __name__ == "__main__":
    main()
