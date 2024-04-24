import numpy as np
import pandas as pd
import time
from sklearn.neighbors import KNeighborsClassifier
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
#trad
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

def oneIter1(data, target, k):
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
objects=[]
def trad():
    global total, timer  # Declare total and timer as global variables

    for i in range(iterations):

        start_time = time.perf_counter()
        acc = oneIter1(data, target, k)
        end_time = time.perf_counter()
        time_taken =  end_time - start_time
    
        total = total + acc
        timer = timer + time_taken

    avgAccuracy = total / iterations
    avgTimeTaken = timer / iterations
    obj = {'x': avgTimeTaken, 'y': avgAccuracy}
    objects.append(obj)
#

#kdtree
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
objects1=[]
def kdtree():
    global total1, timer1  # Declare total and timer as global variables

    for i in range(iterations1):

        start_time1 = time.perf_counter()
        acc1 = oneIter(data1, target1)
        end_time1 = time.perf_counter()
        time_taken1 =  end_time1 - start_time1
    
        total1 = total1 + acc1
        timer1 = timer1 + time_taken1

    avgAccuracy1 = total1 / iterations1
    avgTimeTaken1 = timer1 / iterations1

    obj1 = {'x': avgTimeTaken1, 'y': avgAccuracy1}
    objects1.append(obj1)

#
#balltree
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
objects2=[]
def balltree():
    global total2, timer2  # Declare total and timer as global variables

    for i in range(iterations2):

        start_time2 = time.perf_counter()
        acc2 = oneIter(data2, target2)
        end_time2 = time.perf_counter()
        time_taken2 =  end_time2 - start_time2
    
        total2 = total2 + acc2
        timer2 = timer2 + time_taken2

    avgAccuracy2 = total2 / iterations2
    avgTimeTaken2 = timer2 / iterations2

    obj2 = {'x': avgTimeTaken2, 'y': avgAccuracy2}
    objects2.append(obj2)

#

#main

#calls

for i in range(12):
    trad()
    kdtree()
    balltree()

# Function to plot objects
def plot_objects(objects, color, connect_dots=True):
    x_values = [obj['x'] for obj in objects]
    y_values = [obj['y'] for obj in objects]
    plt.scatter(x_values, y_values, color=color)
    if connect_dots:
        plt.plot(x_values, y_values, color=color)



# Plot objects
plot_objects(objects, 'red')
plot_objects(objects1, 'green')
plot_objects(objects2, 'blue')

# Set labels and show plot
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Objects Plot')

plt.show()

