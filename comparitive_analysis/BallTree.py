import numpy as np
import pandas as pd
import time
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

def oneIter(data2, target):
    X_train, X_test, y_train, y_test = train_test_split(data2, target, test_size=0.2)
    knn = KNeighborsClassifier(n_neighbors=5, algorithm='ball_tree')
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    accuracy = knn.score(X_test, y_test)
    return accuracy


df2 = pd.read_csv('liver_disorders.csv') 
df2.columns = ['mcv','alkphos','sgpt','sgot','gammagt','drinks','selector']

data2 = df2[['mcv','alkphos','sgpt','sgot','gammagt','drinks']].values
target2 = df2['selector']

iterations2 = 100
total2 = 0.0000
timer2 = 0.0000
for i in range(iterations2):

    start_time2 = time.perf_counter()
    acc2 = oneIter(data2, target2)
    end_time2 = time.perf_counter()
    time_taken2 =  end_time2 - start_time2
    
    total2 = total2 + acc2
    timer2 = timer2 + time_taken2

avgAccuracy2 = total2 / iterations2
avgTimeTaken2 = timer2 / iterations2

print("Avverage Accuracy: ", avgAccuracy2)
print("Average Time Taken: ", avgTimeTaken2)
