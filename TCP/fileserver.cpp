#include <winsock2.h>
#include <iostream>
#include <fstream>
#include <string>

#pragma comment(lib, "ws2_32.lib")

#define PORT 9090
#define HOST "127.0.0.1"

int main() {

    // 1. Start Winsock
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    // 2. Create server socket
    SOCKET server = socket(AF_INET, SOCK_STREAM, 0);

    // 3. Setup address
    sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = inet_addr(HOST);
    addr.sin_port = htons(PORT);

    // 4. Bind
    bind(server, (sockaddr*)&addr, sizeof(addr));

    // 5. Listen
    listen(server, 1);
    std::cout << "Server running at " << HOST << ":" << PORT << std::endl;
    std::cout << "Waiting for file request...\n";

    // 6. Accept client
    sockaddr_in client;
    int clientSize = sizeof(client);
    SOCKET clientSocket = accept(server, (sockaddr*)&client, &clientSize);

    // 7. Receive filename
    char buffer[1024];
    int bytes = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    buffer[bytes] = '\0';
    std::string filename = buffer;

    std::cout << "Client requested: " << filename << std::endl;

    // 8. Open file
    std::ifstream file(filename, std::ios::binary);
    if (!file) {
        std::string error = "File not found";
        send(clientSocket, error.c_str(), error.size(), 0);
        std::cout << "File not found\n";
    } else {
        std::cout << "Sending file...\n";

        while (!file.eof()) {
            file.read(buffer, sizeof(buffer));
            int read = file.gcount();
            if (read > 0) {
                send(clientSocket, buffer, read, 0);
            }
        }

        std::cout << "File sent successfully.\n";
    }

    // 9. Cleanup
    file.close();
    closesocket(clientSocket);
    closesocket(server);
    WSACleanup();

    return 0;
}
