
import sys

#Read data from stdin
def read_in():
    lines = sys.argv
    return lines

def main(lines):
    print("Output from Python") 
    print("First name: " + lines[1]) 
    print("Last name: " + lines[2]) 

#start process
if __name__ == '__main__':
    lines = read_in()
    main(lines)