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

    // 2. Create socket
    SOCKET client = socket(AF_INET, SOCK_STREAM, 0);

    // 3. Server address
    sockaddr_in server;
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr(HOST);
    server.sin_port = htons(PORT);

    // 4. Connect to server
    if (connect(client, (sockaddr*)&server, sizeof(server)) == SOCKET_ERROR) {
        std::cout << "Failed to connect!\n";
        return 1;
    }

    // 5. Ask user for filename
    std::string filename;
    std::cout << "Enter filename to download: ";
    std::getline(std::cin, filename);

    // 6. Send filename to server
    send(client, filename.c_str(), filename.size(), 0);

    // 7. Open file to save received data
    std::ofstream file("received_" + filename, std::ios::binary);

    char buffer[1024];
    int bytes;

    std::cout << "Receiving file...\n";

    // 8. Receive file data until server closes connection
    while ((bytes = recv(client, buffer, sizeof(buffer), 0)) > 0) {
        file.write(buffer, bytes);
    }

    std::cout << "File saved as: received_" << filename << "\n";

    // 9. Cleanup
    file.close();
    closesocket(client);
    WSACleanup();

    return 0;
}
