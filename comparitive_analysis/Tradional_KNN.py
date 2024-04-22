import numpy as np
import pandas as pd
import time
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer 

def euclidean_distance(x1, x2):
    return np.sqrt(np.sum((x1 - x2) ** 2))

def predict_knn(X_train, y_train, X_test, k):
    y_pred = np.zeros(X_test.shape[0])
    for i, x in enumerate(X_test):
        distances = np.array([euclidean_distance(x, train) for train in X_train])
        nearest_neighbors = np.argsort(distances)[:k]
        neighbor_labels = y_train[nearest_neighbors]
        y_pred[i] = np.argmax(np.bincount(neighbor_labels))
    return y_pred

def oneIter(data, target, k):
    X_train, X_test, y_train, y_test = train_test_split(data, target, test_size=0.2)
    y_pred = predict_knn(X_train, y_train, X_test, k)
    accuracy = accuracy_score(y_test, y_pred)
    return accuracy

df = pd.read_csv('liver_disorders.csv')
df.columns = ['mcv', 'alkphos', 'sgpt', 'sgot', 'gammagt', 'drinks', 'selector']

# Handle missing values (if any)
imputer = SimpleImputer(strategy='mean')
df[['mcv', 'alkphos', 'sgpt', 'sgot', 'gammagt', 'drinks']] = imputer.fit_transform(df[['mcv', 'alkphos', 'sgpt', 'sgot', 'gammagt', 'drinks']])

data = df[['mcv', 'alkphos', 'sgpt', 'sgot', 'gammagt', 'drinks']].values
target = df['selector'].values

k = 3
iterations = 100
total = 0.0000
timer = 0.0000

for i in range(iterations):

    start_time = time.perf_counter()
    acc = oneIter(data, target, k)
    end_time = time.perf_counter()
    time_taken =  end_time - start_time
    
    total = total + acc
    timer = timer + time_taken

avgAccuracy = total / iterations
avgTimeTaken = timer / iterations

print("Avverage Accuracy: ", avgAccuracy)
print("Average Time Taken: ", avgTimeTaken)


