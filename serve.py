"""Dev server: static files with caching disabled so edits show on reload."""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8141
    ThreadingHTTPServer(("127.0.0.1", port), NoCache).serve_forever()
