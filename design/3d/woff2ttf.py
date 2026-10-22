# Convierte WOFF 1.0 a TTF/OTF (Blender no lee WOFF). Uso: python woff2ttf.py in.woff out.ttf
import struct, sys, zlib

def convert(src, dst):
    b = open(src, "rb").read()
    sig, flavor, _, n = struct.unpack(">4sIIH", b[:14])
    assert sig == b"wOFF", "no es WOFF 1.0"
    tables = []
    for i in range(n):
        tag, off, clen, olen, ck = struct.unpack(">4sIIII", b[44 + i * 20 : 64 + i * 20])
        data = b[off : off + clen]
        tables.append((tag, ck, zlib.decompress(data) if clen < olen else data))
    es = max(k for k in range(16) if 2 ** k <= n)
    out = struct.pack(">IHHHH", flavor, n, 2 ** es * 16, es, n * 16 - 2 ** es * 16)
    pos, body = 12 + 16 * n, b""
    for tag, ck, data in tables:
        out += struct.pack(">4sIII", tag, ck, pos + len(body), len(data))
        body += data + b"\0" * (-len(data) % 4)
    open(dst, "wb").write(out + body)

if __name__ == "__main__":
    convert(sys.argv[1], sys.argv[2])
