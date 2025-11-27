#include <winsock2.h>
#include <iostream>
#include <string>

#pragma comment(lib, "ws2_32.lib")

#define BUF_SIZE 1024

int main(int argc, char* argv[]) {

    // Check arguments
    if (argc != 3) {
        std::cout << "Usage: " << argv[0] << " <server_ip> <port>\n";
        return 1;
    }

    std::string serverIP = argv[1];
    int port = atoi(argv[2]);

    // Start Winsock
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        std::cout << "WSAStartup failed\n";
        return 1;
    }

    // Create UDP socket
    SOCKET sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock == INVALID_SOCKET) {
        std::cout << "Socket creation failed\n";
        WSACleanup();
        return 1;
    }

    // Server address
    sockaddr_in server;
    server.sin_family = AF_INET;
    server.sin_port = htons(port);
    server.sin_addr.s_addr = inet_addr(serverIP.c_str());

    char buffer[BUF_SIZE];
    int serverLen = sizeof(server);

    while (true) {

        // --- Send message ---
        std::string msg;
        std::cout << "Enter message: ";
        std::getline(std::cin, msg);

        sendto(sock, msg.c_str(), msg.size(), 0, (sockaddr*)&server, serverLen);

        if (msg == "exit") {
            std::cout << "Client exiting...\n";
            break;
        }

        // --- Receive reply ---
        int bytes = recvfrom(sock, buffer, BUF_SIZE - 1, 0, (sockaddr*)&server, &serverLen);
        buffer[bytes] = '\0';

        std::cout << "Server: " << buffer << std::endl;

        if (std::string(buffer) == "exit") {
            std::cout << "Server requested exit. Closing client...\n";
            break;
        }
    }

    closesocket(sock);
    WSACleanup();

    return 0;
}
