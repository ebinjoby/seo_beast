
import multiprocessing as mp
import time

def init(val1, val2, leng):

    global counter
    global tracker
    global length
    counter = val1
    tracker = val2
    length = leng
    

def decompose(data):

    global counter
    global tracker
    global length

    with counter.get_lock():
        counter.value += 1
        if round(counter.value*100/length)%10 == 0:
            if round(counter.value*100/length)/10 == tracker.value:
                tracker.value += 1
                print(str(round(counter.value*100/length)) + ' %')

    time.sleep(0.01) # to simulate some processing happening here
    return data**2


def analyze(Input_list):

    start = time.time()

    n_jobs = mp.cpu_count()
    print('\n\nSplitting the process among ' + str(n_jobs) + ' CPU threads. Processing:\n\n')

    counter = mp.Value('i', 0)
    tracker = mp.Value('i', 0)
    total = len(Input_list)

    pool = mp.Pool(processes = n_jobs, initializer = init, initargs = (counter, tracker, total))
    pool_results = pool.map(decompose, Input_list, chunksize = 1)
    pool.close()
    pool.join()

    results = pool_results
    print('\n\nResults: ' + str(len(results)))

    end = time.time()
    print("Time Taken: " +  str(round(end-start, 2)) + ' seconds\n\n')



if __name__ == '__main__':

    inputs = list(range(1, 34829))
    analyze(inputs)



