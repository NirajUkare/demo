#include <winsock2.h>
#include <iostream>
#include <string>

#pragma comment(lib, "ws2_32.lib")

#define BUF_SIZE 1024

int main(int argc, char* argv[]) {

    // Check input format
    if (argc != 3) {
        std::cout << "Usage: " << argv[0] << " <server_ip> <port>\n";
        return 1;
    }

    // Start Winsock
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        std::cout << "WSAStartup failed!\n";
        return 1;
    }

    // Create UDP socket
    SOCKET clientSocket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (clientSocket == INVALID_SOCKET) {
        std::cout << "Socket creation failed!\n";
        WSACleanup();
        return 1;
    }

    // Server address
    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(atoi(argv[2]));   // port
    serverAddr.sin_addr.s_addr = inet_addr(argv[1]); // ip

    char buffer[BUF_SIZE];
    int serverLen = sizeof(serverAddr);

    // Communication loop
    while (true) {

        std::string message;
        std::cout << "Enter: sin 30 deg | cos 1 rad | tan 60 deg | quit\n> ";
        std::getline(std::cin, message);

        // Send to server
        sendto(clientSocket, message.c_str(), message.size(), 0,
               (sockaddr*)&serverAddr, serverLen);

        // Quit condition
        if (message == "quit") {
            std::cout << "Client exiting...\n";
            break;
        }

        // Receive response
        int bytes = recvfrom(clientSocket, buffer, BUF_SIZE - 1, 0,
                             (sockaddr*)&serverAddr, &serverLen);

        if (bytes == SOCKET_ERROR) {
            std::cout << "recvfrom failed!\n";
            break;
        }

        buffer[bytes] = '\0'; // Null terminate
        std::cout << "Server: " << buffer << "\n";
    }

    closesocket(clientSocket);
    WSACleanup();
    return 0;
}
