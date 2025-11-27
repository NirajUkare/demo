#include <winsock2.h>
#include <iostream>
#include <string>
#include <cmath>

#pragma comment(lib, "ws2_32.lib")

#define PORT 9001
#define BUF_SIZE 1024

// Convert degrees to radians if needed
double toRadians(double value, bool isDeg) {
    return isDeg ? value * M_PI / 180.0 : value;
}

int main() {
    // 1. Start Winsock
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        std::cout << "WSAStartup failed!\n";
        return 1;
    }

    // 2. Create UDP socket
    SOCKET serverSocket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (serverSocket == INVALID_SOCKET) {
        std::cout << "Socket creation failed!\n";
        WSACleanup();
        return 1;
    }

    // 3. Server address
    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(PORT);

    // 4. Bind
    if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cout << "Bind failed!\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    std::cout << "UDP Math Server listening on port " << PORT << "...\n";

    char buffer[BUF_SIZE];
    sockaddr_in clientAddr{};
    int clientLen = sizeof(clientAddr);

    // 5. Receive → Process → Reply loop
    while (true) {

        int bytes = recvfrom(serverSocket, buffer, BUF_SIZE - 1, 0,
                             (sockaddr*)&clientAddr, &clientLen);

        if (bytes == SOCKET_ERROR) {
            std::cout << "recvfrom failed!\n";
            break;
        }

        buffer[bytes] = '\0';  // Null terminate
        std::string input = buffer;

        // "quit" command ends server
        if (input == "quit") {
            std::cout << "Client requested shutdown.\n";
            break;
        }

        // Expected format: <func> <value> <unit>
        // Example: sin 30 deg
        char func[10], unit[10] = "rad";
        double value = 0;

        sscanf(buffer, "%s %lf %s", func, &value, unit);

        bool isDeg = (strcmp(unit, "deg") == 0);
        double result = 0;
        std::string reply;

        // Math functions
        if (strcmp(func, "sin") == 0)
            result = sin(toRadians(value, isDeg));
        else if (strcmp(func, "cos") == 0)
            result = cos(toRadians(value, isDeg));
        else if (strcmp(func, "tan") == 0)
            result = tan(toRadians(value, isDeg));
        else
            reply = "Invalid function";

        if (reply.empty())
            reply = "Result: " + std::to_string(result);

        // Send reply
        sendto(serverSocket, reply.c_str(), reply.size(), 0,
               (sockaddr*)&clientAddr, clientLen);
    }

    // 6. Cleanup
    closesocket(serverSocket);
    WSACleanup();
    return 0;
}
