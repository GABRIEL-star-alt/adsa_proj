import numpy as np
import pandas as pd
import time
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

def oneIter(data, target):
    X_train, X_test, y_train, y_test = train_test_split(data, target, test_size=0.2)
    knn = KNeighborsClassifier(n_neighbors=5, algorithm='kd_tree')
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    accuracy = knn.score(X_test, y_test)
    return accuracy

df = pd.read_csv('liver_disorders.csv') 
df.columns = ['mcv','alkphos','sgpt','sgot','gammagt','drinks','selector']

data = df[['mcv','alkphos','sgpt','sgot','gammagt','drinks']].values
target = df['selector']

iterations = 100
total = 0.0000
timer = 0.0000
for i in range(iterations):

    start_time = time.perf_counter()
    acc = oneIter(data, target)
    end_time = time.perf_counter()
    time_taken =  end_time - start_time
    
    total = total + acc
    timer = timer + time_taken

avgAccuracy = total / iterations
avgTimeTaken = timer / iterations

print("Avverage Accuracy: ", avgAccuracy)
print("Average Time Taken: ", avgTimeTaken)