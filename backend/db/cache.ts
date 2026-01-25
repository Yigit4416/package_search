import { LRUCache } from "lru-cache";
import { NotFoundError } from "../error_class/custom-errors.js";
import { AurPackage } from "../types/aur.js";
import { ArchPackage } from "../types/pacman.js";
import { WingetPackage } from "../types/winget.js";

// Options for the caches
const options = {
    max: 500, // Maximum 500 items
    ttl: 1000 * 60 * 60, // 1 hour TTL
    allowStale: false,
    updateAgeOnGet: true,
};

const wingetCache = new LRUCache<string, WingetPackage>(options);
const pacmanCache = new LRUCache<string, ArchPackage>(options);
const aurCache = new LRUCache<number, AurPackage>(options);

export async function wingetStoreData(data: WingetPackage[]) {
    data.forEach((singleData) => {
        // Cache key could be just ID, or composite if needed. Using ID for now.
        wingetCache.set(singleData.Id, singleData);
    });
}

export function wingetGetData(id: string) {
    console.log(`Checking Winget Cache for: ${id}`);
    const result = wingetCache.get(id);

    if (!result) {
        console.log("Cache Miss");
        throw new NotFoundError(`${id} winget package not found`);
    }

    console.log("Cache Hit");
    return result;
}

export async function pacmanStoreData(data: ArchPackage[]) {
    data.forEach((singleData) => {
        const key = `${singleData.pkgname}-${singleData.arch}`;
        pacmanCache.set(key, singleData);
    });
}

export async function pacmanGetData(id: string) {
    console.log(`Checking Pacman Cache for: ${id}`);
    const result = pacmanCache.get(id);

    if (!result) {
        console.log("Cache Miss");
        throw new NotFoundError(`${id} pacman package not found`);
    }

    console.log("Cache Hit");
    return result;
}

export async function aurStoreData(data: AurPackage[]) {
    data.forEach((singleData) => {
        aurCache.set(singleData.ID, singleData);
    });
}

export async function aurGetData(id: number) {
    console.log(`Checking AUR Cache for: ${id}`);
    const result = aurCache.get(id);

    if (!result) {
        console.log("Cache Miss");
        throw new NotFoundError(`${id} AUR package not found`);
    }

    console.log("Cache Hit");
    return result;
}
