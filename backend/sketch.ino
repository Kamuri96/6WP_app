#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "aiiit";
const char* password = "20070625AF";
const char* serverName = "http://localhost:3001/todos";

const int ledPin = 27; // ESP32の内蔵LED（ボードによっては変更）

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("WiFi接続中...");
  }
  Serial.println("WiFi接続完了！");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    int httpResponseCode = http.GET();

    if (httpResponseCode == 200) {
      String payload = http.getString();
      Serial.println(payload); // 受け取ったJSONを出力

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      bool hasTODO = false;

      for (JsonObject todo : doc.as<JsonArray>()) {
        const char* status = todo["status"];
        if (strcmp(status, "TODO") == 0) {
          hasTODO = true;
          break;
        }
      }

      // LED制御：TODOがあれば点灯、なければ消灯
      digitalWrite(ledPin, hasTODO ? HIGH : LOW);
    } else {
      Serial.println("APIからの取得に失敗");
      Serial.printf("HTTP Response code: %d\n", httpResponseCode); 
    }

    http.end();
  }

  delay(5000); // 5秒に1回チェック
}
