import numpy as np
import pandas as pd
import time
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

def oneIter(data1, target):
    X_train, X_test, y_train, y_test = train_test_split(data1, target, test_size=0.2)
    knn = KNeighborsClassifier(n_neighbors=5, algorithm='kd_tree')
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    accuracy = knn.score(X_test, y_test)
    return accuracy

df1 = pd.read_csv('liver_disorders.csv') 
df1.columns = ['mcv','alkphos','sgpt','sgot','gammagt','drinks','selector']

data1 = df1[['mcv','alkphos','sgpt','sgot','gammagt','drinks']].values
target1 = df1['selector']

iterations1 = 100
total1 = 0.0000
timer1 = 0.0000
for i in range(iterations1):

    start_time1 = time.perf_counter()
    acc1 = oneIter(data1, target1)
    end_time1 = time.perf_counter()
    time_taken1 =  end_time1 - start_time1
    
    total1 = total1 + acc1
    timer1 = timer1 + time_taken1

avgAccuracy1 = total1 / iterations1
avgTimeTaken1 = timer1 / iterations1

print("Avverage Accuracy: ", avgAccuracy1)
print("Average Time Taken: ", avgTimeTaken1)