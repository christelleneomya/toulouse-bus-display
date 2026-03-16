#!/usr/bin/env python3
import json
import os
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 9000
TISSEO_BASE_URL = "https://api.tisseo.fr/v2/stops_schedules.json"


class AppHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/tisseo":
            self.handle_tisseo_proxy(parsed)
            return

        super().do_GET()

    def handle_tisseo_proxy(self, parsed):
        try:
            query = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)

            params = {}
            for key, values in query.items():
                if not values:
                    continue
                params[key] = values[-1]

            required = ["operatorCode", "network", "key"]
            missing = [name for name in required if not params.get(name)]
            if missing:
                self.send_json(
                    400,
                    {
                        "error": f"Paramètres manquants: {', '.join(missing)}"
                    }
                )
                return

            upstream_url = TISSEO_BASE_URL + "?" + urllib.parse.urlencode(params)

            request = urllib.request.Request(
                upstream_url,
                headers={
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 Senioriales-Bus-Display/1.0"
                },
                method="GET",
            )

            with urllib.request.urlopen(request, timeout=20) as response:
                body = response.read()
                status = response.getcode()
                content_type = response.headers.get("Content-Type", "application/json; charset=utf-8")

            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        except urllib.error.HTTPError as exc:
            try:
                body = exc.read().decode("utf-8", errors="replace")
            except Exception:
                body = str(exc)

            self.send_json(
                exc.code,
                {
                    "error": f"Erreur API Tisséo",
                    "details": body
                }
            )
        except Exception as exc:
            self.send_json(
                502,
                {
                    "error": "Erreur proxy locale",
                    "details": str(exc)
                }
            )

    def send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    ThreadingHTTPServer.allow_reuse_address = True
    server = ThreadingHTTPServer(("127.0.0.1", PORT), AppHandler)
    print(f"Serveur lancé sur http://localhost:{PORT}")
    server.serve_forever()