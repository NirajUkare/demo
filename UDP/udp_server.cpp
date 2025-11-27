#include <winsock2.h>
#include <iostream>

#pragma comment(lib, "ws2_32.lib")

#define PORT 9000
#define BUF_SIZE 1024

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

    // 3. Server address setup
    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(PORT);

    // 4. Bind socket to port
    if (bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cout << "Bind failed!\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    std::cout << "UDP Server running on port " << PORT << "...\n";

    // 5. Buffer for receiving data
    char buffer[BUF_SIZE];
    sockaddr_in clientAddr{};
    int clientAddrSize = sizeof(clientAddr);

    // 6. Receive and reply loop
    while (true) {

        // Receive data
        int bytesReceived = recvfrom(serverSocket, buffer, BUF_SIZE - 1, 0,
                                     (sockaddr*)&clientAddr, &clientAddrSize);

        if (bytesReceived == SOCKET_ERROR) {
            std::cout << "recvfrom failed!\n";
            break;
        }

        buffer[bytesReceived] = '\0';  // Null terminate
        std::cout << "Client says: " << buffer << "\n";

        if (std::string(buffer) == "exit") {
            std::cout << "Client requested exit. Stopping server...\n";
            break;
        }

        // Reply back
        std::string reply;
        std::cout << "Enter reply: ";
        std::getline(std::cin, reply);

        sendto(serverSocket, reply.c_str(), reply.size(), 0,
               (sockaddr*)&clientAddr, clientAddrSize);

        if (reply == "exit") {
            std::cout << "Server exiting...\n";
            break;
        }
    }

    // 7. Cleanup
    closesocket(serverSocket);
    WSACleanup();
    return 0;
}

