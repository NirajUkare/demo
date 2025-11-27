#include <winsock2.h>
#include <iostream>
#include <string>

#pragma comment(lib, "ws2_32.lib")

int main() {

    // 1. Start Winsock
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    // 2. Create a TCP socket
    SOCKET server = socket(AF_INET, SOCK_STREAM, 0);

    // 3. Server address setup
    sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = inet_addr("127.0.0.1"); // Host
    addr.sin_port = htons(8080);                  // Port

    // 4. Bind socket to IP + Port
    bind(server, (sockaddr*)&addr, sizeof(addr));

    // 5. Listen for incoming connections
    listen(server, 1);
    std::cout << "Server started at 127.0.0.1:8080\n";
    std::cout << "Waiting for client...\n";

    // 6. Accept one client
    sockaddr_in client;
    int clientSize = sizeof(client);
    SOCKET clientSocket = accept(server, (sockaddr*)&client, &clientSize);

    std::cout << "Client connected!\n";

    char buffer[1024];
    std::string reply;

    // 7. Chat loop
    while (true) {
        // Receive message
        int len = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
        if (len <= 0) break;

        buffer[len] = '\0';
        std::cout << "Client: " << buffer << "\n";

        // Send reply
        std::cout << "Enter reply: ";
        std::getline(std::cin, reply);
        send(clientSocket, reply.c_str(), reply.length(), 0);
    }

    // 8. Cleanup
    closesocket(clientSocket);
    closesocket(server);
    WSACleanup();

    return 0;
}
