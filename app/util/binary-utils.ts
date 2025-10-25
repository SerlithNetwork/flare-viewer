import pako from 'pako';

export function b64ToBytes(b64: string) : Uint8Array<ArrayBufferLike> {
    const bString = atob(b64)
    const len = bString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) bytes[i] = bString.charCodeAt(i)
    return bytes
}

export function b64UnzipBytes(b64: string) : Uint8Array<ArrayBufferLike> {
    const zipped = b64ToBytes(b64)
    return pako.inflate(zipped)
}

export async function binaryUnzipBytes(array: ArrayBuffer | Blob) : Promise<Uint8Array<ArrayBufferLike>> {
    let buffer: ArrayBuffer
    if (array instanceof Blob) {
        buffer = await array.arrayBuffer()
    } else {
        buffer = array
    }
    return pako.inflate(buffer)
}
