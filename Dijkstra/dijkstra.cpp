#include <iostream>
using namespace std;

const int INF = 9999;
const int N = 5;

void dijkstra(int graph[N][N], int start) {

    int dist[N];
    bool visited[N];

    // Initialize
    for (int i = 0; i < N; i++) {
        dist[i] = INF;
        visited[i] = false;
    }

    dist[start] = 0;

    // Dijkstra Loop
    for (int i = 0; i < N - 1; i++) {

        int minDist = INF;
        int u = -1;

        // Pick nearest unvisited node
        for (int j = 0; j < N; j++) {
            if (!visited[j] && dist[j] < minDist) {
                minDist = dist[j];
                u = j;
            }
        }

        visited[u] = true;

        // Update neighbors
        for (int v = 0; v < N; v++) {
            if (!visited[v] && graph[u][v] > 0 && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    // Print Result
    cout << "\nShortest distances from node " << start << ":\n";
    for (int i = 0; i < N; i++) {
        cout << "To node " << i << " = " << dist[i] << endl;
    }
}

int main() {

    int graph[N][N] = {
        {0, 10, 0, 0, 5},
        {0, 0, 1, 0, 2},
        {0, 0, 0, 4, 0},
        {7, 0, 6, 0, 0},
        {0, 3, 9, 2, 0}
    };

    int startNode;

    cout << "Enter start node (0 to 4): ";
    cin >> startNode;

    if (startNode < 0 || startNode >= N) {
        cout << "Invalid node! Please enter between 0 and 4.\n";
        return 0;
    }

    dijkstra(graph, startNode);

    return 0;
}
