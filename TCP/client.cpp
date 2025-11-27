#include <winsock2.h>
#include <iostream>
#include <string>

#pragma comment(lib, "ws2_32.lib")

int main() {

    // 1. Start Winsock
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    // 2. Create a socket
    SOCKET client = socket(AF_INET, SOCK_STREAM, 0);

    // 3. Prepare server address
    sockaddr_in server;
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr("127.0.0.1"); // Localhost
    server.sin_port = htons(8080); // Port

    // 4. Connect to server
    connect(client, (sockaddr*)&server, sizeof(server));
    std::cout << "Connected to server!\n";

    char buffer[1024];
    std::string text;

    // 5. Chat loop
    while (true) {
        std::cout << "Enter message (or 'exit'): ";
        std::getline(std::cin, text);

        if (text == "exit")
            break;

        // Send message
        send(client, text.c_str(), text.length(), 0);

        // Receive reply
        int len = recv(client, buffer, sizeof(buffer) - 1, 0);
        buffer[len] = '\0';

        std::cout << "Server: " << buffer << "\n";
    }

    // 6. Close socket
    closesocket(client);
    WSACleanup();

    return 0;
}
