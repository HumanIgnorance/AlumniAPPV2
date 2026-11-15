// ============================================================
// zipStore.js — tiny, dependency-free ZIP writer ("store" = no compression).
// Photos are already compressed (JPEG/PNG/WebP), so storing them as-is is
// as small as deflating them and keeps this file ~80 lines.
// Used by saveImage.jsx so Android can save MANY photos with ONE download
// (several <a download> clicks make Chrome ask "Allow multiple downloads?"
// and then drop every file after the first one).
// ============================================================

let CRC_TABLE = null;
const crc32 = (bytes) => {
    if (!CRC_TABLE) {
        CRC_TABLE = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            CRC_TABLE[n] = c >>> 0;
        }
    }
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
        crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
};

const dosDateTime = (d) => {
    const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    return { time: time & 0xffff, date: date & 0xffff };
};

/**
 * files: [{ name: string, data: Blob | File }]  ->  Promise<Blob> (application/zip)
 * Names must already be unique.
 */
export async function createZipBlob(files) {
    const encoder = new TextEncoder();
    const { time, date } = dosDateTime(new Date());
    const chunks = [];
    const central = [];
    let offset = 0;

    for (const file of files) {
        const name = encoder.encode(file.name);
        const data = new Uint8Array(await file.data.arrayBuffer());
        const crc = crc32(data);

        const local = new DataView(new ArrayBuffer(30));
        local.setUint32(0, 0x04034b50, true);
        local.setUint16(4, 20, true);
        local.setUint16(6, 0x0800, true); // UTF-8 file names
        local.setUint16(8, 0, true); // store
        local.setUint16(10, time, true);
        local.setUint16(12, date, true);
        local.setUint32(14, crc, true);
        local.setUint32(18, data.length, true);
        local.setUint32(22, data.length, true);
        local.setUint16(26, name.length, true);
        local.setUint16(28, 0, true);
        chunks.push(local.buffer, name, data);

        const cd = new DataView(new ArrayBuffer(46));
        cd.setUint32(0, 0x02014b50, true);
        cd.setUint16(4, 20, true);
        cd.setUint16(6, 20, true);
        cd.setUint16(8, 0x0800, true);
        cd.setUint16(10, 0, true);
        cd.setUint16(12, time, true);
        cd.setUint16(14, date, true);
        cd.setUint32(16, crc, true);
        cd.setUint32(20, data.length, true);
        cd.setUint32(24, data.length, true);
        cd.setUint16(28, name.length, true);
        cd.setUint32(42, offset, true);
        central.push(cd.buffer, name);

        offset += 30 + name.length + data.length;
    }

    const centralSize = central.reduce((n, c) => n + (c.byteLength ?? c.length), 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);

    return new Blob([...chunks, ...central, end.buffer], { type: "application/zip" });
}
